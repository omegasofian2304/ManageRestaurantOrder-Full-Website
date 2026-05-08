<template>
  <div>
    <!--Search bar to search for a meal by its name-->
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Search meal"
    />
    <!--Button to execute the function that will get the meal by its name-->
    <button @click="handleSearch">Search</button>
  </div>
</template>

<script>
export default {
  name: 'MealSearchBar',

  data() {
    return {
      search: ''
    };
  },

  methods: {
    handleSearch() {
      if (this.search.trim()) {
        this.$emit('search', this.search.trim());
      }
    }
  }
};
</script>