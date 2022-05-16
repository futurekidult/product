<template>
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
    :model="riskForm"
    :rules="riskRules"
  >
    <div class="form-item">
      <el-form-item
        label="发明专利"
        prop="inventive_patent"
      >
        <el-select
          v-model="riskForm.inventive_patent"
          placeholder="请选择发明专利"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="是否需要认证"
        prop="need_verify"
      >
        <el-select
          v-model="riskForm.need_verify"
          placeholder="请选择是否需要认证"
          :disabled="isDisabled"
        />
      </el-form-item>
    </div>
    <el-form-item
      label="外观专利"
      prop="design_patent"
    >
      <el-input
        v-model="riskForm.design_patent"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入外观专利"
        :disabled="isDisabled"
      />
    </el-form-item>
    <el-form-item
      label="法律法规"
      prop="legal_regulation"
    >
      <el-input
        v-model="riskForm.legal_regulation"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入法律法规"
        :disabled="isDisabled"
      />
    </el-form-item>
    <el-form-item
      label="其他风险"
      prop="other_risk"
    >
      <el-input
        v-model="riskForm.other_risk"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入其它风险"
        :disabled="isDisabled"
      />
    </el-form-item>
    <el-form-item
      label="上传附件"
      style="margin-bottom: 18px"
      prop="attachment"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleFileSuccess"
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
          {{ handleAttachment(attachment.name) }}
        </div>
        <el-button
          v-if="!isDisabled"
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
</template>

<script>
import SurveySchedule from '../../common/survey- schedule.vue';

export default {
  components: {
    SurveySchedule
  },
  data() {
    return {
      fileList: [],
      riskForm: {},
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
      attachment: {},
      id: 0,
      progress: {}
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  mounted() {
    this.getRisk();
  },
  methods: {
    async getRisk() {
      await this.$store.dispatch('product/survey/risk/getRiskData');
      this.progress = this.$store.state.product.survey.risk.progress;
      this.riskForm = this.$store.state.product.survey.risk.riskForm;
      this.attachment = this.riskForm.attachment;
      this.id = this.progress.id;
    },
    async updateRisk(val) {
      let body = val;
      body['survey_schedule_id'] = this.id;
      body['product_id'] = +this.$route.params.productId;
      body['attachment'] = this.attachment.id;
      await this.$store.dispatch('product/survey/risk/submitRisk', body);
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    submitRiskForm() {
      this.$refs.riskForm.validate((valid) => {
        if (valid) {
          this.updateRisk(this.riskForm);
          this.getRisk();
        }
      });
    },
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.riskForm.attachment = file.id;
      this.show = true;
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    previewFile(id) {
      console.log(id);
    }
  }
};
</script>
