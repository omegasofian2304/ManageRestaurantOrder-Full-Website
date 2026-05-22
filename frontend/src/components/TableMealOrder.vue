<script>
import { useAuthStore } from "@/stores/authStore.js";
import { getOrderDetailService } from "@/services/ordersService.js";
import MealCardOrder from "@/components/MealCardOrder.vue";

export default {
  name: "TableMealOrder",
  components: { MealCardOrder },
  props: {
    orderId: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['loaded'],
  data() {
    return {
      mealsOrdered: [],
      isLoading: false,
      error: null
    };
  },
  mounted() {
    this.loadMeals();
  },
  methods: {
    async loadMeals() {
      this.isLoading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const order = await getOrderDetailService(authStore.accessToken, this.orderId);
        this.mealsOrdered = order.meals;
        this.$emit('loaded', order);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<template>
  <div class="m-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div v-if="isLoading" class="px-5 py-4 text-sm text-gray-400">Chargement...</div>
    <div v-else-if="error" class="px-5 py-4 text-sm text-red-500">{{ error }}</div>
    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="border-b border-gray-100">
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Plat</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Prix unitaire</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Quantité</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Total</th>
        </tr>
      </thead>
      <tbody>
        <MealCardOrder v-for="meal in mealsOrdered" :key="meal.meal_id" :meal="meal" />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
</style>