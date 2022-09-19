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
          @clear="clearMarket"
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
              @clear="clearMoney(index)"
              @change="
                getProfitParams(
                  profitForm.market,
                  profitForm.list[index].platform,
                  profitForm.list[index].currency,
                  profitForm.list[index].selling_price,
                  index
                )
              "
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
              <el-collapse-item :title="'利润核算参数明细表' + (index + 1)">
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
                  clearable
                  placeholder="请选择货币"
                  :disabled="currency.length === 1 || type === 'view'"
                  @clear="clearCurrency(index)"
                  @change="
                    changeCurrency(
                      profitForm.market,
                      item.platform,
                      item.selling_price,
                      index
                    )
                  "
                >
                  <el-option
                    v-for="cur in currency"
                    :key="cur.key"
                    :label="cur.desc"
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
                  @clear="clearPrice(index)"
                  @change="
                    getPrice(
                      profitForm.market,
                      item.platform,
                      item.currency,
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
          <div
            v-if="isNegativeProfit"
            class="profit-msg"
          >
            核算利润有负数， 请先检查利润核算规则等数据是否有误
          </div>
          <el-form-item
            :label="'采购参考价' + (index + 1)"
            :prop="`list.${index}.reference_price`"
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
              系统根据利润核算规则自动计算(当产品定位为老产品时，无采购参考价)
            </div>
          </el-form-item>
          <div
            v-if="isNegativeReference"
            class="profit-msg"
          >
            采购参考价为负， 请先检查产品方案等数据是否有误
          </div>
          <base-delete
            :id="index"
            mode="project-delete_btn"
            content="移除"
            :show="!isDisabled && profitForm.list.length > 1"
            :list="profitForm.list"
            @get-list="getPlatform"
          />
        </div>
        <el-form-item v-if="!isDisabled">
          <el-button
            style="margin: 15px 0"
            @click="addRow"
          >
            + 新增平台
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
            message: '请选择平台',
            trigger: 'blur'
          }
        ],
        currency: [
          {
            required: true,
            message: '请选择货币',
            trigger: 'blur'
          }
        ],
        selling_price: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
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
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      rate: '',
      calculationResult: {},
      profitParams: {},
      isNegativeProfit: false,
      isNegativeReference: false,
      currency: []
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
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
    this.getMarket();
  },
  methods: {
    async getProfitParams(market, platform, currency, price, index) {
      if (market && platform) {
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
          this.getPrice(market, platform, currency, price, index);
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
          this.getCurrencyList(this.id);
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
          if (market.id === this.profitForm.market) {
            this.platformList = market.platform;
          }
        });
        this.profitForm.list.forEach((item, index) => {
          this.getPrice(
            this.id,
            item.platform,
            item.currency,
            item.selling_price,
            index
          );
          this.getProfitParams(item.market, item.platform);
        });
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
      if (this.currency.length === 1) {
        this.profitForm.list.forEach((item) => {
          item.currency = this.currency[0].key;
        });
      }
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
    async getPrice(market, platform, currency, price, index) {
      if (market && platform && currency && price) {
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
          this.isNegativeProfit = false;
          this.isNegativeReference = false;
        } catch (err) {
          if (err.message === '45035') {
            this.isNegativeProfit = true;
          }
          if (err.message === '45036') {
            this.isNegativeReference = true;
          }
          return;
        }
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
    async getCurrencyList(val) {
      if (val) {
        try {
          await this.$store.dispatch('product/project/getCurrencyList', {
            params: {
              market: val
            }
          });
          this.currency = this.$store.state.product.project.currencyList;
          if (this.currency.length === 1) {
            this.profitForm.list.forEach((item) => {
              item.currency = this.currency[0].key;
            });
          }
        } catch (err) {
          return;
        }
      }
    },
    changeMarket(val) {
      if (val) {
        this.getRate(val);
        this.clearMarket();
        this.getCurrencyList(val);
      }
    },
    clearMarket() {
      for (let key in this.profitForm.list) {
        this.profitForm.list[key].currency = '';
        this.profitForm.list[key].platform = '';
        this.profitForm.list[key].selling_price = '';
        this.profitForm.list[key].selling_price_rmb = '';
        this.profitForm.list[key].reference_price = '';
      }
    },
    clearMoney(index) {
      this.profitForm.list[index].selling_price = '';
      this.profitForm.list[index].selling_price_rmb = '';
      this.profitForm.list[index].reference_price = '';
    },
    clearPrice(index) {
      this.profitForm.list[index].selling_price_rmb = '';
      this.profitForm.list[index].reference_price = '';
    },
    changeCurrency(market, platform, price, index) {
      this.getPrice(market, platform, price, index);
    },
    clearCurrency(index) {
      this.profitForm.list[index].selling_price = '';
      this.profitForm.list[index].selling_price_rmb = '';
      this.profitForm.list[index].reference_price = '';
    },
    getPlatform(e) {
      this.profitForm.list = e;
    }
  }
};
</script>

<style scoped>
.profit-msg {
  margin: 0 0 15px 110px;
  color: red;
}
</style>
