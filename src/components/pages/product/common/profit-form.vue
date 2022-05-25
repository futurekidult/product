<template>
  <el-dialog
    v-model="visible"
    width="40%"
    :title="title"
    @close="cancel"
  >
    <el-form
      ref="profitForm"
      v-loading="
        type !== 'add' ? $store.state.product.project.profitLoading : ''
      "
      :model="profitForm"
      :rules="profitRules"
      label-width="110px"
    >
      <el-form-item
        label="市场"
        prop="market"
      >
        <el-select
          v-model="profitForm.market"
          placeholder="请选择市场"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in marketList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否开模"
        prop="is_mould_making"
      >
        <el-select
          v-model="profitForm.is_mould_making"
          placeholder="请选择是否开模"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-divider />

      <el-scrollbar height="400px">
        <div
          v-for="(item, index) in profitForm.list"
          :key="index"
        >
          <el-form-item
            :label="'平台' + (index + 1)"
            :prop="`list.${index}.platform`"
            :rules="profitRules.platform"
          >
            <el-select
              v-model="item.platform"
              placeholder="请选择平台"
              :disabled="isDisabled"
              clearable
            >
              <el-option
                v-for="platform in platformList"
                :key="platform.id"
                :label="platform.name"
                :value="platform.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="'销售价' + (index + 1)"
            required
          >
            <div class="form-template">
              <el-form-item
                :prop="`list.${index}.currency`"
                :rules="profitRules.currency"
              >
                <el-select
                  v-model="item.currency"
                  placeholder="请选择货币"
                  :disabled="isDisabled"
                  clearable
                >
                  <el-option
                    v-for="cur in currency"
                    :key="cur.key"
                    :label="cur.value"
                    :value="cur.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                style="margin-left: 6px"
                :prop="`list.${index}.selling_price`"
                :rules="profitRules.selling_price"
              >
                <el-input
                  v-model="item.selling_price"
                  placeholder="请输入金额"
                  :disabled="isDisabled"
                  clearable
                />
              </el-form-item>
              <el-form-item
                style="margin-left: 6px"
                :prop="`list.${index}.selling_price_rmb`"
              >
                <el-input
                  v-model="item.selling_price_rmb"
                  disabled
                >
                  <template #prepend>
                    ￥
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item
            :label="'采购参考价' + (index + 1)"
            :prop="`list.${index}.reference_price`"
            required
          >
            <el-input
              v-model="item.reference_price"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
          <div style="margin: 0 0 10px 110px; font-size: 10px">
            系统根据利润核算规则自动计算
          </div>
          <el-form-item
            :label="'运营专员' + (index + 1)"
            :prop="`list.${index}.operations_specialist_id`"
            :rules="profitRules.operations_specialist_id"
          >
            <el-select
              v-model="profitForm.operations_specialist_id"
              placeholder="请选择运营专员"
              :disabled="isDisabled"
              clearable
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            v-if="type !== 'view'"
            style="margin: 15px 0"
            @click="addRow"
          >
            + 新增平台
          </el-button>
          <el-button
            v-if="type !== 'view'"
            style="margin: 15px"
            type="danger"
            @click="deleteRow"
          >
            - 删除平台
          </el-button>
        </el-form-item>
        <el-divider v-if="type !== 'view'" />
      </el-scrollbar>
      <div
        v-if="type !== 'view'"
        style="text-align: right"
      >
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitProfitForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getProfitCalcaulation'],
  props: ['dialogVisible', 'title', 'type', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      profitForm: {
        list: [{}]
      },
      profitRules: {
        market: [
          {
            required: true,
            message: '请选择市场'
          }
        ],
        is_mould_making: [
          {
            required: true,
            message: '请选择是否开模'
          }
        ],
        platform: [
          {
            required: true,
            message: '请选择平台'
          }
        ],
        currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        selling_price: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        operations_specialist_id: [
          {
            required: true,
            message: '请选择运营专员'
          }
        ]
      },
      marketList: [],
      platformList: [],
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      currency: []
    };
  },
  computed: {
    isDisabled() {
      if (this.type === 'view') {
        return true;
      } else {
        return false;
      }
    },
    getRelatedPlatform() {
      return this.profitForm.market;
    }
  },
  watch: {
    getRelatedPlatform(val) {
      this.marketList.map((item) => {
        if (item.id === val) {
          this.platformList = item.platform;
        }
      });
    }
  },
  mounted() {
    this.getProfitCalculation();
    this.getMarket();
  },
  methods: {
    async getMarket() {
      await this.$store.dispatch('product/project/getMarketList', {
        params: {
          id: +this.$route.params.productId
        }
      });
      this.marketList = this.$store.state.product.project.marketList;
    },
    async getProfitCalculation() {
      let params = {
        product_id: +this.$route.params.productId,
        market: this.id
      };
      await this.$store.dispatch('product/project/getProfitCalculation', {
        params
      });
      if (this.type !== 'add') {
        this.profitForm = this.$store.state.product.project.profitCalculation;
        this.marketList = JSON.parse(
          localStorage.getItem('params')
        ).demand.market;
        this.platformList = JSON.parse(
          localStorage.getItem('params')
        ).demand.platform;
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    addRow() {
      this.profitForm.list.push({});
    },
    deleteRow() {
      this.profitForm.list.pop();
    },
    async createProfit(val) {
      let body = val;
      body['product_id'] = this.$route.params.paroductId;
      await this.$store.dispatch('product/project/createProfit', body);
      this.visible = false;
      this.getProfitCalcaulation();
    },
    async updateProfit(val) {
      let body = val;
      body['product_id'] = this.$route.params.paroductId;
      await this.$store.dispatch('product/project/updateProfit', body);
      this.visible = false;
      this.getProfitCalcaulation();
    },
    submitProfitForm() {
      this.$refs.profitForm.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.createProfit(this.profitForm);
          } else {
            this.updateProfit(this.profitForm);
          }
        }
      });
    }
  }
};
</script>
