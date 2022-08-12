<template>
  <div>
    <div v-loading="$store.state.demand.demandDetailLoading">
      <demand-basic />
      <div class="border">
        <div class="select-title">
          <div>
            <span class="line">|</span> 需求信息
          </div>
        </div>
        <demand-form type="detail"/>
      </div>
    </div>
  </div>
</template>

<script>
import DemandForm from '../common/demand-form.vue';
import DemandBasic from '../common/demand-basic.vue'

export default {
  components: {
    DemandForm,
    DemandBasic
  },
  props: ['id']
};
</script>