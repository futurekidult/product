<template>
  <div class="profit-plan_title">
    核算利润表
  </div>

  <div class="profit-plan_title">
    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      class="profit-plan_table"
      :data="tableData"
    >
      <el-table-column
        label="序号"
        type="index"
        width="100px"
      />
      <el-table-column label="市场" />
      <el-table-column
        label="平台"
        prop="market"
      />
      <el-table-column label="是否开模" />
      <el-table-column label="调价记录">
        <el-button
          type="text"
          @click="showPricingList"
        >
          申请记录
        </el-button>
        <span class="table-btn">|</span>
        <el-button
          type="text"
          @click="showAdjustPrice"
        >
          调价
        </el-button>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            @click="deleteProfitItem(scope.row.id)"
          >
            删除
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            type="text"
            @click="showEditProfit"
          >
            编辑
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            type="text"
            @click="showViewProfit"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button
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
    :dialog-visible="viewProfitVisible"
    type="view"
    title="查看核算利润"
    @hide-dialog="closeViewProfitForm"
  />

  <profit-edit
    v-if="editProfitVisible"
    :dialog-visible="editProfitVisible"
    @hide-dialog="closeEditProfit"
  />

  <pricing-adjust
    v-if="adjustPriceVisible"
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
      tableData: [
        {
          market: 'm',
          id: 1
        }
      ],
      viewProfitVisible: false,
      editProfitVisible: false,
      adjustPriceVisible: false,
      getPricingVisible: false
    };
  },
  methods: {
    addProfitCalculation() {
      this.addProfitVisible = true;
    },
    showViewProfit() {
      this.viewProfitVisible = true;
    },
    closeProfitForm() {
      this.addProfitVisible = false;
    },
    closeViewProfitForm() {
      this.viewProfitVisible = false;
    },
    showEditProfit() {
      this.editProfitVisible = true;
    },
    showAdjustPrice() {
      this.adjustPriceVisible = true;
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
    deleteProfitItem(val) {
      console.log(val);
    }
  }
};
</script>

<style scoped>
.profit-plan_btn {
  margin-top: 15px;
}
</style>
