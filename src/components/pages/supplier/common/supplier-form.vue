<template>
  <div
    v-loading="
      type !== 'create' ? $store.state.supplier.supplierDetailLoading : ''
    "
    class="border"
  >
    <div class="select-title">
      <span class="line">|</span>
      基础信息
    </div>
    <el-form
      ref="baseForm"
      label-width="150px"
      :model="supplierForm"
      style="width: 70%"
      :rules="type === 'review' ? {} : baseRules"
    >
      <div class="form-item">
        <el-form-item
          label="供应商类型"
          prop="type"
        >
          <el-select
            v-model="supplierForm.type"
            placeholder="请选择供应商类型"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in supplierType"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="供应商名称"
          prop="name"
        >
          <el-input
            v-model="supplierForm.name"
            placeholder="请输入供应商名称"
            clearable
            :disabled="type !== 'create' && type !== 'qualificationUpdate'"
            maxlength="100"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
      </div>
      <div
        v-for="(item, index) in supplierForm.contacts"
        :key="index"
        class="form-item"
      >
        <el-form-item
          :label="'联系人姓名' + (index + 1)"
          :prop="`contacts.${index}.contact`"
          :rules="type === 'review' ? [] : baseRules.contact"
        >
          <el-input
            v-model="item.contact"
            placeholder="请输入联系人姓名"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          :label="'手机号码' + (index + 1)"
          :prop="`contacts.${index}.tel`"
          :rules="type === 'review' ? [] : baseRules.tel"
        >
          <el-input
            v-model="item.tel"
            placeholder="请输入手机号"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item :label="'座机号码' + (index + 1)">
          <el-input
            v-model="item.phone"
            placeholder="请输入座机号码"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="'微信' + (index + 1)">
          <el-input
            v-model="item.wechat"
            placeholder="请输入微信"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="'QQ号' + (index + 1)">
          <el-input
            v-model="item.qq"
            placeholder="请输入QQ号"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="'电子邮件' + (index + 1)">
          <el-input
            v-model="item.email"
            placeholder="请输入电子邮件"
            clearable
            :disabled="isDisabled"
            maxlength="30"
            show-word-limit
            @change="checkEmail('email', item.email, index + 1)"
          />
        </el-form-item>
        <base-delete
          :id="index"
          mode="supplier-delete_btn"
          content="移除"
          :show="!isDisabled && supplierForm.contacts.length > 1"
          :list="supplierForm.contacts"
          @get-list="(val) => getReturnData(val, 'contacts')"
        />
      </div>
      <el-form-item v-if="!isDisabled">
        <el-button @click="addRow('contacts')">
          + 新增联系人
        </el-button>
      </el-form-item>
      <div
        v-for="(item, index) in supplierForm.addresses"
        :key="index"
        class="form-item"
      >
        <el-form-item
          :label="'公司地址' + (index + 1)"
          :prop="`addresses.${index}.company`"
          :rules="type === 'review' ? [] : baseRules.company"
        >
          <el-cascader
            v-model="item.company"
            :options="cityOption"
            :props="props"
            placeholder="请选择公司地址"
            clearable
            filterable
            :disabled="isDisabled"
            style="width: 100%"
            :validate-event="false"
            @change="clearAddress(index)"
          />
        </el-form-item>
        <el-form-item
          :label="'详细地址' + (index + 1)"
          :prop="`addresses.${index}.detail`"
          :rules="type === 'review' ? [] : baseRules.detail"
        >
          <el-input
            v-model="item.detail"
            placeholder="请输入详细地址"
            clearable
            :disabled="isDisabled"
            maxlength="30"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          :label="'出货地址' + (index + 1)"
          :prop="`addresses.${index}.shipment`"
          :rules="type === 'review' ? [] : baseRules.shipment"
        >
          <el-cascader
            v-model="item.shipment"
            :options="cityOption"
            :props="props"
            placeholder="请输入出货地址"
            clearable
            filterable
            :disabled="isDisabled"
            style="width: 100%"
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item />
        <base-delete
          :id="index"
          mode="supplier-delete_btn"
          content="移除"
          :show="!isDisabled && supplierForm.addresses.length > 1"
          :list="supplierForm.addresses"
          @get-list="(val) => getReturnData(val, 'addresses')"
        />
      </div>
      <el-form-item v-if="!isDisabled">
        <el-button @click="addRow('addresses')">
          + 新增地址
        </el-button>
      </el-form-item>
      <div class="form-item">
        <el-form-item
          label="采购员"
          prop="purchase_specialist_id"
        >
          <el-tree-select
            v-model="supplierForm.purchase_specialist_id"
            :data="memberList"
            clearable
            filterable
            :props="defaultProps"
            :disabled="isDisabled"
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item />
      </div>
    </el-form>
    <div class="select-title">
      <span class="line">|</span>
      资质信息
    </div>
    <el-form
      ref="qualificationForm"
      label-width="150px"
      :model="supplierForm"
      style="width: 70%"
      :rules="type === 'review' || type === 'create' ? {} : qualificationRules"
    >
      <div class="form-item">
        <el-form-item
          label="公司主页链接"
          prop="site_link"
        >
          <el-input
            v-model="supplierForm.site_link"
            placeholder="请输入公司主页链接"
            clearable
            :disabled="isDisabled"
            maxlength="30"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          label="供应商合作等级"
          prop="cooperation_level"
        >
          <el-select
            v-model="supplierForm.cooperation_level"
            placeholder="请选择合作等级"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in cooperationLevel"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="工厂规模(人)"
          prop="factory_scale"
        >
          <el-input
            v-model="supplierForm.factory_scale"
            placeholder="请输入工厂规模"
            clearable
            :disabled="isDisabled"
            maxlength="7"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          label="供应商税号"
          prop="tax_id"
        >
          <el-input
            v-model="supplierForm.tax_id"
            placeholder="请输入供应商税号"
            clearable
            :disabled="type !== 'create' && type !== 'qualificationUpdate'"
            maxlength="20"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          label="注册资金(万元)"
          prop="registered_capital"
        >
          <el-input
            v-model="supplierForm.registered_capital"
            placeholder="请输入注册资金"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          label="税务资格"
          prop="tax_eligibility"
        >
          <el-select
            v-model="supplierForm.tax_eligibility"
            placeholder="请选择税务资格"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in taxEligibility"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="付款方式"
          prop="payment_method"
        >
          <el-select
            v-model="supplierForm.payment_method"
            placeholder="请选择付款方式"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in paymentMethod"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="定金比例(%)">
          <el-input
            v-model="supplierForm.deposit_ratio"
            placeholder="请输入定金比例"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="付款条件"
          prop="payment_terms"
        >
          <el-select
            v-model="supplierForm.payment_terms"
            placeholder="请选择付款条件"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in paymentTerms"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="主要货币"
          prop="currency"
        >
          <el-select
            v-model="supplierForm.currency"
            placeholder="请选择主要货币"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in currency"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SWIFT CODE">
          <el-input
            v-model="supplierForm.swift_code"
            placeholder="请输入SWIFT CODE"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="开户银行户名"
          prop="bank_username"
        >
          <el-input
            v-model="supplierForm.bank_username"
            placeholder="请输入开户银行户名"
            clearable
            :disabled="isDisabled"
            maxlength="100"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          label="开户银行名称"
          prop="bank_name"
        >
          <el-input
            v-model="supplierForm.bank_name"
            placeholder="请输入开户银行名称"
            clearable
            :disabled="isDisabled"
            maxlength="100"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item
          label="开户银行账号"
          prop="bank_account"
        >
          <el-input
            v-model="supplierForm.bank_account"
            placeholder="请输入开户银行账号"
            clearable
            :disabled="isDisabled"
            maxlength="25"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
        <el-form-item label="开户银行所在地">
          <el-input
            v-model="supplierForm.bank_address"
            placeholder="请输入开户银行所在地"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="开户银行支行">
          <el-input
            v-model="supplierForm.bank_branch"
            placeholder="请输入开户银行支行"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="跨行标识"
          prop="inter_bank"
        >
          <el-select
            v-model="supplierForm.inter_bank"
            placeholder="请选择跨行标识"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in interBank"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="地域标识"
          prop="territory"
        >
          <el-select
            v-model="supplierForm.territory"
            placeholder="请选择地域标识"
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          >
            <el-option
              v-for="item in territory"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="主营产品"
          prop="main_products"
        >
          <el-input
            v-model="supplierForm.main_products"
            placeholder="请输入主营产品"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
            :validate-event="false"
          />
        </el-form-item>
      </div>
      <el-form-item
        label="增值税发票"
        prop="vat_invoice_file"
      >
        <base-upload
          type="image"
          tag="增值税发票"
          count="8"
          url="vat-invoice"
          :is-disabled="isDisabled"
          :list="vatInvoiceFile"
          @get-file="(val) => getUploadFile(val, 'vat_invoice_file')"
        />
      </el-form-item>
      <el-form-item
        label="开户许可证"
        prop="account_opening_license_file"
      >
        <base-upload
          type="image"
          tag="开户许可证"
          count="8"
          url="account-opening-license"
          :is-disabled="isDisabled"
          :list="accountOpeningLicenseFile"
          @get-file="
            (val) => getUploadFile(val, 'account_opening_license_file')
          "
        />
      </el-form-item>
      <el-form-item
        label="营业执照"
        prop="business_license_file"
      >
        <base-upload
          type="image"
          tag="营业执照"
          count="8"
          url="business-license"
          :is-disabled="isDisabled"
          :list="businessLicenseFile"
          @get-file="(val) => getUploadFile(val, 'business_license_file')"
        />
      </el-form-item>
      <el-form-item
        label="采购供应商评估表"
        prop="purchase_evaluation_file"
      >
        <base-upload
          type="file"
          tag="采购供应商评估表"
          url="purchase-evaluation"
          :file="purchaseEvaluationFile"
          :is-disabled="isDisabled"
          @get-file="(val) => getUploadFile(val, 'purchase_evaluation_file')"
        />
      </el-form-item>
      <el-form-item
        label="质检供应商评估表"
        prop="quality_evaluation_file"
      >
        <base-upload
          type="file"
          tag="质检供应商评估表"
          url="quality-evaluation"
          :file="qualityEvaluationFile"
          :is-disabled="isDisabled"
          @get-file="(val) => getUploadFile(val, 'quality_evaluation_file')"
        />
      </el-form-item>
      <el-form-item>
        <div class="desc">
          表格中需上传供应商大门、样品间、车间、仓库等照片
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="supplierForm.remark_text"
          type="textarea"
          clearable
          :rows="6"
          placeholder="请输入内容"
          :disabled="isDisabled"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="type === 'qualificationUpdate'"
          class="draft-btn"
          @click="submitQualificationForm(0)"
        >
          保存
        </el-button>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="
            type === 'qualificationUpdate'
              ? submitQualificationForm(1)
              : submitForm()
          "
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getOrganizationList,
  checkQualificationValueAllEmpty
} from '../../../../utils';
export default {
  props: ['type'],
  data() {
    return {
      supplierForm: {
        contacts: [{}],
        addresses: [{}],
        vat_invoice_file: [],
        account_opening_license_file: [],
        business_license_file: []
      },
      supplierType: [],
      cooperationLevel: [],
      taxEligibility: [],
      paymentMethod: [],
      paymentTerms: [],
      currency: [],
      interBank: [],
      territory: [],
      vatInvoiceFile: [],
      accountOpeningLicenseFile: [],
      businessLicenseFile: [],
      purchaseEvaluationFile: {},
      qualityEvaluationFile: {},
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      cityOption: [],
      baseRules: {
        type: [
          {
            required: true,
            message: '请选择供应商类型'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入供应商名称'
          }
        ],
        contact: [{ required: true, message: '请输入联系人姓名' }],
        tel: [{ required: true, message: '请输入手机号' }],
        company: [{ required: true, message: '请选择公司地址' }],
        detail: [{ required: true, message: '请输入详细地址' }],
        shipment: [{ required: true, message: '请输入出货地址' }],
        purchase_specialist_id: [
          {
            required: true,
            message: '请选择采购员'
          }
        ]
      },
      qualificationRules: {
        site_link: [
          {
            required: true,
            message: '请输入公司主页链接'
          }
        ],
        cooperation_level: [
          {
            required: true,
            message: '请选择合作等级'
          }
        ],
        factory_scale: [
          {
            required: true,
            message: '请输入工厂规模'
          }
        ],
        tax_id: [
          {
            required: true,
            message: '请输入供应商税号'
          }
        ],
        registered_capital: [
          {
            required: true,
            message: '请输入注册资金'
          }
        ],
        tax_eligibility: [
          {
            required: true,
            message: '请选择税务资格'
          }
        ],
        payment_method: [
          {
            required: true,
            message: '请选择付款方式'
          }
        ],
        payment_terms: [
          {
            required: true,
            message: '请选择付款条件'
          }
        ],
        currency: [
          {
            required: true,
            message: '请选择主要货币'
          }
        ],
        bank_username: [
          {
            required: true,
            message: '请输入开户银行'
          }
        ],
        bank_name: [
          {
            required: true,
            message: '请输入开户银行名称'
          }
        ],
        bank_account: [
          {
            required: true,
            message: '请输入开户银行账号'
          }
        ],
        inter_bank: [
          {
            required: true,
            message: '请选择跨行标识'
          }
        ],
        territory: [
          {
            required: true,
            message: '请选择地域标识'
          }
        ],
        main_products: [
          {
            required: true,
            message: '请输入主营产品'
          }
        ],
        vat_invoice_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        account_opening_license_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        business_license_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        purchase_evaluation_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        quality_evaluation_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      }
    };
  },
  computed: {
    isDisabled() {
      return this.type === 'create' ||
        this.type === 'update' ||
        this.type === 'qualificationUpdate'
        ? false
        : true;
    }
  },
  mounted() {
    this.getCityOption();
    this.getParams();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
    if (this.type !== 'create') {
      this.getSupplierDetail();
    }
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let { supplier } = JSON.parse(localStorage.getItem('params'));
        this.supplierType = supplier.type;
        this.cooperationLevel = supplier.cooperation_level;
        this.taxEligibility = supplier.tax_eligibility;
        this.paymentMethod = supplier.payment_method;
        this.paymentTerms = supplier.payment_terms;
        this.currency = supplier.currency;
        this.interBank = supplier.inter_bank;
        this.territory = supplier.territory;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async createSupplier(body) {
      try {
        await this.$store.dispatch('supplier/createSupplier', body);
        this.$router.push('/supplier-list');
      } catch (err) {
        return;
      }
    },
    async getSupplierDetail() {
      this.$store.commit('supplier/setSupplierDetailLoading', true);
      try {
        await this.$store.dispatch('supplier/getSupplierDetail', {
          params: {
            id: +this.$route.params.id
          }
        });
        this.supplierForm = this.$store.state.supplier.supplierDetail;
        this.vatInvoiceFile = this.supplierForm.vat_invoice_file;
        this.accountOpeningLicenseFile =
          this.supplierForm.account_opening_license_file;
        this.businessLicenseFile = this.supplierForm.business_license_file;
        this.purchaseEvaluationFile =
          this.supplierForm.purchase_evaluation_file;
        this.qualityEvaluationFile = this.supplierForm.quality_evaluation_file;
      } catch (err) {
        this.$store.commit('supplier/setSupplierDetailLoading', false);
        return;
      }
    },
    async updateSupplier(val) {
      let body = val;
      body.id = +this.$route.params.id;
      try {
        await this.$store.dispatch('supplier/updateSupplier', body);
        this.$router.push('/supplier-list');
      } catch (err) {
        return;
      }
    },
    async updateQualification(val, state) {
      let body = JSON.parse(JSON.stringify(val));
      body.id = +this.$route.params.id;
      body.is_submit = state;
      try {
        await this.$store.dispatch('supplier/updateQualification', body);
        this.$router.push('/supplier-list');
      } catch (err) {
        return;
      }
    },
    async getCityOption() {
      try {
        await this.$store.dispatch('supplier/getCityOption');
        this.cityOption = this.$store.state.supplier.cityOption;
      } catch (err) {
        return;
      }
    },
    addRow(val) {
      this.supplierForm[val].push({});
    },
    handleFormFile(form) {
      const imgProp = [
        'vat_invoice_file',
        'account_opening_license_file',
        'business_license_file'
      ];
      imgProp.forEach((item) => {
        if (form[item].length !== 0) {
          form[item] = this.handleImgArr(item);
        }
      });
      const fileProp = ['quality_evaluation_file', 'purchase_evaluation_file'];
      fileProp.forEach((item) => {
        if (form[item]) {
          form[item] = this.supplierForm[item].id;
        }
      });
    },
    handleImgArr(key) {
      let imgArr = [];
      this.supplierForm[key].forEach((item) => {
        let { id } = item;
        imgArr.push(id);
      });
      return imgArr;
    },
    submitForm() {
      let form = JSON.parse(JSON.stringify(this.supplierForm));
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.handleFormFile(form);
          if (this.type === 'create') {
            this.createSupplier(form);
          } else {
            this.$refs.qualificationForm.validate((valid) => {
              if (valid) {
                this.updateSupplier(form);
              }
            });
          }
        }
      });
    },
    submitQualificationForm(state) {
      let form = JSON.parse(JSON.stringify(this.supplierForm));
      this.handleFormFile(form);
      const deleteProp = [
        'id',
        'create_time',
        'creator',
        'creator_id',
        'state',
        'state_desc',
        'is_black'
      ];
      deleteProp.forEach((item) => {
        delete form[item];
      });
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          if (state === 1) {
            this.$refs.qualificationForm.validate((valid) => {
              if (valid) {
                this.updateQualification(form, state);
              }
            });
          } else {
            let isAllEmpty = checkQualificationValueAllEmpty(form);
            if (isAllEmpty) {
              this.$message.warning('保存失败，保存内容不可为空');
            } else {
              this.updateQualification(form, state);
            }
          }
        } else {
          this.$message.warning('保存失败，请填写基本信息必填项');
        }
      });
    },
    checkEmail(str, val, index) {
      if (val) {
        if (val.indexOf('@') === -1) {
          this.$message.error(`第${index}个联系人的${str}必须包含@`);
        }
      }
    },
    clearAddress(index) {
      this.supplierForm.addresses[index].detail = '';
    },
    getReturnData(e, str) {
      if (str === 'contacts') {
        this.supplierForm.contacts = e;
      } else {
        this.supplierForm.addresses = e;
      }
    },
    getUploadFile(e, str) {
      if (JSON.stringify(e) === '{}' || e.length === 0) {
        this.supplierForm[str] = '';
      } else {
        this.supplierForm[str] = e;
      }
    }
  }
};
</script>
