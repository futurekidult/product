<template>
  <section>
    <base-breadcrumb />
    <router-view />
    <price-all v-if="isParent" />
  </section>
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
