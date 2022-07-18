<template>
  <product-basic 
    :attachment="attachment"
    :product-form="productForm"
    type="detail"
  />
</template>

<script>
import ProductBasic from '../../../common/product-basic-form.vue';

export default {
  components: {
    ProductBasic
  },
  props: ['attachment', 'productForm']
};
</script>

