<!--
Author : Jason Edmonds, Milo Soupper, Sofian Hussein, Rodrigo Silva Riço
Date : 29.05.2026
Title : AddMealModal.vue
Desc : Modal to add meals to an existing order
-->
<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" @click.self="$emit('close')">
    <div class="bg-gray-100 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

      <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-800">Ajouter des plats · Commande #{{ orderId }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl font-light leading-none">✕</button>
      </div>

      <div class="flex gap-6 p-6 overflow-hidden flex-1 min-h-0">

        <div class="flex-1 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 overflow-hidden min-h-0">
          <h3 class="text-base font-semibold text-gray-800">Menu</h3>

          <div v-if="mealsLoading" class="text-gray-400 text-sm">Chargement...</div>
          <div v-else-if="mealsError" class="text-red-400 text-sm">{{ mealsError }}</div>
          <div v-else class="flex flex-col gap-3 overflow-y-auto pr-2" style="height: 500px;">
            <div
                v-for="meal in meals"
                :key="meal.id"
                class="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg shrink-0" :style="{ backgroundColor: meal.color || '#f3f4f6' }"></div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ meal.name }}</p>
                  <p v-if="meal.is_available === 1" class="text-xs text-gray-400">{{ Number(meal.price).toFixed(2) }} €</p>
                  <p v-else class="text-xs text-red-400">Indisponible</p>
                </div>
              </div>
              <button
                  v-if="meal.is_available === 1"
                  @click="addToCart(meal)"
                  class="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg flex items-center justify-center transition-colors shrink-0"
              >+</button>
            </div>
          </div>
        </div>

        <div class="w-72 flex flex-col gap-4">
          <div class="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 flex-1 overflow-hidden min-h-0">
            <h3 class="text-base font-bold text-gray-800">À ajouter</h3>

            <div class="flex flex-col gap-3 flex-1 overflow-y-auto">
              <div v-for="item in cart" :key="item.meal_id" class="flex flex-col gap-0.5">
                <p class="text-sm font-semibold text-gray-800">{{ item.name }}</p>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-400">{{ item.price.toFixed(2) }} € · ×{{ item.quantity }}</p>
                  <div class="flex items-center gap-2">
                    <button @click="decrement(item.meal_id)" class="w-6 h-6 border border-gray-200 rounded text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm">−</button>
                    <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
                    <button @click="addToCart({ id: item.meal_id, name: item.name, price: item.price, color: item.color, is_available: 1 })" class="w-6 h-6 border border-gray-200 rounded text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm">+</button>
                  </div>
                </div>
              </div>

              <p v-if="cart.length === 0" class="text-sm text-gray-300 text-center mt-4">Aucun plat sélectionné</p>
            </div>

            <div v-if="cart.length > 0" class="border-t border-gray-100 pt-4 text-sm">
              <div class="flex justify-between font-bold text-gray-800 text-base">
                <span>Total ajout</span>
                <span>{{ cartTotal.toFixed(2) }} €</span>
              </div>
            </div>
          </div>

          <p v-if="error" class="text-red-400 text-xs text-center">{{ error }}</p>

          <button
              @click="confirm"
              :disabled="cart.length === 0 || loading"
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
          >
            {{ loading ? 'Ajout en cours...' : `Confirmer (${cart.length} plat${cart.length > 1 ? 's' : ''})` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { fetchAllMealsService } from '@/services/mealsService'

const props = defineProps({
  orderId: { type: [String, Number], required: true }
})

const emit = defineEmits(['close', 'added'])

const authStore = useAuthStore()

const meals = ref([])
const mealsLoading = ref(false)
const mealsError = ref('')
const cart = ref([])
const loading = ref(false)
const error = ref('')

const cartTotal = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

onMounted(async () => {
  mealsLoading.value = true
  try {
    const result = await fetchAllMealsService(authStore.accessToken)
    console.log('meals:', result)
    meals.value = result
  } catch (e) {
    console.log('erreur:', e)
    mealsError.value = 'Impossible de charger les plats.'
  } finally {
    mealsLoading.value = false
  }
})

function addToCart(meal) {
  const existing = cart.value.find(i => i.meal_id === meal.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({ meal_id: meal.id, name: meal.name, price: Number(meal.price), color: meal.color, quantity: 1 })
  }
}

function decrement(meal_id) {
  const idx = cart.value.findIndex(i => i.meal_id === meal_id)
  if (idx === -1) return
  if (cart.value[idx].quantity === 1) {
    cart.value.splice(idx, 1)
  } else {
    cart.value[idx].quantity--
  }
}

async function confirm() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`http://localhost:3000/orders/${props.orderId}/meals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.accessToken}` },
      body: JSON.stringify({ meals: cart.value.map(i => ({ meal_id: i.meal_id, quantity: i.quantity })) })
    })
    if (res.status === 409) throw new Error('La commande est déjà servie, impossible d\'ajouter des plats.')
    if (!res.ok) throw new Error('Erreur lors de l\'ajout des plats.')
    emit('added')
    emit('close')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
