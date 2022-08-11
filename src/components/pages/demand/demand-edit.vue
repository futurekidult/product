<template>
  <div class="border">
    <demand-form
      :id="id"
      type="edit"
    />
  </div>
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