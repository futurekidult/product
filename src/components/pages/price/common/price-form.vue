<template>
  <el-dialog
    v-model="visible"
    width="40%"
    :title="title"
    @close="cancel"
  >
    <el-form
      ref="quotationForm"
      label-width="150px"
      :model="quotationForm"
      :rules="quotationRules"
    >
      <el-form-item
        label="选择供应商"
        prop="supplier_id"
      >
        <el-select
          v-model="quotationForm.supplier_id"
          placeholder="请选择供应商(输入搜索)"
          filterable
          remote
          :remote-method="remoteMethod"
          clearable
          @clear="clearAddQuotationResult"
          @change="getAddReason"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="报价"
        style="margin-bottom: 18px"
        required
      >
        <div style="display: flex">
          <el-form-item prop="quote_currency">
            <el-select
              v-model="quotationForm.quote_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              clearable
              @clear="clearCurrency('quote')"
              @change="changeQuoteCurrency('quote')"
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="quote_amount">
            <el-input
              v-model="quotationForm.quote_amount"
              class="analy-form_mar"
              placeholder="请输入金额"
              clearable
              @change="getHighReason"
              @clear="clearMoney('quote')"
            />
          </el-form-item>
          <el-form-item prop="quote_amount_rmb">
            <el-input
              v-model="quotationForm.quote_amount_rmb"
              disabled
              placeholder="请输入人民币"
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <div v-if="hasAdd">
        <el-form-item
          label="新增该报价原因"
          prop="appended_reason"
        >
          <el-input
            v-model="quotationForm.appended_reason"
            placeholder="请输入内容"
            type="textarea"
            :rows="6"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <div class="form-desc">
            检测到已有该供应商的报价，请填写新增该报价原因
          </div>
        </el-form-item>
      </div>
      <el-form-item
        v-if="isHigh"
        label="高出参考价原因"
        prop="beyond_reference_reason"
      >
        <el-input
          v-model="quotationForm.beyond_reference_reason"
          placeholder="请输入内容"
          type="textarea"
          :rows="6"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="报价有效期"
        prop="quote_validity"
      >
        <el-date-picker
          v-model="quotationForm.quote_validity"
          type="datetime"
          placeholder="请选择日期"
          clearable
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-divider />
      <div class="analy-form_item">
        <el-form-item
          label="内箱尺寸/cm"
          required
        >
          <div style="display: flex">
            <el-form-item prop="inner_l">
              <el-input
                v-model="quotationForm.inner_l"
                class="analy-form_mar"
                placeholder="长度"
                clearable
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="inner_w">
              <el-input
                v-model="quotationForm.inner_w"
                class="analy-form_mar"
                placeholder="宽度"
                clearable
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="inner_h">
              <el-input
                v-model="quotationForm.inner_h"
                placeholder="高度"
                clearable
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="外箱尺寸/cm"
          required
        >
          <div style="display: flex">
            <el-form-item prop="outer_l">
              <el-input
                v-model="quotationForm.outer_l"
                class="analy-form_mar"
                placeholder="长度"
                clearable
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="outer_w">
              <el-input
                v-model="quotationForm.outer_w"
                class="analy-form_mar"
                placeholder="宽度"
                clearable
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="outer_h">
              <el-input
                v-model="quotationForm.outer_h"
                placeholder="高度"
                clearable
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="内箱重量/kg"
          style="margin-bottom: 18px"
          prop="inner_box_weight"
        >
          <el-input
            v-model="quotationForm.inner_box_weight"
            placeholder="请输入内箱重量"
            clearable
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="外箱重量/kg"
          style="margin-bottom: 18px"
          prop="outer_box_weight"
        >
          <el-input
            v-model="quotationForm.outer_box_weight"
            placeholder="请输入外箱重量"
            clearable
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
      </div>
      <el-form-item
        label="头程费用"
        style="margin-bottom: 18px"
        required
      >
        <div style="display: flex">
          <el-form-item prop="head_currency">
            <el-select
              v-model="quotationForm.head_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              clearable
              @clear="clearCurrency('head')"
              @change="changeCurrency('head')"
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="head_cost">
            <el-input
              v-model="quotationForm.head_cost"
              class="analy-form_mar"
              placeholder="请输入金额"
              clearable
              @change="getRmb('head')"
              @clear="clearMoney('head')"
            />
          </el-form-item>
          <el-form-item prop="head_cost_rmb">
            <el-input
              v-model="quotationForm.head_cost_rmb"
              disabled
              placeholder="请输入人民币"
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="desc">
          此处为单个产品的费用
        </div>
      </el-form-item>
      <el-form-item
        label="尾程费用"
        style="margin-bottom: 18px"
        required
      >
        <div style="display: flex">
          <el-form-item prop="tail_currency">
            <el-select
              v-model="quotationForm.tail_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              clearable
              @clear="clearCurrency('tail')"
              @change="changeCurrency('tail')"
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="tail_cost">
            <el-input
              v-model="quotationForm.tail_cost"
              class="analy-form_mar"
              placeholder="请输入金额"
              clearable
              @change="getRmb('tail')"
              @clear="clearMoney('tail')"
            />
          </el-form-item>
          <el-form-item prop="tail_cost_rmb">
            <el-input
              v-model="quotationForm.tail_cost_rmb"
              disabled
              placeholder="请输入人民币"
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="desc">
          此处为单个产品的费用
        </div>
      </el-form-item>
      <el-form-item
        label="海运单价"
        style="margin-bottom: 18px"
        required
      >
        <div style="display: flex">
          <el-form-item prop="sea_freight_currency">
            <el-select
              v-model="quotationForm.sea_freight_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              clearable
              @clear="clearCurrency('sea_freight')"
              @change="changeCurrency('sea_freight')"
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="sea_freight_cost">
            <el-input
              v-model="quotationForm.sea_freight_cost"
              class="analy-form_mar"
              placeholder="请输入金额"
              clearable
              @change="getRmb('sea_freight')"
              @clear="clearMoney('sea_freight')"
            />
          </el-form-item>
          <el-form-item prop="sea_freight_cost_rmb">
            <el-input
              v-model="quotationForm.sea_freight_cost_rmb"
              disabled
              placeholder="请输入人民币"
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="desc">
          若没有海运费的金额请填0
        </div>
      </el-form-item>
      <el-form-item
        label="报价单"
        prop="quotation_file"
      >
        <base-upload
          type="file"
          tag="报价单"
          url="quotation"
          :file="attachment"
          @get-file="getUploadFile"
        />
      </el-form-item>
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { timestamp, checkValid } from '../../../../utils/index.js';

