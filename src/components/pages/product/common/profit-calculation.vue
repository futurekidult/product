<template>
  <section>
    <div class="profit-plan_title">
      核算利润表
    </div>

    <div class="profit-plan_title">
      <base-table
        :index-visible="true"
        :table-data="getProfit.list"
        :pagination-visible="false"
        :operation-width="200"
        :table-column="tableColumn"
      >
        <template #operation="operationProps">
          <div v-if="!isShow">
            <text-btn
              @handle-click="showPricingList(operationProps.row.market)"
            >
              记录
            </text-btn>
            <span class="table-btn">|</span>
            <text-btn
              @handle-click="showAdjustPrice(operationProps.row.market)"
            >
              调价
            </text-btn>
          </div>
        </template>
        <template #default="slotProps">
          <text-btn
            v-if="isShow"
            @handle-click="showEditProfit(slotProps.row.market)"
          >
            编辑
          </text-btn>
          <span
            v-if="isShow"
            class="table-btn"
          >|</span>
          <text-btn
            v-if="!isShow"
            @handle-click="ShowConfirmParamsDialog(slotProps.row.market)"
          >
            参数修改确认
          </text-btn>
          <span
            v-if="!isShow"
            class="table-btn"
          >|</span>
          <text-btn
            v-if="isShow"
            @handle-click="showDeleteDialog(slotProps.row.market)"
          >
            删除
          </text-btn>
          <span
            v-if="isShow"
            class="table-btn"
          >|</span>
          <text-btn @handle-click="showViewProfit(slotProps.row.market)">
            查看
          </text-btn>
        </template>
      </base-table>

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
      :close-on-click-modal="false"
      @hide-dialog="closeProfitForm"
    />

    <profit-form
      v-if="viewProfitVisible"
      :id="marketId"
      :dialog-visible="viewProfitVisible"
      type="view"
      title="查看核算利润"
      :close-on-click-modal="false"
      @hide-dialog="closeViewProfitForm"
    />

    <profit-form
      v-if="editFormVisible"
      :id="marketId"
      :dialog-visible="editFormVisible"
      type="edit"
      title="编辑核算利润"
      :close-on-click-modal="false"
      @hide-dialog="closeEditForm"
    />

    <profit-form
      v-if="confirmDialog"
      :id="marketId"
      :dialog-visible="confirmDialog"
      type="confirm"
      title="确认核算利润"
      :close-on-click-modal="false"
      @hide-dialog="closeConfirmDialog"
    />
    <pricing-adjust
      v-if="adjustPriceVisible"
      :id="priceAdjustmentApplyId"
      :dialog-visible="adjustPriceVisible"
      :adjust-msg="adjustment"
      :market="marketId"
      :close-on-click-modal="false"
      @hide-dialog="closeAdjustPrice"
    />

    <pricing-log
      v-if="viewPricingVisible"
      :dialog-visible="viewPricingVisible"
      :get-list="adjustmentList"
      :close-on-click-modal="false"
      @hide-dialog="closePricingList"
    />

    <el-dialog
      v-model="noAdjustmentVisible"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        当前无调价申请数据
      </div>
      <div style="text-align: center">
        <el-button
          type="primary"
          @click="noAdjustmentVisible = false"
        >
          好的
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="deleteDialog"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        确认要删除该核算利润吗
      </div>
      <div style="text-align: center">
        <el-button
          class="price-btn"
          @click="closeDeleteDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="price-btn"
          @click="deleteProfitItem"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import ProfitForm from './profit-form.vue';
import PricingAdjust from './pricing-adjust.vue';
import PricingLog from './pricing-log.vue';
import { changeTimestamp } from '../../../../utils';

export default {
  components: {
    ProfitForm,
    PricingAdjust,
    PricingLog
  },
  inject: ['getProfitList'],
  props: ['getProfit'],
  data() {
    return {
      addProfitVisible: false,
      viewProfitVisible: false,
      adjustPriceVisible: false,
      viewPricingVisible: false,
      editFormVisible: false,
      marketId: 0,
      adjustment: {},
      adjustmentList: [],
      priceAdjustmentApplyId: 0,
      noAdjustmentVisible: false,
      confirmDialog: false,
      deleteDialog: false,
      deleteId: 0,
      tableColumn: [
        {
          label: '市场',
          prop: 'market_desc'
        },
        {
          label: '平台',
          prop: 'platform'
        },
        {
          label: '是否开模',
          prop: 'is_mould_making'
        },
        {
          label: '调价记录',
          is_operation: true
        }
      ]
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
      try {
        await this.$store.dispatch('product/project/getAdjustment', { params });
        let result = this.$store.state.product.project.adjustment;
        if (JSON.stringify(result) !== '{}') {
          this.adjustment = result;
          changeTimestamp(this.adjustment, 'submit_time');
          changeTimestamp(this.adjustment, 'apply_approve_time');
          this.priceAdjustmentApplyId =
            this.adjustment.price_adjustment_apply_id;
          this.adjustPriceVisible = true;
        } else {
          this.noAdjustmentVisible = true;
        }
      } catch (err) {
        return;
      }
    },
    async getAdjustmentList(id) {
      let params = {
        product_id: +this.$route.params.productId,
        market: id
      };
      try {
        await this.$store.dispatch('product/project/getAdjustmentList', {
          params
        });
        this.adjustmentList = this.$store.state.product.project.adjustmentList;
        if (this.adjustmentList.length === 0) {
          this.$message.warning('当前无调价记录');
        } else {
          this.viewPricingVisible = true;
          this.adjustmentList.forEach((item) => {
            changeTimestamp(item, 'submit_time');
            changeTimestamp(item, 'apply_approve_time');
            changeTimestamp(item, 'adjust_approve_time');
          });
        }
      } catch (err) {
        return;
      }
    },
    addProfitCalculation() {
      this.addProfitVisible = true;
    },
    showViewProfit(id) {
      this.viewProfitVisible = true;
      this.marketId = id;
      this.$store.commit('product/project/setProfitLoading', true);
    },
    closeProfitForm() {
      this.addProfitVisible = false;
    },
    closeViewProfitForm() {
      this.viewProfitVisible = false;
    },
    showEditProfit(id) {
      this.editFormVisible = true;
      this.$store.commit('product/project/setProfitLoading', true);
      this.marketId = id;
    },
    showAdjustPrice(id) {
      this.marketId = id;
      this.getAdjustment();
    },
    closeAdjustPrice() {
      this.adjustPriceVisible = false;
    },
    showPricingList(id) {
      this.getAdjustmentList(id);
    },
    closePricingList() {
      this.viewPricingVisible = false;
    },
    closeEditForm() {
      this.editFormVisible = false;
    },
    async deleteItem(val) {
      try {
        await this.$store.dispatch('product/project/deleteProfitItem', val);
        this.deleteDialog = false;
        this.getProfitList();
      } catch (err) {
        return;
      }
    },
    deleteProfitItem() {
      let body = {
        product_id: +this.$route.params.productId,
        market: this.deleteId
      };
      this.deleteItem(body);
    },
    ShowConfirmParamsDialog(id) {
      this.confirmDialog = true;
      this.marketId = id;
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
    },
    showDeleteDialog(id) {
      this.deleteDialog = true;
      this.deleteId = id;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    }
  }
};
</script>

<style scoped>
.profit-plan_btn {
  margin-top: 15px;
}
</style>
