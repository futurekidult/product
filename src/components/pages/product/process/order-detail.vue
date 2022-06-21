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
        {{ progress.final_price }}
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
        <div :class="changeColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-tabs
      v-model="activeName"
      type="card"
      class="order-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="SKU"
        name="sku"
      >
        <sku-name
          :sku-form="skuForm"
          :sku-id="skuId"
          :attachment="skuAttachment"
          :sku-entry-schedule="skuEntrySchedule"
          :schedule="skuSchedule"
        />
      </el-tab-pane>
      <el-tab-pane
        label="合同"
        name="contract"
      >
        <contract-list
          :contract="contract"
          :export-contract="exportContract"
          :purchase-contract="purchaseContract"
          :manual="manual"
          :diecuts="diecuts"
        />
      </el-tab-pane>
      <el-tab-pane
        label="大货样"
        name="pre-production-sample"
      >
        <production-sample :pre-product-sample="preProductSample" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SkuName from './order/sku-name.vue';
import ContractList from './order/contract-list.vue';
import ProductionSample from './order/pre-production-sample.vue';
import { formatterTime } from '../../../../utils';

export default {
  components: {
    SkuName,
    ContractList,
    ProductionSample
  },
  provide() {
    return {
      getSku: this.getSku,
      changeColor: this.changeColor,
      getContract: this.getContract,
      getPreProductSample: this.getPreProductSample
    };
  },
  props: ['orderId'],
  data() {
    return {
      activeName: 'sku',
      progress: {},
      schedule: {},
      skuForm: {},
      skuId: 0,
      skuAttachment: {},
      skuEntrySchedule: {},
      skuSchedule: {},
      contract: {},
      exportContract: {},
      purchaseContract: {},
      preProductSample: {},
      manual: {},
      diecuts: {}
    };
  },
  mounted() {
    this.getProgress();
    this.getSku();
  },
  methods: {
    async getProgress() {
      try {
        await this.$store.dispatch('product/order/getProgress', {
          params: {
            id: +this.$route.params.orderId
          }
        });
        this.progress = this.$store.state.product.order.progress;
        this.progress.actual_finish_time = formatterTime(
          this.progress.actual_finish_time
        );
        this.progress.estimated_finish_time = formatterTime(
          this.progress.estimated_finish_time
        );
        this.progress.final_price = `￥${this.progress.final_price}`;
      } catch (err) {
        return;
      }
    },
    async getSku() {
      this.$store.commit('product/order/setSkuLoading', true);
      try {
        await this.$store.dispatch('product/order/getSku', {
          params: {
            order_id: +this.$route.params.orderId
          }
        });
        this.skuForm = this.$store.state.product.order.sku.sku_info;
        this.skuId = this.$store.state.product.order.sku.id;
        this.skuAttachment = this.skuForm.project_plan_file;
        this.skuEntrySchedule =
          this.$store.state.product.order.sku.sku_entry_schedule;
        this.skuEntrySchedule.actual_finish_time = formatterTime(
          this.skuEntrySchedule.actual_finish_time
        );
        this.skuSchedule =
          this.$store.state.product.order.sku.sku_name_schedule;
        this.skuSchedule.actual_finish_time = formatterTime(
          this.skuSchedule.actual_finish_time
        );
      } catch (err) {
        return;
      }
    },
    async getContract() {
      this.$store.commit('product/order/setContractLoading', true);
      try {
        await this.$store.dispatch('product/order/getContract', {
          params: {
            order_id: +this.$route.params.orderId
          }
        });
        this.contract = this.$store.state.product.order.contract;
        this.exportContract = this.contract.export_contract;
        this.exportContract.actual_finish_time = formatterTime(
          this.exportContract.actual_finish_time
        );
        this.purchaseContract = this.contract.purchase_contract;
        this.purchaseContract.actual_finish_time = formatterTime(
          this.purchaseContract.actual_finish_time
        );
        this.manual = this.purchaseContract.product_manual_file;
        this.diecuts = this.purchaseContract.diecuts_file;
      } catch (err) {
        return;
      }
    },
    async getPreProductSample() {
      this.$store.commit('product/order/setPreProductLoading', true);
      try {
        await this.$store.dispatch('product/order/getPreProduct', {
          params: {
            order_id: +this.$route.params.orderId
          }
        });
        this.preProductSample =
          this.$store.state.product.order.preProductSample;
        this.preProductSample.estimated_arrival_time = formatterTime(
          this.preProductSample.estimated_arrival_time
        );
        this.preProductSample.actual_arrival_time = formatterTime(
          this.preProductSample.actual_arrival_time
        );
        this.preProductSample.actual_finish_time = formatterTime(
          this.preProductSample.actual_finish_time
        );
      } catch (err) {
        return;
      }
    },
    handleClick(tab) {
      if (tab.props.name === 'sku') {
        this.getSku();
      } else if (tab.props.name === 'contract') {
        this.getContract();
      } else {
        this.getPreProductSample();
      }
    },
    changeColor(val) {
      if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-ing';
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
