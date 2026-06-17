<!--
Title : OrderMealCard.vue
Desc : Displays a single meal card with an add button for the order creation
-->
<script>
export default {
  name: 'OrderMealCard',
  props: {
    meal: Object,
  },
  emits: ['add'],
}
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
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
          @click="$emit('add', meal)"
          class="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg flex items-center justify-center transition-colors"
        >+</button>
      </div>
    </div>
  </div>
</template>
