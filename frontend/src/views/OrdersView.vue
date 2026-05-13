<script setup>
import { ref, onMounted } from 'vue'; // ✅ Importe ref et onMounted
import { fetchAllOrdersService } from "@/services/ordersService.js";
import { useAuthStore } from "@/stores/authStore.js";

const authStore = useAuthStore();

const orders = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    if (!authStore.token) {
      error.value = "Aucun token trouvé. Veuillez vous reconnecter.";
      loading.value = false;
      return;
    }

    orders.value = await fetchAllOrdersService(authStore.token);
    console.log('Commandes chargées:', orders.value);
  } catch (err) {
    error.value = err.message;
    console.error('Erreur lors du chargement:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <nav class="bg-white border-b border-gray-200 px-6 py-4">
    </nav>

    <!-- Main -->
    <main class="max-w-7xl mx-auto px-6 py-8">

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-bold text-gray-900 text-3xl mb-3">Commandes</h1>
          <p class="text-gray-500 text-m">Toutes les commandes en cours.</p>
        </div>
        <button>Nouvelle commande</button>
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
          <div class="flex items-center gap-3">
            <input />
            <select />
          </div>
        </div>

        <!-- table -->
        <table class="w-full">

          <!-- Header row -->
          <thead>
          <tr class="border-b border-gray-200">
            <th>ID</th>
            <th>Client</th>
            <th>Heure</th>
            <th>Plats</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Employé</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="order in orders" class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
            <td>
                {{ order.id }}
            </td>
            <td>
              {{ order.client_name }}
            </td>
            <td>
              {{ order.creation_date }}
            </td>
            <td>
              {{ order.total_price }}
            </td>
            <td>
              {{ order.order_served }}
            </td>
            <td>
              {{ order.employee_id }}
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