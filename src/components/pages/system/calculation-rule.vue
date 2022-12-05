<template>
  <section>
    <base-breadcrumb />

    <div class="border">
      <div class="nav-title todo-title">
        <div><span class="line">|</span> 利润核算规则表</div>
        <div style="display: flex">
          <el-select
            v-model="selectedMarket"
            placeholder="请选择市场"
            clearable
            @change="searchCalculationRules"
          >
            <el-option
              v-for="item in market"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-select
            v-model="selectedPlatform"
            placeholder="请选择平台"
            clearable
            @change="searchCalculationRules"
          >
            <el-option
              v-for="item in platform"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>
      </div>

      <div v-loading="$store.state.system.calculationRuleListLoading">
        <el-table
          stripe
          border
          empty-text="无数据"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :data="calculationRuleList"
        >
          <el-table-column
            fixed
            label="ID"
            prop="id"
            width="100"
          />
          <el-table-column
            label="数据名称"
            prop="name"
          />
          <el-table-column
            label="最新更新时间"
            prop="update_time"
            width="200"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="100"
          >
            <template #default="scope">
              <el-button
                type="text"
                @click="showEditForm(scope.row.id)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <base-pagination
          :length="$store.state.system.calculationRuleListLength"
          :current-page="currentPage"
          :page-num="pageSize"
          @change-size="changePageSize"
          @change-page="changeCurrentPage"
        />
      </div>
    </div>

    <el-dialog
      v-model="editVisible"
      width="40%"
      title="编辑基础数据"
      :close-on-click-modal="false"
    >
      <el-form
        ref="calculationRuleForm"
        :model="calculationRuleForm"
        label-width="120px"
        :rules="rulesForm"
      >
        <el-form-item
          label="数据名称"
          prop="name"
        >
          <el-input
            v-model="calculationRuleForm.name"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="市场"
          prop="market"
          required
        >
          <el-select
            v-model="calculationRuleForm.market"
            placeholder="请选择市场"
            disabled
          >
            <el-option
              v-for="item in market"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="平台"
          prop="platform"
          required
        >
          <el-select
            v-model="calculationRuleForm.platform"
            placeholder="请选择平台"
            disabled
          >
            <el-option
              v-for="item in platform"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="品类"
          prop="big_category"
          required
        >
          <el-select
            v-model="calculationRuleForm.big_category"
            placeholder="请选择品类"
            disabled
          >
            <el-option
              v-for="item in bigCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="利润率"
          prop="profit_rate"
        >
          <el-input
            v-model="calculationRuleForm.profit_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="广告费率"
          prop="advertising_rate"
        >
          <el-input
            v-model="calculationRuleForm.advertising_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="佣金费率"
          prop="commission_rate"
        >
          <el-input
            v-model="calculationRuleForm.commission_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="退货费率"
          prop="return_fee_rate"
        >
          <el-input
            v-model="calculationRuleForm.return_fee_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="仓储费率"
          prop="storage_rate"
        >
          <el-input
            v-model="calculationRuleForm.storage_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="促销费率"
          prop="promotion_rate"
        >
          <el-input
            v-model="calculationRuleForm.promotion_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="其它费率"
          prop="other_rate"
        >
          <el-input
            v-model="calculationRuleForm.other_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="关税率"
          prop="tariff_rate"
        >
          <el-input
            v-model="calculationRuleForm.tariff_rate"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="清关售价比例"
          prop="customs_clearance_price_ratio"
        >
          <el-input
            v-model="calculationRuleForm.customs_clearance_price_ratio"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-divider />
        <div style="text-align: right">
          <el-button
            class="close-btn"
            @click="closeForm"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitCalculationRule"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { formatterTime } from '../../../utils';
export default {
  data() {
    return {
      market: [],
      platform: [],
      selectedMarket: '',
      selectedPlatform: '',
      calculationRuleList: [],
      editVisible: false,
      editId: 0,
      calculationRuleForm: {},
      bigCategoryList: [],
      rulesForm: {
        name: [
          {
            required: true,
            message: '请输入'
          }
        ],
        profit_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        advertising_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        commission_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        return_fee_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        storage_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        promotion_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        other_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        tariff_rate: [
          {
            required: true,
            message: '请输入'
          }
        ],
        customs_clearance_price_ratio: [
          {
            required: true,
            message: '请输入'
          }
        ]
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.getParams();
    this.getCalculationRuleList();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let options = JSON.parse(localStorage.getItem('params')).demand;
        this.market = options.market;
        this.platform = options.platform;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getCalculationRuleList() {
      this.$store.commit('system/setCalculationRuleListLoading', true);
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        market: this.selectedMarket,
        platform: this.selectedPlatform
      };
      try {
        await this.$store.dispatch('system/getCalculationRuleList', { params });
        this.calculationRuleList = this.$store.state.system.calculationRuleList;
        this.calculationRuleList.forEach((item) => {
          item.update_time = formatterTime(item.update_time);
        });
      } catch (err) {
        this.$store.commit('system/setCalculationRuleListLoading', false);
        return;
      }
    },
    async getCategoryList() {
      try {
        await this.$store.dispatch('demand/getCategoryList');
        this.bigCategoryList = this.$store.state.demand.categoryList;
      } catch (err) {
        return;
      }
    },
    async getCalculationRuleDetail(id) {
      try {
        await this.$store.dispatch('system/getCalculationRuleDetail', {
          params: {
            id
          }
        });
        this.calculationRuleForm =
          this.$store.state.system.calculationRuleDetail;
      } catch (err) {
        return;
      }
    },
    async updateCalculationRule(val) {
      let body = val;
      body['id'] = this.editId;
      try {
        await this.$store.dispatch('system/updateCalculationRule', body);
        this.editVisible = false;
        this.getCalculationRuleList();
      } catch (err) {
        return;
      }
    },
    showEditForm(id) {
      this.editVisible = true;
      this.editId = id;
      this.getCategoryList();
      this.getCalculationRuleDetail(id);
    },
    closeForm() {
      this.editVisible = false;
    },
    submitCalculationRule() {
      this.$refs.calculationRuleForm.validate((valid) => {
        if (valid) {
          this.updateCalculationRule(this.calculationRuleForm);
        }
      });
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getCalculationRuleList();
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getCalculationRuleList();
    },
    searchCalculationRules() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getCalculationRuleList();
    }
  }
};
</script>
