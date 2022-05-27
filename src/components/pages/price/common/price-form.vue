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
          placeholder="请选择供应商"
          filterable
          remote
          :remote-method="remoteMethod"
          clearable
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
              />
            </el-form-item>
            <el-form-item prop="inner_w">
              <el-input
                v-model="quotationForm.inner_w"
                class="analy-form_mar"
                placeholder="宽度"
                clearable
              />
            </el-form-item>
            <el-form-item prop="inner_h">
              <el-input
                v-model="quotationForm.inner_h"
                placeholder="高度"
                clearable
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
              />
            </el-form-item>
            <el-form-item prop="outer_w">
              <el-input
                v-model="quotationForm.outer_w"
                class="analy-form_mar"
                placeholder="宽度"
                clearable
              />
            </el-form-item>
            <el-form-item prop="outer_h">
              <el-input
                v-model="quotationForm.outer_h"
                placeholder="高度"
                clearable
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
      <el-form-item
        label="上传附件"
        prop="quotation_file"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="handleFileSuccess"
          :limit="1"
        >
          <el-button type="primary">
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          只能上传jpg/png格式文件,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="true"
          class="attachment-list"
        >
          <div>{{ attachment.name }}</div>
          <el-button
            type="text"
            @click="deleteFile(attachment.id)"
          >
            删除
          </el-button>
        </div>
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
import { timestamp } from '../../../../utils/index.js';

export default {
  props: ['dialogVisible', 'title', 'id', 'getList', 'productId'],
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
          }
        ],
        beyond_reference_reason: [
          {
            required: true,
            message: '请输入内容'
          }
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
          }
        ],
        inner_w: [
          {
            required: true,
            message: '请输入宽度'
          }
        ],
        inner_h: [
          {
            required: true,
            message: '请输入高度'
          }
        ],
        inner_box_weight: [
          {
            required: true,
            message: '请输入重量'
          }
        ],
        outer_l: [
          {
            required: true,
            message: '请输入长度'
          }
        ],
        outer_w: [
          {
            required: true,
            message: '请输入宽度'
          }
        ],
        outer_h: [
          {
            required: true,
            message: '请输入高度'
          }
        ],
        outer_box_weight: [
          {
            required: true,
            message: '请输入重量'
          }
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
          }
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
          }
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
      currency: []
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
    async getAddReason(val) {
      let params = {
        supplier_id: val,
        pricing_id: this.id
      };
      await this.$store.dispatch('price/getAddReason', {
        params
      });
      this.hasAdd = this.$store.state.price.hasAdd;
    },
    async getHighReason(val) {
      let params = {
        quote: val,
        pricing_id: this.id,
        currency: this.quotationForm.quote_currency
      };
      await this.$store.dispatch('price/getHighReason', {
        params
      });
      await this.$store.dispatch('getPriceRmb', {
        params: {
          price: this.quotationForm.quote_amount,
          currency: this.quotationForm.quote_currency,
          product_id: this.productId
        }
      });
      this.quotationForm.quote_amount_rmb = this.$store.state.priceRmb;
      this.isHigh = this.$store.state.price.hasHigh;
    },
    async createQuotation(val) {
      let body = val;
      body['price_id'] = this.id;
      await this.$store.dispatch('price/createQuotation', body);
      this.visible = false;
      this.getList();
    },
    submitForm() {
      this.$refs.quotationForm.validate((valid) => {
        if (valid) {
          this.quotationForm.quote_validity = timestamp(
            this.quotationForm.quote_validity
          );
          this.createQuotation(this.quotationForm);
        }
      });
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.quotationForm.quotation_file = this.attachment.id;
      this.show = true;
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.quotationForm.quotation_file = null;
      this.show = false;
    },
    async getSupplier() {
      let params = {
        current_page: 1,
        page_size: 10,
        state: 30
      };
      await this.$store.dispatch('supplier/getSupplierList', { params });
      this.supplierList = this.$store.state.supplier.supplierList;
    },
    remoteMethod(query) {
      if (query) {
        this.getSupplier();
        this.options = this.supplierList.filter((item) => {
          return item.name.indexOf(query) > -1;
        });
      }
    },
    async getParams() {
      if (localStorage.getItem('params')) {
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    async getRmb(val) {
      await this.$store.dispatch('getPriceRmb', {
        params: {
          price: this.quotationForm.quote_amount,
          currency: this.quotationForm.quote_currency,
          product_id: this.productId
        }
      });
      if (val === 'head') {
        this.quotationForm.head_cost_rmb = this.$store.state.priceRmb;
      } else {
        this.quotationForm.tail_cost_rmb = this.$store.state.priceRmb;
      }
    },
    clearCurrency(val) {
      if (val === 'quote') {
        this.quotationForm.quote_amount = '';
        this.quotationForm.quote_amount_rmb = '';
      } else if (val === 'head') {
        this.quotationForm.head_cost = '';
        this.quotationForm.head_cost_rmb = '';
      } else {
        this.quotationForm.tail_cost = '';
        this.quotationForm.tail_cost_rmb = '';
      }
    },
    clearMoney(val) {
      if (val === 'quote') {
        this.quotationForm.quote_amount_rmb = '';
      } else if (val === 'head') {
        this.quotationForm.head_cost_rmb = '';
      } else {
        this.quotationForm.tail_cost_rmb = '';
      }
    }
  }
};
</script>
