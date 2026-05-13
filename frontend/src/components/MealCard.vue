<!--
Author : Jason Edmonds, Sofian Hussein, Milo Soupper, Rodrigo Silva Riço
Date : 08.05.2026
Title : mealsCard.vue
Desc : This file display a meal from the API
-->
<script>
export default {
  name: 'MealCard',
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

    <!-- Description -->
    <td class="px-5 py-4 text-sm text-gray-400 max-w-xs">{{ meal.description }}</td>

    <!-- Price -->
    <td class="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
      {{ parseFloat(meal.price).toFixed(2) }} €
    </td>

    <!-- Availability -->
    <td class="px-5 py-4">
      <div class="flex items-center gap-2">
        <div :class="['relative w-10 h-5 rounded-full transition-colors', meal.is_available ? 'bg-emerald-400' : 'bg-gray-200']">
          <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', meal.is_available ? 'left-5' : 'left-0.5']"></div>
        </div>
        <span :class="['text-sm font-medium', meal.is_available ? 'text-emerald-500' : 'text-gray-400']">
          {{ meal.is_available ? 'Disponible' : 'Masqué' }}
        </span>
      </div>
    </td>

    <!-- Actions -->
    <td class="px-5 py-4">
      <div class="flex items-center gap-3">
        <button class="text-sm text-indigo-400 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors">
          ✎ Éditer
        </button>
        <button class="text-red-400 hover:bg-red-50 px-2 py-1 rounded-md transition-colors text-base">
          ✕
        </button>
      </div>
    </td>
  </tr>
</template>