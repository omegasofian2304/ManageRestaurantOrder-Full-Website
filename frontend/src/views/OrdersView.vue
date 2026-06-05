<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllOrdersService } from '@/services/ordersService.js'
import { useAuthStore } from '@/stores/authStore.js'
import Header from '@/components/Header.vue'

const authStore = useAuthStore()
const router = useRouter()

// --- State ---
const orders    = ref([])
const loading   = ref(true)
const error     = ref(null)

const activeFilter  = ref('tous')   // 'tous' | 'en_cours' | 'servie'
const searchQuery   = ref('')
const sortOrder     = ref('recent') // 'recent' | 'ancien'
const currentPage   = ref(1)
const perPage       = 8

// --- Chargement ---
onMounted(async () => {
  try {
    if (!authStore.accessToken) {
      error.value = "Aucun token trouvé. Veuillez vous reconnecter."
      return
    }
    orders.value = await fetchAllOrdersService(authStore.accessToken)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// --- Computed : filtrage + recherche + tri ---
const filteredOrders = computed(() => {
  let result = [...orders.value]

  // Filtre par statut
  if (activeFilter.value === 'en_cours') {
    result = result.filter(o => o.order_served !== 1)
  } else if (activeFilter.value === 'servie') {
    result = result.filter(o => o.order_served === 1)
  }

  // Recherche par nom client ou id
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
        o => o.client_name?.toLowerCase().includes(q) || String(o.id).includes(q)
    )
  }

  // Tri par date
  result.sort((a, b) => {
    const diff = new Date(b.creation_date) - new Date(a.creation_date)
    return sortOrder.value === 'recent' ? diff : -diff
  })

  return result
})

// Compteurs pour les onglets
const countAll     = computed(() => orders.value.length)
const countEnCours = computed(() => orders.value.filter(o => o.order_served !== 1).length)
const countServies = computed(() => orders.value.filter(o => o.order_served === 1).length)

// --- Pagination ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / perPage)))

// Remet à la page 1 si le filtre change
function setFilter(f) {
  activeFilter.value = f
  currentPage.value = 1
}

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredOrders.value.slice(start, start + perPage)
})

// --- Formatage ---
function formatTime(dateString) {
  return new Intl.DateTimeFormat('fr-CH', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString))
}
</script>

<template>
  <Header />
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-6 py-8">

      <!-- En-tête -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-bold text-gray-900 text-3xl mb-1">Commandes</h1>
          <p class="text-gray-500 text-sm">Toutes les commandes du service en cours.</p>
        </div>
        <button
            @click="router.push('/orders/create')"
            class="bg-orange-500 hover:bg-orange-600 px-5 py-2.5 font-semibold text-white rounded-lg text-sm transition-colors"
        >
          + Nouvelle commande
        </button>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 mb-6 text-sm">
        {{ error }}
      </div>

      <!-- Card principale -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <!-- Barre filtres -->
        <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">

          <!-- Onglets statut -->
          <div class="flex items-center gap-2">
            <button
                @click="setFilter('tous')"
                :class="activeFilter === 'tous' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Toutes ({{ countAll }})
            </button>
            <button
                @click="setFilter('en_cours')"
                :class="activeFilter === 'en_cours' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              En cours ({{ countEnCours }})
            </button>
            <button
                @click="setFilter('servie')"
                :class="activeFilter === 'servie' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Servies ({{ countServies }})
            </button>
          </div>

          <!-- Recherche + tri -->
          <div class="flex items-center gap-3">
            <input
                v-model="searchQuery"
                @input="currentPage = 1"
                type="text"
                placeholder="Rechercher (client, #id)..."
                class="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white w-56"
            />
            <select
                v-model="sortOrder"
                class="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="recent">Récent ▾</option>
              <option value="ancien">Ancien ▾</option>
            </select>
          </div>
        </div>

        <!-- Chargement -->
        <div v-if="loading" class="flex justify-center items-center py-24">
          <div class="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Tableau -->
        <table v-else class="w-full text-sm">
          <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-gray-500 font-medium px-6 py-3">ID</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Client</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Heure</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Total</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Statut</th>
            <th class="px-6 py-3"></th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-3 text-gray-800 font-medium">#{{ order.id }}</td>
            <td class="px-6 py-3 text-gray-800">{{ order.client_name }}</td>
            <td class="px-6 py-3 text-gray-500">{{ formatTime(order.creation_date) }}</td>
            <td class="px-6 py-3 font-semibold text-gray-800">{{ Number(order.total_price).toFixed(2) }} €</td>
            <td class="px-6 py-3">
              <span v-if="order.order_served === 1" class="text-green-500 font-semibold">Servie</span>
              <span v-else class="text-orange-500 font-semibold">En cours</span>
            </td>
            <td class="px-6 py-3">
              <router-link
                  :to="`/orders/${order.id}`"
                  class="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Voir détails
              </router-link>
            </td>
          </tr>

          <!-- Aucun résultat -->
          <tr v-if="paginatedOrders.length === 0">
            <td colspan="6" class="text-center text-gray-400 py-12 text-sm">
              Aucune commande trouvée.
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="!loading" class="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>Page {{ currentPage }} sur {{ totalPages }} · {{ filteredOrders.length }} commandes</span>
          <div class="flex gap-2">
            <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Préc.
            </button>
            <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suiv. ›
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>