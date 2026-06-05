<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllMealsService } from '@/services/mealsService'
import { useAuthStore } from '@/stores/authStore.js'
import Header from '@/components/Header.vue'
import MealsListView from '@/views/MealsListView.vue'

const authStore = useAuthStore()
const router = useRouter()

// --- State ---
const meals         = ref([])
const isLoading     = ref(true)
const error         = ref(null)
const activeFilter  = ref('tous')   // 'tous' | clé de CATEGORIES
const searchQuery   = ref('')
const sortOrder     = ref('recent') // 'recent' | 'ancien' | 'prix_asc' | 'prix_desc'

// --- Chargement ---
onMounted(async () => {
  try {
    meals.value = await fetchAllMealsService(authStore.accessToken)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})

/*
  Catégories détectées sur le nom du plat.
  On cherche si le nom contient l'un des mots-clés (insensible à la casse).
  Ajoute autant de catégories que nécessaire ici.
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

// --- Stats ---
const stats = computed(() => ({
  total:         meals.value.length,
  disponibles:   meals.value.filter(m => m.is_available === 1).length,
  indisponibles: meals.value.filter(m => m.is_available !== 1).length,
  prixMoyen:     meals.value.length
      ? (meals.value.reduce((sum, m) => sum + Number(m.price), 0) / meals.value.length).toFixed(2)
      : '0.00',
}))

// --- Computed : filtre + recherche + tri ---
const filteredMeals = computed(() => {
  let result = [...meals.value]

  // Filtre catégorie
  if (activeFilter.value !== 'tous') {
    result = result.filter(m => getMealCategory(m) === activeFilter.value)
  }

  // Recherche par nom
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(q))
  }

  // Tri
  if (sortOrder.value === 'prix_asc')  result.sort((a, b) => Number(a.price) - Number(b.price))
  if (sortOrder.value === 'prix_desc') result.sort((a, b) => Number(b.price) - Number(a.price))
  if (sortOrder.value === 'az')        result.sort((a, b) => a.name.localeCompare(b.name))
  if (sortOrder.value === 'za')        result.sort((a, b) => b.name.localeCompare(a.name))

  return result
})
</script>

<template>
  <Header />
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-6 py-10">

      <!-- En-tête -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Menu</h1>
          <p class="text-gray-500 mt-1 text-sm">Ajouter, modifier et activer les plats de la carte.</p>
        </div>
        <button
            @click="router.push('/meals/create')"
            class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <span class="text-lg leading-none">+</span>
          Nouveau plat
        </button>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 mb-6 text-sm">
        {{ error }}
      </div>

      <!-- Stats -->
      <div v-if="!isLoading && !error" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Plats au menu</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Disponibles</p>
          <p class="text-2xl font-bold text-green-500">{{ stats.disponibles }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Indisponibles</p>
          <p class="text-2xl font-bold text-red-400">{{ stats.indisponibles }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Prix moyen</p>
          <p class="text-2xl font-bold text-orange-500">{{ stats.prixMoyen }} €</p>
        </div>
      </div>

      <!-- Filtres + recherche -->
      <div v-if="!isLoading && !error" class="flex flex-wrap items-center justify-between gap-4 mb-4">

        <!-- Onglets catégories -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
              @click="activeFilter = 'tous'"
              :class="activeFilter === 'tous' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Tous
          </button>
          <button
              v-for="cat in CATEGORIES"
              :key="cat.key"
              @click="activeFilter = cat.key"
              :class="activeFilter === cat.key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Recherche + tri -->
        <div class="flex items-center gap-3">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un plat..."
              class="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white w-48"
          />
          <select
              v-model="sortOrder"
              class="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="az">Nom A→Z</option>
            <option value="za">Nom Z→A</option>
            <option value="prix_asc">Prix ↑</option>
            <option value="prix_desc">Prix ↓</option>
          </select>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="isLoading" class="flex justify-center items-center py-24">
        <div class="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Table via MealsListView -->
      <MealsListView v-else-if="!error" :meals="filteredMeals" />

    </main>
  </div>
</template>