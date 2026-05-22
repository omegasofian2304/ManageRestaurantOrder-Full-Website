<!--
Author : Jason Edmonds, Milo Soupper, Sofian Hussein, Rodrigo Silva Riço
Date : 21.05.2026
Title : OrderDetailView.vue
Desc : This file is used to display details from specified orders
-->
<template>
  <div class="min-h-screen bg-gray-100 p-8">

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
      <span class="hover:text-gray-600 cursor-pointer">Commandes</span>
      <span>›</span>
      <span class="text-gray-600 font-medium">#{{ orderId }}</span>
    </div>

    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-3xl font-bold text-gray-800">Commande #{{ orderId }} - {{ order?.client_name ?? '...' }}</h1>
          <span class="bg-orange-100 text-orange-500 text-sm font-medium px-3 py-1 rounded-full">
            En cours
          </span>
        </div>
        <p class="text-sm text-gray-400">Créée le {{ formattedDate }} · Employé : {{ order?.employee_id ?? '...' }}</p>
      </div>

      <!-- Boutons -->
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 border border-red-300 text-red-400 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          ✕ Supprimer
        </button>
        <button class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          ✓ Marquer servie
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="flex gap-6">

      <!-- Colonne gauche : composant plats -->
      <div class="flex-1 bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-base font-semibold text-gray-800">Plats de la commande</h2>
          <button class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Ajouter un plat
          </button>
        </div>

        <TableMealOrder :orderId="orderId" @loaded="onOrderLoaded" />
      </div>

      <!-- Colonne droite : récapitulatif -->
      <div class="w-80 flex flex-col gap-4">

        <!-- Récapitulatif -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-base font-semibold text-gray-800 mb-4">Récapitulatif</h2>

          <div class="flex flex-col gap-2 text-sm mb-4">
            <div class="flex justify-between text-gray-500">
              <span>Sous-total</span>
              <span class="text-gray-800 font-medium">{{ sousTotal.toFixed(2) }} €</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>TVA (10%)</span>
              <span class="text-gray-800 font-medium">{{ tva.toFixed(2) }} €</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span class="font-semibold text-gray-800">Total</span>
            <span class="text-xl font-bold text-gray-900">{{ total.toFixed(2) }} €</span>
          </div>
        </div>

        <!-- Temps d'attente -->
        <div class="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <div class="flex items-center gap-2 text-orange-500 font-medium text-sm mb-1">
            <span>⏱</span>
            <span>Temps d'attente</span>
          </div>
          <p class="text-orange-400 text-sm">{{ waitingTime }} min depuis la création</p>
        </div>

        <!-- Bouton marquer servie -->
        <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors">
          ✓ Marquer la commande servie
        </button>

        <!-- Historique -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-base font-semibold text-gray-800 mb-4">Historique</h2>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
              <span class="text-gray-400 w-10 shrink-0">...</span>
              <span>...</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
              <span class="text-gray-400 w-10 shrink-0">...</span>
              <span>...</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span class="text-gray-400 w-10 shrink-0">...</span>
              <span>...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import TableMealOrder from '@/components/TableMealOrder.vue'

const route = useRoute()
const orderId = computed(() => route.params.id)

const order = ref(null)

function onOrderLoaded(loadedOrder) {
  order.value = loadedOrder
}

const formattedDate = computed(() => {
  if (!order.value?.creation_date) return '...'
  return new Date(order.value.creation_date).toLocaleDateString('fr-CH')
})

const waitingTime = computed(() => {
  if (!order.value?.creation_date) return '...'
  const diff = Date.now() - new Date(order.value.creation_date).getTime()
  return Math.floor(diff / 60000)
})

// Valeur de test — à remplacer par les vraies données plus tard
const sousTotal = computed(() => order.value?.total_price ?? 10)

const tva = computed(() => sousTotal.value * 0.10)
const total = computed(() => sousTotal.value + tva.value)
</script>