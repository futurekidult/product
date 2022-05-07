<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 下单详情
    </div>

    <div class="order-title">
      下单进度表
    </div>

    <el-descriptions
      :column="6"
      direction="vertical"
      border
    >
      <el-descriptions-item label="关联定价ID">
        {{ progress.product_id }}
      </el-descriptions-item>
      <el-descriptions-item label="最终定价">
        ￥{{ progress.final_price }}
      </el-descriptions-item>
      <el-descriptions-item label="供应商ID">
        {{ progress.supplier_id }}
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ progress.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        {{ progress.state_desc }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- <el-tabs
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
        name="pre-production-sample"
      >
        <production-sample />
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
// import SkuName from './order/sku-name.vue';
// import ContractList from './order/contract-list.vue';
// import ProductionSample from './order/pre-production-sample.vue';

export default {
  components: {
    // SkuName,
    // ContractList,
    // ProductionSample
  },
  props: ['orderId'],
  data() {
    return {
      activeName: 'sku',
      progress: {},
      schedule: {},
      sku: {}
    };
  },
  computed: {},
  mounted() {
    this.getProgress();
  },
  methods: {
    async getProgress() {
      await this.$store.dispatch('product/order/getProgress', {
        params: {
          id: this.orderId
        }
      });
      this.progress = this.$store.state.product.order.progress;
    },
    async getContract() {
      await this.$store.dispatch('product/order/getContract', {
        params: {
          order_id: this.$route.params.orderId
        }
      });
    },
    async getPreProductSample() {
      await this.$store.dispatch('product/order/getPreProduct', {
        params: { order_id: this.$route.params.orderId }
      });
    },
    handleClick(tab) {
      if (tab.props.name === 'contract') {
        this.getContract();
      } else if (tab.props.name === 'pre-production-sample') {
        this.getPreProductSample();
      }
    }
  }
};
</script>

<style scoped>
.order-tabs {
  margin: 30px 0;
}
</style>
