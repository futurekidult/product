<template>
  <div
    v-loading="
      type !== 'create' ? $store.state.supplier.supplierDetailLoading : ''
    "
    class="border"
  >
    <div class="select-title">
      <span class="line">|</span>
      {{ type === 'create' ? '创建' : '编辑' }}供应商
    </div>

    <el-form
      ref="supplierForm"
      label-width="150px"
      :model="supplierForm"
      style="width: 70%"
    >
      <div class="form-item">
        <el-form-item
          label="供应商类型"
          prop="type"
          :rules="[{ required: true, message: '请选择供应商类型' }]"
        >
          <el-select
            v-model="supplierForm.type"
            placeholder="请选择供应商类型"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请输入供应商名称' }]"
        >
          <el-input
            v-model="supplierForm.name"
            placeholder="请输入供应商名称"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请输入联系人姓名' }]"
        >
          <el-input
            v-model="item.contact"
            placeholder="请输入联系人姓名"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          :label="'手机号码' + (index + 1)"
          :prop="`contacts.${index}.tel`"
          :rules="[{ required: true, message: '请输入手机号' }]"
        >
          <el-input
            v-model="item.tel"
            placeholder="请输入手机号"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item :label="'座机号码' + (index + 1)">
          <el-input
            v-model="item.phone"
            placeholder="请输入座机号码"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item :label="'微信' + (index + 1)">
          <el-input
            v-model="item.wechat"
            placeholder="请输入微信"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item :label="'QQ号' + (index + 1)">
          <el-input
            v-model="item.qq"
            placeholder="请输入QQ号"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item :label="'电子邮件' + (index + 1)">
          <el-input
            v-model="item.email"
            placeholder="请输入电子邮件"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
      </div>
      <el-form-item v-if="!isDisabled">
        <el-button @click="addRow('contacts')">
          + 新增联系人
        </el-button>
        <el-button
          v-if="supplierForm.contacts.length !== 1"
          type="danger"
          @click="deleteRow('contacts')"
        >
          - 删除联系人
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
          :rules="[{ required: true, message: '请选择公司地址' }]"
        >
          <el-select
            v-model="item.company"
            placeholder="请选择公司地址"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          :label="'详细地址' + (index + 1)"
          :prop="`addresses.${index}.detail`"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        >
          <el-input
            v-model="item.detail"
            placeholder="请输入详细地址"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          :label="'出货地址' + (index + 1)"
          :prop="`addresses.${index}.shipment`"
          :rules="[{ required: true, message: '请输入出货地址' }]"
        >
          <el-select
            v-model="item.shipment"
            placeholder="请输入出货地址"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
      </div>
      <el-form-item v-if="!isDisabled">
        <el-button @click="addRow('addresses')">
          + 新增地址
        </el-button>
        <el-button
          v-if="supplierForm.addresses.length !== 1"
          type="danger"
          @click="deleteRow('addresses')"
        >
          - 删除地址
        </el-button>
      </el-form-item>
      <div class="form-item">
        <el-form-item
          label="公司主页链接"
          prop="site_link"
          :rules="[{ required: true, message: '请输入公司主页链接' }]"
        >
          <el-input
            v-model="supplierForm.site_link"
            placeholder="请输入公司主页链接"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="供应商合作等级"
          prop="cooperation_level"
          :rules="[{ required: true, message: '请选择合作等级' }]"
        >
          <el-select
            v-model="supplierForm.cooperation_level"
            placeholder="请选择合作等级"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请输入工厂规模' }]"
        >
          <el-input
            v-model="supplierForm.factory_scale"
            placeholder="请输入工厂规模"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="供应商税号"
          prop="tax_id"
          :rules="[{ required: true, message: '请输入供应商税号' }]"
        >
          <el-input
            v-model="supplierForm.tax_id"
            placeholder="请输入供应商税号"
            clearable
            :disabled="type !== 'create'"
          />
        </el-form-item>
        <el-form-item
          label="注册资金(万元)"
          prop="registered_capital"
          :rules="[{ required: true, message: '请输入注册资金' }]"
        >
          <el-input
            v-model="supplierForm.registered_capital"
            placeholder="请输入注册资金"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="税务资格"
          prop="tax_eligibility"
          :rules="[{ required: true, message: '请选择税务资格' }]"
        >
          <el-select
            v-model="supplierForm.tax_eligibility"
            placeholder="请选择税务资格"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请选择付款方式' }]"
        >
          <el-select
            v-model="supplierForm.payment_method"
            placeholder="请选择付款方式"
            clearable
            :disabled="isDisabled"
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
          />
        </el-form-item>
        <el-form-item
          label="付款条件"
          prop="payment_terms"
          :rules="[{ required: true, message: '请选择付款条件' }]"
        >
          <el-select
            v-model="supplierForm.payment_terms"
            placeholder="请选择付款条件"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请选择主要货币' }]"
        >
          <el-select
            v-model="supplierForm.currency"
            placeholder="请选择主要货币"
            clearable
            :disabled="isDisabled"
          >
            <el-option
              v-for="item in currency"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SWFT CODE">
          <el-input
            v-model="supplierForm.swift_code"
            placeholder="请输入SWFT CODE"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="开户银行户名"
          prop="bank_username"
          :rules="[{ required: true, message: '请输入开户银行' }]"
        >
          <el-input
            v-model="supplierForm.bank_username"
            placeholder="请输入开户银行户名"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="开户银行名称"
          prop="bank_name"
          :rules="[{ required: true, message: '请输入开户银行名称' }]"
        >
          <el-input
            v-model="supplierForm.bank_name"
            placeholder="请输入开户银行名称"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="开户银行账号"
          prop="bank_account"
          :rules="[{ required: true, message: '请输入开户银行账号' }]"
        >
          <el-input
            v-model="supplierForm.bank_account"
            placeholder="请输入开户银行账号"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item label="开户银行所在地">
          <el-input
            v-model="supplierForm.bank_address"
            placeholder="请输入开户银行所在地"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item label="开户银行支行">
          <el-input
            v-model="supplierForm.bank_branch"
            placeholder="请输入开户银行支行"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="跨行标识"
          prop="inter_bank"
          :rules="[{ required: true, message: '请选择跨行标识' }]"
        >
          <el-select
            v-model="supplierForm.inter_bank"
            placeholder="请选择跨行标识"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请选择地域标识' }]"
        >
          <el-select
            v-model="supplierForm.territory"
            placeholder="请选择地域标识"
            clearable
            :disabled="isDisabled"
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
          :rules="[{ required: true, message: '请输入主营产品' }]"
        >
          <el-input
            v-model="supplierForm.main_products"
            placeholder="请输入主营产品"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item
          label="采购员"
          prop="purchase_specialist_id"
          :rules="[{ required: true, message: '请选择采购员' }]"
        >
          <el-select
            v-model="supplierForm.purchase_specialist_id"
            placeholder="请选择采购员"
            clearable
            :disabled="isDisabled"
          />
        </el-form-item>
      </div>
      <el-form-item
        label="增值税发票"
        prop="vat_invoice_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="
            (file, fileList) =>
              handleFileArrSuccess(file, fileList, vatInvoiceFile)
          "
          :limit="9"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          只能上传jpg/png格式文件,文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-for="(item, index) in vatInvoiceFile"
          :key="index"
          class="attachment-list"
        >
          <div>
            {{ item.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="deleteFileItem(vatInvoiceFile, item.id, 'vat_invoice_file')"
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="开户许可证"
        prop="account_opening_license_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="
            (file, fileList) =>
              handleFileArrSuccess(file, fileList, accountOpeningLicenseFile)
          "
          :limit="9"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          只能上传jpg/png格式文件,文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-for="(item, index) in accountOpeningLicenseFile"
          :key="index"
          class="attachment-list"
        >
          <div>
            {{ item.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="
              deleteFileItem(
                accountOpeningLicenseFile,
                item.id,
                'account_opening_license_file'
              )
            "
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="营业执照"
        prop="business_license_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="
            (file, fileList) =>
              handleFileArrSuccess(file, fileList, businessLicenseFile)
          "
          :limit="9"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          只能上传jpg/png格式文件,文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-for="(item, index) in businessLicenseFile"
          :key="index"
          class="attachment-list"
        >
          <div>
            {{ item.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="
              deleteFileItem(
                businessLicenseFile,
                item.id,
                'business_license_file'
              )
            "
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="采购供应商评估表"
        prop="purchase_evaluation_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="
            (file, fileList) =>
              handleFileSuccess(file, fileList, purchaseEvaluationFile)
          "
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          请上传office文档格式
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="JSON.stringify(purchaseEvaluationFile) !== '{}'"
          class="attachment-list"
        >
          <div>
            {{ purchaseEvaluationFile.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="deletePurchaseFile(purchaseEvaluationFile.id)"
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="质检供应商评估表"
        prop="quality_evaluation_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="
            (file, fileList) =>
              handleFileSuccess(file, fileList, qualityEvaluationFile)
          "
          :limit="9"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          请上传office文档格式
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="JSON.stringify(qualityEvaluationFile) !== '{}'"
          class="attachment-list"
        >
          <div>
            {{ qualityEvaluationFile.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="deleteQualityFile(qualityEvaluationFile.id)"
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div style="font-size: 10px; color: #606266">
          备注：需上传供应商大门、样品间、车间、仓库等照片
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
        />
      </el-form-item>
      <el-form-item v-if="!isDisabled">
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
      qualityEvaluationFile: {}
    };
  },
  computed: {
    isDisabled() {
      if (this.type === 'create' || this.type === 'update') {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() {
    this.getParams();
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
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    async createSupplier(body) {
      await this.$store.dispatch('supplier/createSupplier', body);
      if (this.$store.state.supplier.createPass) {
        this.$router.push('/supplier-list');
      }
    },
    async getSupplierDetail() {
      this.$store.commit('supplier/setSupplierDetailLoading', true);
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
      this.purchaseEvaluationFile = this.supplierForm.purchase_evaluation_file;
      this.qualityEvaluationFile = this.supplierForm.quality_evaluation_file;
    },
    async updateSupplier(val) {
      let body = val;
      body.id = +this.$route.params.id;
      await this.$store.dispatch('supplier/updateSupplier', body);
      if (this.$store.state.supplier.updatePass) {
        this.$router.push('/supplier-list');
      }
    },
    addRow(val) {
      this.supplierForm[val].push({});
    },
    deleteRow(val) {
      this.supplierForm[val].pop();
    },
    handleFileArrSuccess(file, fileList, arr) {
      arr.push({
        id: file.id,
        name: fileList.name
      });
    },
    handleFileSuccess(file, fileList, obj) {
      obj['id'] = file.id;
      obj['name'] = fileList.name;
    },
    handleFileArr(oldArr, key) {
      this.supplierForm[key] = [];
      oldArr.forEach((item) => {
        let { id } = item;
        this.supplierForm[key].push(id);
      });
    },
    deleteFileItem(arr, id, key) {
      arr.splice(
        arr.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
      this.supplierForm[key] = arr;
    },
    deleteQualityFile(id) {
      console.log(id);
      this.qualityEvaluationFile = {};
      this.submitForm.quality_evaluation_file = {};
    },
    deletePurchaseFile(id) {
      console.log(id);
      this.purchaseEvaluationFile = {};
      this.submitForm.purchase_evaluation_file = {};
    },
    submitForm() {
      this.handleFileArr(this.vatInvoiceFile, 'vat_invoice_file');
      this.handleFileArr(
        this.accountOpeningLicenseFile,
        'account_opening_license_file'
      );
      this.handleFileArr(this.businessLicenseFile, 'business_license_file');
      this.supplierForm.purchase_evaluation_file =
        this.purchaseEvaluationFile.id;
      this.supplierForm.quality_evaluation_file = this.qualityEvaluationFile.id;
      this.$refs.supplierForm.validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.createSupplier(this.supplierForm);
          } else {
            this.updateSupplier(this.supplierForm);
          }
        }
      });
    }
  }
};
</script>
