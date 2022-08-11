<template>
  <base-breadcrumb />
  <router-view />
  <demand-all v-if="isParent" />
</template>

<script>
import DemandAll from './demand-all.vue';

export default {
  components: {
    DemandAll
  },
  data() {
    return {
      activeName: 'demand list'
    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'demand detail' && this.$route.name !== 'demand edit';
    }
  }
};
</script>