<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="40%"
    @close="cancel"
  >
    <el-form
      ref="proofingForm"
      :model="proofingForm"
      :rules="proofingRules"
      label-width="110px"
    >
      <el-form-item
        label="样品型号"
        prop="sample_model"
      >
        <el-input
          v-model="proofingForm.sample_model"
          placeholder="请输入样品型号"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item
        label="需求数量"
        prop="demand_quantity"
      >
        <el-input
          v-model="proofingForm.demand_quantity"
          placeholder="请输入需求数量"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item
        label="有无认证"
        prop="has_verify"
      >
        <el-select
          v-model="proofingForm.has_verify"
          placeholder="请选择"
          :disabled="disabled"
        >
          <el-option
            v-for="item in hasVerifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="需求日期"
        prop="demand_time"
      >
        <el-date-picker
          v-model="proofingForm.demand_time"
          type="datetime"
          placeholder="请选择"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="proofingForm.remark_text"
          placeholder="请输入备注信息"
          type="textarea"
          rows="5"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="上传附件">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleFileSuccess"
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="disabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="show"
          class="attachment-list"
        >
          <div>{{ attachment.name }}</div>
          <el-button
            v-if="type === 'create' || type === 'edit'"
            type="text"
            @click="deleteFile(attachment.id)"
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
      <el-divider />
      <div v-if="type !== 'view'">
        <div
          v-if="type === 'create' || type === 'edit'"
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
            @click="submitProofingSheet"
          >
            提交
          </el-button>
        </div>
        <div
          v-else
          style="text-align: right"
        >
          <el-button
            class="close-btn"
            @click="submitProofingSheetApproval(0)"
          >
            不通过
          </el-button>
          <el-button
            type="primary"
            style="background: #379f0d; border: 1px solid #379f0d"
            @click="submitProofingSheetApproval(1)"
          >
            通过
          </el-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'title', 'type', 'form'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      attachment: {},
      proofingForm: {},
      proofingRules: {
        sample_model: [
          {
            required: true,
            message: '请输入样品型号'
          }
        ],
        demand_quantity: [
          {
            required: true,
            message: '请输入需求数量'
          }
        ],
        has_verify: [
          {
            required: true,
            message: '请选择'
          }
        ],
        demand_time: [
          {
            required: true,
            message: '请选择需求日期'
          }
        ]
      },
      hasVerifyOptions: [
        {
          label: '有',
          value: 1
        },
        {
          label: '无',
          value: 0
        }
      ],
      disabled: null,
      show: true
    };
  },
  mounted() {
    this.isDisabled();
    this.getForm();
  },
  methods: {
    async createProofingSheet(val) {
      let body = val;
      body['sample_id'] = +this.$route.params.id;
      await this.$store.dispatch('sample/createProofingSheet', body);
      this.visible = false;
    },
    async approvalProofingSheet(body) {
      await this.$store.sdispatch('sample/approvalProofingSheet', body);
      this.visible = false;
    },
    async updateProofingSheet(val) {
      let body = val;
      await this.$store.dispatch('sample/updateProofingSheet', body);
    },
    getForm() {
      if (this.type !== 'create') {
        this.proofingForm = this.form;
        this.attachment = this.proofingForm.proofing_sheet_file;
      }
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.proofingForm.proofing_sheet_file = this.attachment.id;
      this.show = true;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    isDisabled() {
      if (this.type === 'create' || this.type === 'edit') {
        this.disabled = false;
      }
      if (this.type === 'approval' || this.type === 'view') {
        this.disabled = true;
      }
    },
    submitProofingSheet() {
      this.$refs.proofingForm.validate((valid) => {
        if (valid) {
          this.proofingForm.has_verify = +this.proofingForm.has_verify;
          if (this.type === 'create') {
            this.createProofingSheet(this.proofingForm);
          } else {
            this.updateProofingSheet(this.proofingForm);
          }
        }
      });
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    submitProofingSheetApproval(val) {
      this.approvalProofingSheet({
        id: this.proofingForm.id,
        approval_result: val
      });
    }
  }
};
</script>
