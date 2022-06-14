<template>
  <div v-loading="$store.state.product.survey.risk.riskLoading">
    <div class="survey-title">
      调研进度表
    </div>

    <survey-schedule :get-progress="progress" />

    <div class="survey-title">
      调研报告内容
    </div>

    <el-form
      ref="riskForm"
      label-width="110px"
      style="width: 50%"
      :model="form"
      :rules="riskRules"
    >
      <div class="form-item">
        <el-form-item
          label="发明专利"
          prop="inventive_patent"
        >
          <el-select
            v-model="form.inventive_patent"
            placeholder="请选择发明专利"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in inventivePatent"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否需要认证"
          prop="need_verify"
        >
          <el-select
            v-model="form.need_verify"
            placeholder="请选择是否需要认证"
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
      </div>
      <el-form-item
        label="外观专利"
        prop="design_patent"
      >
        <el-input
          v-model="form.design_patent"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入外观专利"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="法律法规"
        prop="legal_regulation"
      >
        <el-input
          v-model="form.legal_regulation"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入法律法规"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="其他风险"
        prop="other_risk"
      >
        <el-input
          v-model="form.other_risk"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入其它风险"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="上传附件"
        style="margin-bottom: 18px"
        prop="attachment"
      >
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
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
          支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px">
        <div
          v-if="show"
          class="attachment-list"
        >
          <div>
            {{ handleAttachment(file.name) }}
          </div>
          <div style="display: flex">
            <div v-if="handleAttachment(file.type) === 12860">
              <el-button
                type="text"
                @click="showViewFile(file.id)"
              >
                预览
              </el-button>
              <span class="table-btn">|</span>
            </div>
            <el-button
              v-if="!isDisabled"
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
            <el-button
              v-else
              type="text"
              @click="download(file.id, file.name)"
            >
              下载
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="submitRiskForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../../utils';
import SurveySchedule from '../../common/survey- schedule.vue';

export default {
  components: {
    SurveySchedule
  },
  props: ['progress', 'attachment', 'riskForm', 'getList'],
  data() {
    return {
      fileList: [],
      riskRules: {
        inventive_patent: [
          {
            required: true,
            message: '请选择发明专利'
          }
        ],
        need_verify: [
          {
            required: true,
            message: '请选择是否需要认证'
          }
        ],
        design_patent: [
          {
            required: true,
            message: '请输入外观专利'
          }
        ],
        legal_regulation: [
          {
            required: true,
            message: '请输入法律法规'
          }
        ],
        other_risk: [
          {
            required: true,
            message: '请输入其它风险'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      show: true,
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
      inventivePatent: [],
      file: this.attachment,
      form: this.riskForm
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  watch: {
    attachment(val) {
      this.file = val;
    },
    riskForm(val) {
      this.form = val;
    }
  },
  mounted() {
    this.getParams();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        this.inventivePatent = JSON.parse(
          localStorage.getItem('params')
        ).risk_survey.inventive_patent;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    async updateRisk(val) {
      let body = val;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      body['attachment'] = this.attachment.id;
      await this.$store.dispatch('product/survey/risk/submitRisk', body);
      this.getList();
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    submitRiskForm() {
      this.form.attachment = this.file.id;
      this.$refs.riskForm.validate((valid) => {
        if (valid) {
          this.updateRisk(this.form);
        }
      });
    },
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      await this.$store.dispatch('uploadFile', form);
      if (this.$store.state.uploadState) {
        this.show = true;
        this.file = {
          id: this.$store.state.fileRes.id,
          name: this.$store.state.fileRes.file_name,
          type: this.$store.state.fileRes.type
        };
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        previewFile(this.$store.state.viewLink);
      }
    },
    deleteFile() {
      this.file = {};
      this.form.attachment = '';
      this.show = false;
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        downloadFile(this.$store.state.viewLink, name);
      }
    }
  }
};
</script>
