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
  <div class="meal-card bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
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
            class="add-btn w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg flex items-center justify-center transition-colors"
        >+</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.meal-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.meal-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 15px 25px -8px rgba(249, 115, 22, 0.4),
  0 0 0 2px rgba(249, 115, 22, 0.5);
}

.add-btn {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-btn:hover {
  transform: scale(1.25) rotate(90deg);
}

.add-btn:active {
  transform: scale(0.9) rotate(90deg);
}

</style>