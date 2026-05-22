<!--
Author : Jason Edmonds, Sofian Hussein, Milo Soupper, Rodrigo Silva Riço
Date : 08.05.2026
Title : MealsListView.vue
Desc : This file display the list of meals from meal cards
-->
<script>
import MealCard from '../components/meals/MealCard.vue'
import Header from '../components/Header.vue'

export default {
  name: 'MealsMenu',
  components: { MealCard , Header },
  props: {
    meals: {
      type: Array
    }
  }
}
</script>

<template>
  <Header />
  <div class="m-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="w-full border-collapse bg-white">
      <thead>
        <tr class="border-b border-gray-100 bg-white">
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Plat</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Description</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Prix</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Disponible</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody>
      <MealCard v-for="meal in meals" :key="meal.id" :meal="meal" />
      </tbody>
    </table>
  </div>
</template>