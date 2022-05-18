<template>
  <base-breadcrumb />
  <router-view />
  <price-all v-if="isParent" />
</template>

<script>
import PriceAll from './price-all.vue';

export default {
  components: {
    PriceAll
  },
  computed: {
    isParent() {
      return this.$route.name !== 'price detail';
    }
  }
};
</script>
