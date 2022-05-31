<template>
  <base-breadcrumb />
  <router-view />
  <supply-all v-if="isParent" />
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
        this.$route.name !== 'supplier update'
      );
    }
  }
};
</script>
