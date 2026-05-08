<template>
  <div>
    <MealSearchBar @search="handleSearch" />

    <div v-if="isLoading">loading...</div>

    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <MealCard
          v-for="meal in filteredMeals"
          :key="meal.id"
          :meal="meal"
          @click="selectMeal(meal)"
      />
      <div v-if="filteredMeals.length === 0">No meals found</div>
    </div>
  </div>
</template>

<script>
import MealSearchBar from '../components/meals/MealsSearchBar.vue';
import MealCard from '../components/meals/MealCard.vue';
import { fetchAllMealsService } from '../services/mealsService';

export default {
  name: 'MealsView',

  components: {
    MealSearchBar,
    MealCard
  },

  data() {
    return {
      meals: [],
      searchQuery: '',
      isLoading: false,
      error: null
    };
  },

  computed: {
    filteredMeals() {
      if (!this.searchQuery) {
        return this.meals;    //returns all meals if there is no search
      }
      return this.meals.filter(
          meal => meal.name.toLowerCase().includes(this.searchQuery.toLowerCase()) //Show all meals that includes search
      );
    }
  },

  mounted() {
    this.loadMeals();       // loads all meals as soon as the page is opened
  },

  methods: {
    async loadMeals(token) {
      this.isLoading = true;
      this.error = null;

      try {
        this.meals = await fetchAllMealsService(token);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    handleSearch(name) {
      this.searchQuery = name;
    },

    selectMeal(meal) {
      this.$emit('mealSelected', meal);
    }
  }
};
</script>