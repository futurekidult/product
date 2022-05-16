<template>
  <base-breadcrumb />
  <router-view />
  <supply-all v-if="hide" />
</template>

<script>
import SupplyAll from './supply-all.vue';

export default {
  components: {
    SupplyAll
  },
  computed: {
    hide() {
      return this.$route.name !== 'supplier detail';
    }
  }
};
</script>
