<template>
  <base-breadcrumb />
  <supplier-form />
</template>

<script>
import SupplierForm from './common/supplier-form.vue';

export default {
  components: {
    SupplierForm
  },
  data() {
    return {
      supplierStatus: 2
    };
  }
};
</script>
