<template>
  <section>
    <router-view />
    <supply-all v-if="isParent" />
  </section>
</template>

<script>
import SupplyAll from './supply-all.vue';

export default {
  components: {
    SupplyAll
  },
  computed: {
    isParent() {
      return (
        this.$route.name !== 'supplier detail' &&
        this.$route.name !== 'supplier update' &&
        this.$route.name !== 'supplier qualification update'
      );
    }
  }
};
</script>
