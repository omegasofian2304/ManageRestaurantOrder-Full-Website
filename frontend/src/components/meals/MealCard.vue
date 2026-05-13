<template>
  <div>
    <h2>{{ meal.name }}</h2>
  </div>
</template>

<script>
export default {
  name: 'MealCard',

  props: {
    meal: {
      type: Object,
      required: true
    }
  }
};
</script>