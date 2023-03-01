<template>
  <section>
    <router-view />
    <product-all v-if="isParent" />
  </section>
</template>

<script>
import ProductAll from './product-all.vue';

export default {
  components: {
    ProductAll
  },
  computed: {
    isParent() {
      return (
        this.$route.name !== 'product detail' &&
        this.$route.name !== 'order detail'
      );
    }
  }
};
</script>
