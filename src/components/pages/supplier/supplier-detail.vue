<template>
  <base-tag
    v-if="supplierStatus === 1"
    mode="warning"
    type="tag"
  >
    待审批
  </base-tag>
  <base-tag
    v-if="supplierStatus === 2"
    mode="warning"
    type="tag"
  >
    审批通过
  </base-tag>
  <company-description :status="supplierStatus" />
</template>

<script>
import CompanyDescription from './common/company-description.vue';

export default {
  components: {
    CompanyDescription
  },
  props: ['id'],
  data() {
    return {
      supplierStatus: 1
    };
  }
};
</script>
