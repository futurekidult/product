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
          clearable
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
          clearable
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
          clearable
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
          clearable
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="proofingForm.remark_text"
          placeholder="请输入备注信息"
          type="textarea"
          rows="5"
          :disabled="disabled"
          clearable
        />
      </el-form-item>
      <el-form-item label="上传附件">
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="disabled"
          >
            上传
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
          <div style="display: flex">
            <div v-if="attachment.type === 12860">
              <el-button
                type="text"
                @click="showViewFile(attachment.id)"
              >
                预览
              </el-button>
              <span class="table-btn">|</span>
            </div>
            <el-button
              v-if="type === 'create' || type === 'edit'"
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
            <el-button
              v-else
              type="text"
              @click="download(attachment.id, attachment.name)"
            >
              下载
            </el-button>
          </div>
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
import {
  downloadFile,
  getFile,
  previewFile,
  timestamp
} from '../../../../utils';
export default {
  inject: ['getProofing'],
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
    if (this.type === 'create') {
      this.show = false;
    }
  },
  methods: {
    async createProofingSheet(val) {
      let body = val;
      body['sample_id'] = +this.$route.params.id;
      try {
        await this.$store.dispatch('sample/createProofingSheet', body);
        this.visible = false;
        this.getProofing();
      } catch (err) {
        return;
      }
    },
    async approvalProofingSheet(body) {
      try {
        await this.$store.dispatch('sample/approvalProofingSheet', body);
        this.visible = false;
        this.getProofing();
      } catch (err) {
        return;
      }
    },
    async updateProofingSheet(val) {
      let body = val;
      try {
        await this.$store.dispatch('sample/updateProofingSheet', body);
        this.getProofing();
      } catch (err) {
        return;
      }
    },
    getForm() {
      if (this.type !== 'create') {
        this.proofingForm = this.form;
        this.attachment = this.proofingForm.proofing_sheet_file;
      }
    },
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
          this.show = true;
          this.attachment = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
        }
      } catch (err) {
        return;
      }
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
      this.proofingForm.proofing_sheet_file = this.attachment.id;
      this.$refs.proofingForm.validate((valid) => {
        if (valid) {
          this.proofingForm.has_verify = +this.proofingForm.has_verify;
          this.proofingForm.demand_quantity =
            +this.proofingForm.demand_quantity;
          this.proofingForm.demand_time = timestamp(
            this.proofingForm.demand_time
          );
          if (this.type === 'create') {
            this.createProofingSheet(this.proofingForm);
          } else {
            this.updateProofingSheet(this.proofingForm);
          }
        }
      });
    },
    deleteFile() {
      this.attachment = {};
      this.proofingForm.proofing_sheet_file = '';
      this.show = false;
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          previewFile(this.$store.state.viewLink);
        }
      } catch (err) {
        return;
      }
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          downloadFile(this.$store.state.viewLink, name);
        }
      } catch (err) {
        return;
      }
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
