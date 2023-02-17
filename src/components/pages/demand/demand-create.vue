<template>
  <div>
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 创建需求
      </div>
      <demand-form type="create" />
    </div>
  </div>
</template>

<script>
import DemandForm from './common/demand-form.vue';

export default {
  components: {
    DemandForm
  }
};
</script>
