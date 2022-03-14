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
  provide() {
    return {
      getList: this.getTable
    };
  },
  data() {
    return {
      activeName: 'demand list'
    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'demand detail';
    }
  },
  created() {
    this.getTable();
  },
  methods: {
    async getTable() {
      await this.$store.dispatch('demand/getData');
    }
  }
};
</script>
