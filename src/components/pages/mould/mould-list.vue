<template>
  <section>
    <router-view />
    <mould-all v-if="isParent" />
  </section>
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
