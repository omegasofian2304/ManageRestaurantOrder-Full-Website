<script>
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { fetchAllMealsService } from '@/services/mealsService'
import Header from '@/components/Header.vue'
import OrderMealList from '@/components/orders/OrderMealList.vue'

export default {
  name: 'CreateOrderView',
  components: { Header, OrderMealList },
  data() {
    const orderStore = useOrderStore()
    return {
      meals: [],
      mealsLoading: false,
      mealsError: '',
      clientNameInput: orderStore.clientName,
    }
  },
  computed: {
    authStore() { return useAuthStore() },
    orderStore() { return useOrderStore() },
  },
  async mounted() {
    this.mealsLoading = true
    try {
      this.meals = await fetchAllMealsService(this.authStore.accessToken)
    } catch {
      this.mealsError = 'Impossible de charger les plats.'
    } finally {
      this.mealsLoading = false
    }
  },
  methods: {
    async handleCreateOrder() {
      await this.orderStore.createOrder(this.authStore.accessToken)
      this.mealsError = ''
    },
    async handleAddMeal(meal) {
      if (!this.orderStore.hasActiveOrder) {
        this.mealsError = "Créez d'abord la commande avant d'ajouter des plats."
        return
      }
      await this.orderStore.addMeal(this.authStore.accessToken, { ...meal, price: Number(meal.price) })
    },
    async handleDecrement(meal_id) {
      await this.orderStore.decrementMeal(this.authStore.accessToken, meal_id)
    },
    handleValidateOrder() {
      this.orderStore.clearOrder()
    },
  },
}
</script>

<template>
  <Header />
  <div class="min-h-screen bg-gray-100 p-6 flex gap-6">

    <!-- Colonne gauche : menu -->
    <OrderMealList
      :meals="meals"
      :isLoading="mealsLoading"
      :error="mealsError"
      @add="handleAddMeal"
    />

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