export default {
  props: ['dialogVisible', 'title', 'id', 'getList', 'productId', 'market'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      quotationForm: {},
      quotationRules: {
        supplier_id: [
          {
            required: true,
            message: '请选择供应商'
          }
        ],
        quote_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        quote_amount: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        appended_reason: [
          {
            required: true,
            message: '请输入内容'
          },
          checkValid(200)
        ],
        beyond_reference_reason: [
          {
            required: true,
            message: '请输入内容'
          },
          checkValid(200)
        ],
        quote_validity: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        inner_l: [
          {
            required: true,
            message: '请输入长度'
          },
          checkValid(15)
        ],
        inner_w: [
          {
            required: true,
            message: '请输入宽度'
          },
          checkValid(15)
        ],
        inner_h: [
          {
            required: true,
            message: '请输入高度'
          },
          checkValid(15)
        ],
        inner_box_weight: [
          {
            required: true,
            message: '请输入重量'
          },
          checkValid(15)
        ],
        outer_l: [
          {
            required: true,
            message: '请输入长度'
          },
          checkValid(15)
        ],
        outer_w: [
          {
            required: true,
            message: '请输入宽度'
          },
          checkValid(15)
        ],
        outer_h: [
          {
            required: true,
            message: '请输入高度'
          },
          checkValid(15)
        ],
        outer_box_weight: [
          {
            required: true,
            message: '请输入重量'
          },
          checkValid(15)
        ],
        head_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        head_cost: [
          {
            required: true,
            message: '请输入金额'
          },
          checkValid(15)
        ],
        tail_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        tail_cost: [
          {
            required: true,
            message: '请输入金额'
          },
          checkValid(15)
        ],
        sea_freight_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        sea_freight_cost: [
          {
            required: true,
            message: '请输入金额'
          },
          checkValid(15)
        ],
        quotation_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      supplierList: [],
      options: [],
      hasAdd: 0,
      isHigh: 0,
      attachment: {},
      currency: [],
      show: false,
      defaultTime: new Date(2000, 1, 1, 23, 59, 59)
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    },
    async getAddReason() {
      if (this.quotationForm.supplier_id !== '') {
        let params = {
          supplier_id: this.quotationForm.supplier_id,
          pricing_id: this.id
        };
        try {
          await this.$store.dispatch('price/getAddReason', {
            params
          });
          this.hasAdd = this.$store.state.price.hasAdd;
          this.quotationForm.appended_reason = '';
        } catch (err) {
          return;
        }
      }
    },
    async getHighReason(val) {
      if (
        this.quotationForm.quote_currency &&
        this.quotationForm.quote_amount
      ) {
        let params = {
          quote: val,
          product_id: this.productId,
          market: this.market
        };
        try {
          await this.$store.dispatch('price/getHighReason', {
            params
          });
          await this.$store.dispatch('getPriceRmb', {
            params: {
              price: this.quotationForm.quote_amount,
              currency: this.quotationForm.quote_currency,
              product_id: this.productId,
              market: this.market
            }
          });
          this.quotationForm.quote_amount_rmb = this.$store.state.priceRmb;
          this.isHigh = this.$store.state.price.hasHigh;
        } catch (err) {
          return;
        }
      }
    },
    async createQuotation(val) {
      let body = JSON.parse(JSON.stringify(val));
      body['quote_validity'] = timestamp(body['quote_validity']);
      body['pricing_id'] = this.id;
      body['pricing_id'] = this.id;
      try {
        await this.$store.dispatch('price/createQuotation', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        if (err.message === '45034') {
          this.visible = false;
          this.getList();
        } else {
          return;
        }
      }
    },
    submitForm() {
      this.quotationForm.quotation_file = this.attachment.id;
      this.$refs.quotationForm.validate((valid) => {
        if (valid) {
          this.createQuotation(this.quotationForm);
        }
      });
    },
    async getSupplier(val) {
      try {
        await this.$store.dispatch('price/getSupplierOption');
        this.supplierList = this.$store.state.price.supplierOption;
        this.options = this.supplierList.filter((item) => {
          return item.name.indexOf(val) > -1;
        });
      } catch (err) {
        return;
      }
    },
    remoteMethod(query) {
      if (query) {
        this.getSupplier(query);
      }
    },
    async getParams() {
      if (localStorage.getItem('params')) {
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getRmb(val) {
      if (
        this.quotationForm[`${val}_currency`] &&
        this.quotationForm[`${val}_cost`]
      ) {
        try {
          await this.$store.dispatch('getPriceRmb', {
            params: {
              price: this.quotationForm[`${val}_cost`],
              currency: this.quotationForm[`${val}_currency`],
              product_id: this.productId,
              market: this.market
            }
          });
          this.quotationForm[`${val}_cost_rmb`] = this.$store.state.priceRmb;
        } catch (err) {
          return;
        }
      }
    },
    changeQuoteCurrency(val) {
      this.getHighReason(val);
    },
    changeCurrency(val) {
      this.getRmb(val);
    },
    clearCurrency(val) {
      if (val === 'quote') {
        this.quotationForm.quote_amount = '';
        this.quotationForm.quote_amount_rmb = '';
      } else {
        this.quotationForm[`${val}_cost`] = '';
        this.quotationForm[`${val}_cost_rmb`] = '';
      }
    },
    clearMoney(val) {
      if (val === 'quote') {
        this.quotationForm.quote_amount_rmb = '';
        this.isHigh = false;
        this.quotationForm.beyond_reference_reason = '';
      } else {
        this.quotationForm[`${val}_cost_rmb`] = '';
      }
    },
    clearAddQuotationResult() {
      this.quotationForm.appended_reason = '';
      this.hasAdd = false;
    },
    getUploadFile(e) {
      this.attachment = e;
    }
  }
};
</script>
