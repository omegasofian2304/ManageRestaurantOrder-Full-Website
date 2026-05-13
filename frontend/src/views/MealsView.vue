<template>
  <div>
    <MealSearchBar @search="handleSearch" />

    <div v-if="isLoading">loading...</div>

    <div v-else-if="error">{{ error }}</div>

    <MealsListView v-else :meals="filteredMeals" />
  </div>
</template>

<script>
import MealSearchBar from '../components/meals/MealsSearchBar.vue';
import MealsListView from '../views/MealsListView.vue';
import { fetchAllMealsService } from '../services/mealsService';
import {useAuthStore} from "@/stores/authStore.js";

export default {
  name: 'MealsView',

  components: {
    MealSearchBar,
    MealsListView
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
    async loadMeals() {
      this.isLoading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        this.meals = await fetchAllMealsService(authStore.accessToken);
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