<template>
  <demand-form
    :id="id"
    type="edit"
  />
</template>

<script>
import DemandForm from './common/demand-form.vue';

export default {
  components: {
    DemandForm
  },
  props: ['id']
};
</script>
