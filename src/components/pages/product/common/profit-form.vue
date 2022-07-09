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
          @change="changeMarket(profitForm.market)"
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
        v-if="profitForm.market"
        label="当前汇率"
      >
        <el-input
          v-model="rate"
          disabled
        />
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
              @change="getProfitParams(profitForm.market,profitForm.list[index].platform)"
            >
              <el-option
                v-for="platform in platformList"
                :key="platform.id"
                :label="platform.name"
                :value="platform.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="profitForm.list[index].platform">
            <el-collapse style="width: 100%">
              <el-collapse-item 
                :title="'利润核算参数明细表' + (index + 1)">
                <profit-params :profit-params="profitParams" />
              </el-collapse-item>
            </el-collapse>
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
                  @change="clearMoney(index)"
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
                  @change="
                    getPrice(
                      profitForm.market,
                      item.platform,
                      item.selling_price,
                      index
                    )
                  "
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
          <el-form-item v-if="profitForm.list[index].selling_price">
            <el-collapse style="width: 100%">
              <el-collapse-item :title="'核算系数明细' + (index + 1)">
                <div>采购价=</div>
                <div style="margin: 10px">
                  {{ calculationResult.coef_selling }}*销售价 -
                  {{ calculationResult.coef_volume }}*体积*海运单价 -
                  {{ calculationResult.coef_head }}*头程附加 -
                  {{ calculationResult.coef_tail }}*尾程
                </div>
              </el-collapse-item>
            </el-collapse>
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
          <el-form-item>
            <div class="desc">
              系统根据利润核算规则自动计算
            </div>
          </el-form-item>
          <el-form-item
            :label="'运营专员' + (index + 1)"
            :prop="`list.${index}.operations_specialist_id`"
            :rules="profitRules.operations_specialist_id"
          >
            <el-tree-select
              v-model="item.operations_specialist_id"
              :data="memberList"
              clearable
              filterable
              :props="defaultProps"
              :disabled="isDisabled"
            />
          </el-form-item>
        </div>
        <el-form-item v-if="!isDisabled">
          <el-button
            style="margin: 15px 0"
            @click="addRow"
          >
            + 新增平台
          </el-button>
          <el-button
            v-if="profitForm.list.length > 1"
            style="margin: 15px"
            type="danger"
            @click="deleteRow"
          >
            - 删除平台
          </el-button>
        </el-form-item>
        <el-divider v-if="!isDisabled" />
      </el-scrollbar>
      <div
        v-if="!isDisabled"
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
      <div
        v-if="type === 'confirm'"
        style="text-align: right"
      >
        <el-divider />
        <el-button
          type="primary"
          @click="updateProfitCalculationCoefficient"
        >
          确认
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import ProfitParams from './profit-params.vue';
import { getOrganizationList } from '../../../../utils/index';

export default {
  components: {
    ProfitParams
  },
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
      currency: [],
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      rate: '',
      calculationResult: {},
      profitParams: {}
    };
  },
  computed: {
    isDisabled() {
      return this.type === 'view' || this.type === 'confirm' ? true : false;
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
     getOrganizationList().then( (res) => {
      this.memberList = res;
    });
    this.getParams();
    this.getMarket();
  },
  methods: {
    async getProfitParams(market, platform) {
      let params = {
        market,
        platform,
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/project/getProfitParams', {
          params
        });
        this.profitParams = this.$store.state.product.project.profitParams;
      } catch (err) {
        return;
      }
    },
    async getParams() {
      if (localStorage.getItem('params')) {
        let { demand } = JSON.parse(localStorage.getItem('params'));
        this.currency = demand.currency;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getMarket() {
      try {
        await this.$store.dispatch('product/project/getMarketList', {
          params: {
            id: +this.$route.params.productId
          }
        });
        this.marketList = this.$store.state.product.project.marketList;
        if (this.type !== 'add') { 
          this.getProfitCalculation();
          this.getRate(this.id);
        }
      } catch (err) {
        return;
      }
    },
    async getProfitCalculation() {
      let params = {
        product_id: +this.$route.params.productId,
        market: this.id
      };
      try {
        await this.$store.dispatch('product/project/getProfitCalculation', {
          params
        });
        this.profitForm = this.$store.state.product.project.profitCalculation;
        this.marketList.map((market) => {
              if (market.id === this.profitForm.market ) {
                this.platformList = market.platform;
              }
            });
        this.profitForm.list.forEach((item) => {
          this.getPrice(this.id, item.platform, +this.$route.params.productId, item.selling_price);
        })
      } catch (err) {
        return;
      }
    },
    async getRate(market) {
      try {
        await this.$store.dispatch('product/project/getRate', {
          params: {
            market
          }
        });
        this.rate = this.$store.state.product.project.rate;
      } catch (err) {
        return;
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
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/project/createProfit', body);
        this.visible = false;
        this.getProfitCalcaulation();
      } catch (err) {
        return;
      }
    },
    async updateProfit(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/project/updateProfit', body);
        this.visible = false;
        this.getProfitCalcaulation();
      } catch (err) {
        return;
      }
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
    },
    async getPrice(market, platform, price, index) {
      try {
        await this.$store.dispatch('product/project/getReferencePrice', {
          params: {
            market,
            platform,
            product_id: +this.$route.params.productId,
            selling_price: price
          }
        });
        this.calculationResult =
          this.$store.state.product.project.referencePrice;
        this.profitForm.list[index].selling_price_rmb =
          this.calculationResult.selling_price_rmb;
        this.profitForm.list[index].reference_price =
          this.calculationResult.reference_price;
      } catch (err) {
        return;
      }
    },
    async updateProfitCalculationCoefficient() {
      let body = {
        product_id: +this.$route.params.productId,
        market: this.id
      };
      try {
        await this.$store.dispatch(
          'product/project/updateProfitCalculationCoefficient',
          body
        );
        this.visible = false;
        this.getProfitCalcaulation();
      } catch (err) {
        return;
      }
    },
    changeMarket(val) {
      this.getRate(val);
      for (let key in this.profitForm.list) {
        this.profitForm.list[key].platform = null;
      }
    },
    clearMoney(index) {
      this.profitForm.list[index].selling_price = '';
      this.profitForm.list[index].selling_price_rmb = '';
    }
  }
};
</script>
