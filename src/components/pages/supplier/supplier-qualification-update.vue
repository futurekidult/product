<template>
  <supplier-form type="qualificationUpdate" />
</template>

<script>
import SupplierForm from './common/supplier-form.vue';

export default {
  components: {
    SupplierForm
  },
  props: ['id']
};
</script>
