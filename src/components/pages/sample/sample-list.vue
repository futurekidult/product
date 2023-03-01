<template>
  <section>
    <router-view />
    <sample-all v-if="isParent" />
  </section>
</template>

<script>
import SampleAll from './sample-all.vue';

export default {
  components: {
    SampleAll
  },
  computed: {
    isParent() {
      return this.$route.name !== 'sample detail';
    }
  }
};
</script>
