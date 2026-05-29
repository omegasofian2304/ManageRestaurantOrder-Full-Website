/*
Author : Jason Edmonds, Sofian Hussein, Milo Soupper, Rodrigo Silva Riço
Date : 27.05.2026
Title : orderStore.js
Desc : This file can store the current order tat is being created
*/
import { defineStore } from 'pinia'

const API_BASE_URL = 'http://localhost:3000'

export const useOrderStore = defineStore('order', {
    state: () => ({
        orderId: null,
        clientName: '',
        items: [],       // [{ meal_id, name, price, color, quantity }]
        loading: false,
        error: null
    }),

    getters: {
        sousTotal: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        tva: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 0.10,
        total: (state) => {
            const st = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
            return st + st * 0.10
        },
        hasActiveOrder: (state) => state.orderId !== null
    },

    actions: {
        // 1. Créer la commande côté backend
        async createOrder(token) {
            if (!this.clientName || this.clientName.length < 2) {
                this.error = 'Le nom du client est requis (min. 2 caractères).'
                return false
            }
            this.loading = true
            this.error = null
            try {
                const res = await fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ clientName: this.clientName })
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Erreur création commande')
                this.orderId = data.id
                return true
            } catch (err) {
                this.error = err.message
                return false
            } finally {
                this.loading = false
            }
        },

        // 2. Ajouter un plat (ou incrémenter si déjà présent)
        async addMeal(token, meal) {
            if (!this.orderId) return
            const existing = this.items.find(i => i.meal_id === meal.id)
            const newQty = existing ? existing.quantity + 1 : 1

            try {
                if (existing) {
                    // Plat déjà dans la commande -> PATCH pour mettre à jour la quantité
                    const res = await fetch(`${API_BASE_URL}/orders/${this.orderId}/meals/${meal.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ quantity: newQty })
                    })
                    if (!res.ok) throw new Error('Erreur mise à jour quantité')
                    existing.quantity = newQty
                } else {
                    // Nouveau plat -> POST
                    const res = await fetch(`${API_BASE_URL}/orders/${this.orderId}/meals`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ meals: [{ meal_id: meal.id, quantity: 1 }] })
                    })
                    if (!res.ok) throw new Error('Erreur ajout plat')
                    this.items.push({ meal_id: meal.id, name: meal.name, price: meal.price, color: meal.color, quantity: 1 })
                }
            } catch (err) {
                this.error = err.message
            }
        },

        // 3. Décrémenter ou supprimer un plat
        async decrementMeal(token, meal_id) {
            if (!this.orderId) return
            const existing = this.items.find(i => i.meal_id === meal_id)
            if (!existing) return

            if (existing.quantity === 1) {
                await this.removeMeal(token, meal_id)
                return
            }

            const newQty = existing.quantity - 1
            try {
                const res = await fetch(`${API_BASE_URL}/orders/${this.orderId}/meals/${meal_id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ quantity: newQty })
                })
                if (!res.ok) throw new Error('Erreur mise à jour quantité')
                existing.quantity = newQty
            } catch (err) {
                this.error = err.message
            }
        },

        // 4. Supprimer un plat complètement
        async removeMeal(token, meal_id) {
            if (!this.orderId) return
            try {
                const res = await fetch(`${API_BASE_URL}/orders/${this.orderId}/meals/${meal_id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) throw new Error('Erreur suppression plat')
                this.items = this.items.filter(i => i.meal_id !== meal_id)
            } catch (err) {
                this.error = err.message
            }
        },

        // 5. Modifier le nom du client localement
        updateClientName(name) {
            this.clientName = name
        },

        // 6. Vider le store après validation
        clearOrder() {
            this.orderId = null
            this.clientName = ''
            this.items = []
            this.error = null
        }
    }
})