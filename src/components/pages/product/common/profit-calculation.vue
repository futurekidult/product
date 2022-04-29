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
            v-if="isShow"
            type="text"
            @click="deleteProfitItem(scope.row.market)"
          >
            删除
          </el-button>
          <div v-else>
            <el-button
              type="text"
              @click="showEditProfit(scope.row.market)"
            >
              编辑
            </el-button>
            <span class="table-btn">|</span>

            <el-button
              type="text"
              @click="showViewProfit(scope.row.market)"
            >
              查看
            </el-button>
          </div>
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

  <profit-edit
    v-if="editProfitVisible"
    :id="marketId"
    :dialog-visible="editProfitVisible"
    @hide-dialog="closeEditProfit"
  />

  <pricing-adjust
    v-if="adjustPriceVisible"
    :id="marketId"
    :dialog-visible="adjustPriceVisible"
    @hide-dialog="closeAdjustPrice"
  />

  <pricing-log
    v-if="getPricingVisible"
    :dialog-visible="getPricingVisible"
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
  data() {
    return {
      addProfitVisible: false,
      viewProfitVisible: false,
      editProfitVisible: false,
      adjustPriceVisible: false,
      getPricingVisible: false,
      marketId: 0
    };
  },
  computed: {
    getProfit() {
      return this.$store.state.product.project.profit;
    },
    isShow() {
      return this.getProfit.review_state === 10 ? true : false;
    }
  },
  methods: {
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
      this.editProfitVisible = true;
      this.marketId = id;
    },
    showAdjustPrice(id) {
      this.adjustPriceVisible = true;
      this.marketId = id;
    },
    closeAdjustPrice() {
      this.adjustPriceVisible = false;
    },
    showPricingList() {
      this.getPricingVisible = true;
    },
    closePricingList() {
      this.getPricingVisible = false;
    },
    closeEditProfit() {
      this.editProfitVisible = false;
    },
    async deleteItem(id) {
      let body = {
        prroduct_id: this.$route.params.productId,
        market: id
      };
      await this.$store.dispatch('product/project/deleteProfitItem', body);
    },
    deleteProfitItem(val) {
      this.deleteItem(val);
    }
  }
};
</script>

<style scoped>
.profit-plan_btn {
  margin-top: 15px;
}
</style>
