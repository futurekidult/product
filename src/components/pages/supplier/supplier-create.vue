<template>
  <section>
    <base-breadcrumb />
    <supplier-form type="create" />
  </section>
</template>

<script>
import SupplierForm from './common/supplier-form.vue';

export default {
  components: {
    SupplierForm
  }
};
</script>
