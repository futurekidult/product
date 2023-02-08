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
      style="width: 60%"
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
          placeholder="请输入外观专利"
          :disabled="isDisabled"
          clearable
          maxlength="200"
          show-word-limit
          :rows="6"
        />
      </el-form-item>
      <el-form-item
        label="法律法规"
        prop="legal_regulation"
      >
        <el-input
          v-model="form.legal_regulation"
          type="textarea"
          placeholder="请输入法律法规"
          :disabled="isDisabled"
          clearable
          maxlength="200"
          show-word-limit
          :rows="6"
        />
      </el-form-item>
      <el-form-item
        label="其他风险"
        prop="other_risk"
      >
        <el-input
          v-model="form.other_risk"
          type="textarea"
          placeholder="请输入其它风险"
          :disabled="isDisabled"
          clearable
          maxlength="200"
          show-word-limit
          :rows="6"
        />
      </el-form-item>
      <el-form-item
        label="调研报告"
        style="margin-bottom: 18px"
        prop="attachment"
      >
        <base-upload
          type="file"
          tag="调研报告"
          url="risk-survey-report"
          :file="file"
          :is-disabled="isDisabled"
          @get-file="getUploadFile"
        />
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

    <survey-suggestion
      v-if="progress.state === 50"
      :ids="$store.state.product.survey.risk.ids"
      type="risk"
    />
  </div>
</template>

<script>
import { checkValid } from '../../../../../utils';
import SurveySchedule from '../../common/survey-schedule.vue';
import SurveySuggestion from '../../common/survey-suggestion.vue';

export default {
  components: {
    SurveySchedule,
    SurveySuggestion
  },
  inject: ['getBase', 'getSurveySchedule'],
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
          },
          checkValid(200)
        ],
        legal_regulation: [
          {
            required: true,
            message: '请输入法律法规'
          },
          checkValid(200)
        ],
        other_risk: [
          {
            required: true,
            message: '请输入其它风险'
          },
          checkValid(200)
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
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
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async updateRisk(val) {
      let body = val;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/survey/risk/submitRisk', body);
        this.getList();
        this.getBase();
        this.getSurveySchedule();
      } catch (err) {
        return;
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
    getUploadFile(e) {
      this.file = e;
    }
  }
};
</script>
