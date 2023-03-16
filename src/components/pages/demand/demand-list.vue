<template>
  <div>
    <router-view />
    <demand-all v-if="isParent" />
  </div>
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
      return (
        this.$route.name !== 'demand detail' &&
        this.$route.name !== 'demand edit' &&
        this.$route.name !== 'demand review'
      );
    }
  }
};
</script>
