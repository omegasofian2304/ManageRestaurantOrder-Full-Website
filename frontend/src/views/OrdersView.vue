<script setup>
import { ref, onMounted } from 'vue';
import { fetchAllOrdersService } from "@/services/ordersService.js";
import { useAuthStore } from "@/stores/authStore.js";
import Header from "@/components/Header.vue";

const authStore = useAuthStore();

const orders = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    if (!authStore.accessToken) {
      error.value = "Aucun token trouvé. Veuillez vous reconnecter.";
      loading.value = false;
      return;
    }

    orders.value = await fetchAllOrdersService(authStore.accessToken);
    console.log('Commandes chargées:', orders.value);
  } catch (err) {
    error.value = err.message;
    console.error('Erreur lors du chargement:', err);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-CH', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

</script>

<template>
  <Header />
  <div class="min-h-screen bg-gray-50">

    <!-- Main -->
    <main class="max-w-7xl mx-auto px-6 py-8">

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-bold text-gray-900 text-3xl mb-3">Commandes</h1>
          <p class="text-gray-500 text-m">Toutes les commandes en cours.</p>
        </div>
        <button class="bg-orange-500 p-3 font-bold text-white rounded-xl"> Nouvelle commande</button>
      </div>

      <!-- CARD CONTAINER -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">

        <!-- FILTERS BAR -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">

          <!-- TABS CONTAINER -->
          <div class="flex gap-2">
            <!-- Boutons tabs -->
          </div>

          <!-- Search + sort container -->
          <!--
          <div class="flex items-center gap-3">
            <input />
            <select />
          </div>
          -->
        </div>

        <!-- table -->
        <table class="w-full">

          <!-- Header row -->
          <thead>
          <tr class="border-b border-gray-200 text-gray-900">
            <th class="px-7 py-4 text-left">ID</th>
            <th class="px-7 py-4 text-left">Client</th>
            <th class="px-7 py-4 text-left">Heure</th>
            <th class="px-7 py-4 text-left">Total</th>
            <th class="px-7 py-4 text-left">Statut</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="order in orders" class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-gray-900">
            <td class="px-7 py-4 text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-7 py-4 text-gray-900">
              {{ order.client_name }}
            </td>
            <td class="px-7 py-4 text-gray-900">
              <div class="text-sm font-medium text-gray-900">
                à {{ formatTime(order.creation_date) }} le {{ formatDate(order.creation_date) }}
              </div>
            </td>
            <td class="px-8 py-4 font-semibold text-gray-900">
              {{ order.total_price }} CHF
            </td>
            <td class="px-8 py-4">
              <p v-if="order.order_served==1" class="text-green-500 font-medium">Servie</p>
              <p v-else class="text-orange-500 font-medium">En cours</p>
            </td>
            <td class="px-8 py-4">
              <router-link :to="`/orders/${order.id}`" class="inline-block bg-orange-500 px-4 py-3 font-bold text-white rounded-xl">
                Voir détail
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <span><!-- Page info --></span>
          <div class="flex gap-2"><!-- Buttons --></div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>

</style>