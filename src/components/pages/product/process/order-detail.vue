<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 下单详情
    </div>

    <div class="order-title">
      下单进度表
    </div>

    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="关联定价ID" />
      <el-table-column label="最终定价" />
      <el-table-column label="供应商ID" />
      <el-table-column label="计划完成时间" />
      <el-table-column label="实际完成时间" />
      <el-table-column label="状态" />
    </el-table>

    <el-tabs
      v-model="activeName"
      type="card"
      class="order-tabs"
    >
      <el-tab-pane
        label="SKU"
        name="sku"
      >
        <sku-name />
      </el-tab-pane>
      <el-tab-pane
        label="合同"
        name="contract"
      >
        <contract-list />
      </el-tab-pane>
      <el-tab-pane
        label="大货样"
        name="sample"
      >
        <production-sample />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SkuName from './order/sku-name.vue';
import ContractList from './order/contract-list.vue';
import ProductionSample from './order/pre-production-sample.vue';

export default {
  components: {
    SkuName,
    ContractList,
    ProductionSample
  },
  props: ['orderId'],
  data() {
    return {
      activeName: 'sku'
    };
  }
};
</script>

<style scoped>
.order-tabs {
  margin: 30px 0;
}
</style>
