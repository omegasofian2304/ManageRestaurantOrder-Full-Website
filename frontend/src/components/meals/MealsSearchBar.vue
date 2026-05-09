<template>
  <div>
    <!--Search bar to search for a meal by its name-->
    <input
        v-model="search"
        type="text"
        placeholder="Search meal"
        @input="handleSearch"
    />
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
      this.$emit('search', this.search.trim());
    }
  }
};
</script>