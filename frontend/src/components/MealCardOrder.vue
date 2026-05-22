<script>
export default {
  name: 'MealCardOrder',
  props: {
    meal: Object,
  },
}
</script>

<template>
  <tr class="border-b border-gray-100 last:border-none hover:bg-gray-50">
    <!-- Name -->
    <td class="px-5 py-4 flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-amber-100 shrink-0"></div>
      <span class="text-sm font-semibold text-gray-800">{{ meal.name }}</span>
    </td>

    <!-- Price -->
    <td class="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
      {{ parseFloat(meal.unit_price).toFixed(2) }} €
    </td>

    <!-- Quantity -->
    <td class="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
      <button>+</button>
      {{ meal.quantity }}
      <button>-</button>
    </td>

    <!-- Total price -->
    <td class="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
      {{ (parseFloat(meal.unit_price) * meal.quantity).toFixed(2) }} €
    </td>
  </tr>
</template>

<style scoped>
</style>