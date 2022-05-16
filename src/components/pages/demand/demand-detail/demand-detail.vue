<template>
  <base-tag
    v-if="status === 1"
    mode="success"
    type="tag"
  >
    评审通过
  </base-tag>
  <base-tag
    v-if="status === 0"
    mode="danger"
    type="tag"
  >
    评审不通过
  </base-tag>
  <base-tag
    v-if="status === 2"
    mode="warning"
    type="tag"
  >
    待评审
  </base-tag>

  <product-description :status="status" />

  <demand-review v-if="status === 2" />

  <demand-form
    v-else
    type="detail"
  />
</template>

<script>
import DemandForm from '../common/demand-form.vue';
import DemandReview from '../demand-detail/demand-review/demand-review.vue';
import ProductDescription from '../common/prod-description.vue';

export default {
  components: {
    DemandForm,
    DemandReview,
    ProductDescription
  },
  props: ['id'],
  data() {
    return {
      status: 2
    };
  }
};
</script>
