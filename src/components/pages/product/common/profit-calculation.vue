<template>
  <div class="profit-plan_title">
    核算利润表
  </div>

  <div class="profit-plan_title">
    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      class="profit-plan_table"
      :data="getProfit.list"
    >
      <el-table-column
        label="序号"
        type="index"
        width="100px"
      />
      <el-table-column
        label="市场"
        prop="market_desc"
      />
      <el-table-column
        label="平台"
        prop="platform"
      />
      <el-table-column
        label="是否开模"
        prop="is_mould_making"
      />
      <el-table-column label="调价记录">
        <template #default="scope">
          <el-button
            type="text"
            @click="showPricingList"
          >
            申请记录
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            type="text"
            @click="showAdjustPrice(scope.row.market)"
          >
            调价
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            @click="showEditProfit(scope.row.market)"
          >
            编辑
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            v-if="isShow"
            type="text"
            @click="deleteProfitItem(scope.row.market)"
          >
            删除
          </el-button>
          <span
            v-if="isShow"
            class="table-btn"
          >|</span>
          <el-button
            type="text"
            @click="showViewProfit(scope.row.market)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button
      :disabled="!isShow"
      class="profit-plan_btn"
      @click="addProfitCalculation"
    >
      + 新增核算利润
    </el-button>
  </div>

  <profit-form
    v-if="addProfitVisible"
    :dialog-visible="addProfitVisible"
    type="add"
    title="新增核算利润"
    @hide-dialog="closeProfitForm"
  />

  <profit-form
    v-if="viewProfitVisible"
    :id="marketId"
    :dialog-visible="viewProfitVisible"
    type="view"
    title="查看核算利润"
    @hide-dialog="closeViewProfitForm"
  />

  <profit-form
    v-if="editFormVisible"
    :id="marketId"
    :dialog-visible="editFormVisible"
    type="edit"
    title="编辑核算利润"
    @hide-dialog="closeEditForm"
  />

  <profit-edit
    v-if="editProfitVisible"
    :id="marketId"
    :dialog-visible="editProfitVisible"
    @hide-dialog="closeEditProfit"
  />

  <pricing-adjust
    v-if="adjustPriceVisible"
    :id="priceAdjustmentApplyId"
    :dialog-visible="adjustPriceVisible"
    :adjust-msg="adjustment"
    @hide-dialog="closeAdjustPrice"
  />

  <pricing-log
    v-if="getPricingVisible"
    :dialog-visible="getPricingVisible"
    :get-list="adjustmentList"
    @hide-dialog="closePricingList"
  />
</template>

<script>
import ProfitForm from './profit-form.vue';
import PricingAdjust from './pricing-adjust.vue';
import PricingLog from './pricing-log.vue';
import ProfitEdit from './profit-edit.vue';

export default {
  components: {
    ProfitForm,
    PricingAdjust,
    PricingLog,
    ProfitEdit
  },
  props: ['getProfit'],
  data() {
    return {
      addProfitVisible: false,
      viewProfitVisible: false,
      editProfitVisible: false,
      adjustPriceVisible: false,
      getPricingVisible: false,
      editFormVisible: false,
      marketId: 0,
      adjustment: {},
      adjustmentList: [],
      priceAdjustmentApplyId: 0
    };
  },
  computed: {
    isShow() {
      return this.getProfit.review_state === 10 ? true : false;
    }
  },
  methods: {
    async getAdjustment() {
      let params = {
        product_id: this.$route.params.productId,
        market: this.marketId
      };
      await this.$store.dispatch('product/project/getAdjustment', { params });
      this.adjustment = this.$store.state.product.project.adjustment;
      this.priceAdjustmentApplyId = this.adjustment.price_adjustment_apply_id;
      this.adjustPriceVisible = true;
    },
    async getAdjustmentList() {
      await this.$store.dispatch('product/project/getAdjustmentList');
      this.adjustmentList = this.$store.state.product.project.adjustmentList;
      this.getPricingVisible = true;
    },
    addProfitCalculation() {
      this.addProfitVisible = true;
    },
    showViewProfit(id) {
      this.viewProfitVisible = true;
      this.marketId = id;
    },
    closeProfitForm() {
      this.addProfitVisible = false;
    },
    closeViewProfitForm() {
      this.viewProfitVisible = false;
    },
    showEditProfit(id) {
      if (this.getProfit.review_state === 10) {
        this.editFormVisible = true;
      } else {
        this.editProfitVisible = true;
      }
      this.marketId = id;
    },
    showAdjustPrice(id) {
      this.marketId = id;
      this.getAdjustment();
    },
    closeAdjustPrice() {
      this.adjustPriceVisible = false;
    },
    showPricingList() {
      this.getAdjustmentList();
    },
    closePricingList() {
      this.getPricingVisible = false;
    },
    closeEditProfit() {
      this.editProfitVisible = false;
    },
    closeEditForm() {
      this.editFormVisible = false;
    },
    async deleteItem(val) {
      await this.$store.dispatch('product/project/deleteProfitItem', val);
    },
    deleteProfitItem(id) {
      let body = {
        prroduct_id: +this.$route.params.productId,
        market: id
      };
      this.deleteItem(body);
    }
  }
};
</script>

<style scoped>
.profit-plan_btn {
  margin-top: 15px;
}
</style>
