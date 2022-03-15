<template>
  <base-breadcrumb />
  <router-view />
  <product-all v-if="isParent" />
</template>

<script>
import ProductAll from './product-all.vue';

export default {
  components: {
    ProductAll
  },
  computed: {
    isParent() {
      return this.$route.name !== 'product detail';
    }
  }
};
</script>
