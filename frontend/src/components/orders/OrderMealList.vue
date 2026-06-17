<!--
Title : OrderMealList.vue
Desc : Displays the meal grid with search and category filters for order creation
-->
<script>
import OrderMealCard from './OrderMealCard.vue'

const CATEGORIES = [
  { key: 'burger', label: 'Burgers', keywords: ['burger'] },
  { key: 'pizza',  label: 'Pizzas',  keywords: ['pizza'] },
]

export default {
  name: 'OrderMealList',
  components: { OrderMealCard },
  props: {
    meals:     Array,
    isLoading: Boolean,
    error:     String,
  },
  emits: ['add'],
  data() {
    return {
      activeCategory: 'tous',
      searchQuery: '',
      CATEGORIES,
    }
  },
  computed: {
    filteredMeals() {
      let result = [...this.meals]

      if (this.activeCategory !== 'tous') {
        result = result.filter(m => this.getMealCategory(m) === this.activeCategory)
      }

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        result = result.filter(m => m.name.toLowerCase().includes(q))
      }

      return result
    },
  },
  methods: {
    getMealCategory(meal) {
      const name = meal.name.toLowerCase()
      for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => name.includes(kw))) return cat.key
      }
      return 'autre'
    },
  },
}
</script>

<template>
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
      >Tous</button>
      <button
        v-for="cat in CATEGORIES"
        :key="cat.key"
        @click="activeCategory = cat.key"
        :class="activeCategory === cat.key ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-500 border-gray-200 hover:border-orange-300'"
        class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
      >{{ cat.label }}</button>
    </div>

    <!-- Grille -->
    <div v-if="isLoading" class="text-gray-400 text-sm">Chargement...</div>
    <div v-else-if="error && meals.length === 0" class="text-red-400 text-sm">{{ error }}</div>
    <div v-else class="grid grid-cols-4 gap-4 overflow-y-auto">
      <OrderMealCard
        v-for="meal in filteredMeals"
        :key="meal.id"
        :meal="meal"
        @add="$emit('add', meal)"
      />
      <p v-if="filteredMeals.length === 0" class="col-span-4 text-center text-gray-400 text-sm py-8">
        Aucun plat trouvé.
      </p>
    </div>

  </div>
</template>
