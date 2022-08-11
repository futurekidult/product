<template>
  <base-breadcrumb />
  <router-view />
  <mould-all v-if="isParent" />
</template>

<script>
import MouldAll from './mould-all.vue';

export default {
  components: {
    MouldAll
  },
  computed: {
    isParent() {
      return this.$route.name !== 'mould detail';
    }
  }
};
</script>
