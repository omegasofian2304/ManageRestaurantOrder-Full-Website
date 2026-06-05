<script setup>

import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { fetchAllMealsService } from '@/services/mealsService'
import Header from '@/components/Header.vue'

const authStore  = useAuthStore()
const orderStore = useOrderStore()

// --- State ---
const meals          = ref([])
const mealsLoading   = ref(false)
const mealsError     = ref('')
const clientNameInput = ref(orderStore.clientName)

const activeCategory = ref('tous')  // 'tous' | clé de CATEGORIES
const searchQuery    = ref('')

/*
  Même logique que MealsView : catégorie détectée sur le nom du plat.
  Adapte les keywords à ta carte.
*/
const CATEGORIES = [
  { key: 'burger',  label: 'Burgers',  keywords: ['burger'] },
  { key: 'pizza',   label: 'Pizzas',   keywords: ['pizza'] },
]

function getMealCategory(meal) {
  const name = meal.name.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => name.includes(kw))) return cat.key
  }
  return 'autre'
}

// --- Chargement ---
onMounted(async () => {
  mealsLoading.value = true
  try {
    meals.value = await fetchAllMealsService(authStore.accessToken)
  } catch {
    mealsError.value = 'Impossible de charger les plats.'
  } finally {
    mealsLoading.value = false
  }
})

// --- Computed : filtre catégorie + recherche ---
const filteredMeals = computed(() => {
  let result = [...meals.value]

  // Filtre catégorie
  if (activeCategory.value !== 'tous') {
    result = result.filter(m => getMealCategory(m) === activeCategory.value)
  }

  // Recherche par nom
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(q))
  }

  return result
})

// --- Actions commande ---
async function handleCreateOrder() {
  await orderStore.createOrder(authStore.accessToken)
  mealsError.value = ''
}

async function handleAddMeal(meal) {
  if (!orderStore.hasActiveOrder) {
    mealsError.value = "Créez d'abord la commande avant d'ajouter des plats."
    return
  }
  await orderStore.addMeal(authStore.accessToken, { ...meal, price: Number(meal.price) })
}

async function handleDecrement(meal_id) {
  await orderStore.decrementMeal(authStore.accessToken, meal_id)
}

function handleValidateOrder() {
  orderStore.clearOrder()
}
</script>

<template>
  <Header />
  <div class="min-h-screen bg-gray-100 p-6 flex gap-6">

    <!-- Colonne gauche : menu -->
    <div class="flex-1 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">

      <!-- En-tête -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Menu</h2>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un plat..."
            class="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white w-56"
        />
      </div>

      <!-- Filtres catégories -->
      <div class="flex gap-2 flex-wrap">
        <button
            @click="activeCategory = 'tous'"
            :class="activeCategory === 'tous' ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-500 border-gray-200 hover:border-orange-300'"
            class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
        >
          Tous
        </button>
        <button
            v-for="cat in CATEGORIES"
            :key="cat.key"
            @click="activeCategory = cat.key"
            :class="activeCategory === cat.key ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-500 border-gray-200 hover:border-orange-300'"
            class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Grille des plats -->
      <div v-if="mealsLoading" class="text-gray-400 text-sm">Chargement...</div>
      <div v-else-if="mealsError && meals.length === 0" class="text-red-400 text-sm">{{ mealsError }}</div>
      <div v-else class="grid grid-cols-4 gap-4 overflow-y-auto">
        <div
            v-for="meal in filteredMeals"
            :key="meal.id"
            class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
        >
          <!-- Couleur placeholder -->
          <div class="h-28 w-full" :style="{ backgroundColor: meal.color || '#f3f4f6' }"></div>

          <div class="p-3">
            <p class="text-sm font-semibold text-gray-800">{{ meal.name }}</p>
            <div class="flex items-center justify-between mt-1">
              <p v-if="meal.is_available === 1" class="text-sm text-gray-500">
                {{ Number(meal.price).toFixed(2) }} €
              </p>
              <p v-else class="text-sm text-red-400">Indisponible</p>
              <button
                  v-if="meal.is_available === 1"
                  @click="handleAddMeal(meal)"
                  class="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg flex items-center justify-center transition-colors"
              >+</button>
            </div>
          </div>
        </div>

        <!-- Aucun résultat -->
        <p v-if="filteredMeals.length === 0" class="col-span-4 text-center text-gray-400 text-sm py-8">
          Aucun plat trouvé.
        </p>
      </div>
    </div>

    <!-- Colonne droite : ticket -->
    <div class="w-80 flex flex-col gap-4">
      <div class="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 flex-1">

        <!-- En-tête ticket -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-gray-800">
              {{ orderStore.hasActiveOrder ? `Ticket #${orderStore.orderId}` : 'Nouvelle commande' }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ orderStore.clientName || '...' }}</p>
          </div>
          <span
              v-if="orderStore.hasActiveOrder"
              class="bg-orange-100 text-orange-500 text-xs font-medium px-2.5 py-1 rounded-full"
          >En cours</span>
        </div>

        <!-- Nom du client -->
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1 block">Nom du client</label>
          <input
              v-model="clientNameInput"
              @input="orderStore.updateClientName(clientNameInput)"
              :disabled="orderStore.hasActiveOrder"
              type="text"
              placeholder="Nom du client"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Erreur store -->
        <p v-if="orderStore.error || mealsError" class="text-red-400 text-xs">
          {{ orderStore.error || mealsError }}
        </p>

        <!-- Liste des plats dans le ticket -->
        <div class="flex flex-col gap-3 flex-1 overflow-y-auto">
          <div
              v-for="item in orderStore.items"
              :key="item.meal_id"
              class="flex flex-col gap-0.5"
          >
            <p class="text-sm font-semibold text-gray-800">{{ item.name }}</p>
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-400">{{ item.price.toFixed(2) }} € · ×{{ item.quantity }}</p>
              <div class="flex items-center gap-2">
                <button
                    @click="handleDecrement(item.meal_id)"
                    class="w-6 h-6 border border-gray-200 rounded text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >−</button>
                <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
                <button
                    @click="handleAddMeal({ id: item.meal_id, name: item.name, price: item.price, color: item.color, available: true })"
                    class="w-6 h-6 border border-gray-200 rounded text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >+</button>
              </div>
            </div>
          </div>

          <p v-if="orderStore.items.length === 0" class="text-sm text-gray-300 text-center mt-4">
            Aucun plat ajouté
          </p>
        </div>

        <!-- Récapitulatif -->
        <div class="border-t border-gray-100 pt-4 flex flex-col gap-1 text-sm">
          <div class="flex justify-between text-gray-400">
            <span>Sous-total</span>
            <span>{{ orderStore.sousTotal.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>TVA (10%)</span>
            <span>{{ orderStore.tva.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between font-bold text-gray-800 text-base mt-1">
            <span>Total</span>
            <span>{{ orderStore.total.toFixed(2) }} €</span>
          </div>
        </div>
      </div>

      <!-- Bouton créer ou valider -->
      <button
          v-if="!orderStore.hasActiveOrder"
          @click="handleCreateOrder"
          :disabled="orderStore.loading"
          class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {{ orderStore.loading ? 'Création...' : 'Créer la commande' }}
      </button>

      <button
          v-else
          @click="handleValidateOrder"
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors"
      >
        Valider la commande
      </button>
    </div>

  </div>
</template>
