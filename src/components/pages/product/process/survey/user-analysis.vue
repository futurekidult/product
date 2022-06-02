<template>
  <div v-loading="$store.state.product.survey.userAnalysis.analysisLoading">
    <div class="survey-title">
      调研进度表
    </div>

    <survey-schedule :get-progress="progress" />

    <div class="survey-title">
      调研报告内容
    </div>

    <el-form
      ref="analysisForm"
      label-width="110px"
      style="width: 50%"
      :model="form"
      :rules="analysisRules"
    >
      <div class="form-item">
        <el-form-item
          label="性别"
          prop="gender"
        >
          <el-select
            v-model="form.gender"
            placeholder="请选择性别"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in genderOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="年龄"
          prop="age"
        >
          <el-select
            v-model="form.age"
            placeholder="请选择年龄"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in ageOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="职业"
          prop="profession"
        >
          <el-input
            v-model="form.profession"
            placeholder="请输入职业"
            maxlength="15"
            show-word-limit
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="学历"
          prop="diploma"
        >
          <el-select
            v-model="form.diploma"
            placeholder="请选择学历"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in diplomaOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="家庭年收入"
          prop="annual_household_income"
        >
          <el-select
            v-model="form.annual_household_income"
            placeholder="请选择家庭年收入"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in annualHouseholdIncome"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="婚姻状况"
          prop="marital_status"
        >
          <el-select
            v-model="form.marital_status"
            placeholder="请选择婚姻状况"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in maritalStatus"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </div>
      <div
        v-for="(item, index) in form.country"
        :key="index"
      >
        <el-form-item
          :label="'城市' + (index + 1)"
          :prop="`country[${index}]`"
          :rules="analysisRules.country"
        >
          <el-cascader
            v-model="form.country[index]"
            :disabled="isDisabled"
            clearable
            :options="countryOption"
            :props="defaultProps"
            placeholder="请选择国家"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          class="user-btn"
          :disabled="isDisabled"
          @click="addStateCity"
        >
          + 新增
        </el-button>
        <el-button
          class="user-btn"
          type="danger"
          :disabled="isDisabled"
          @click="deleteStateCity"
        >
          - 删除
        </el-button>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in form.usage_scenario"
        :key="index"
        :label="'使用场景' + (index + 1)"
        :prop="`usage_scenario[${index}]`"
        :rules="analysisRules.usage_scenario"
      >
        <el-input
          v-model="form.usage_scenario[index]"
          placeholder="请输入使用场景"
          maxlength="15"
          show-word-limit
          clearable
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="user-btn"
          :disabled="isDisabled"
          @click="addUsageScenario"
        >
          + 新增
        </el-button>
        <el-button
          class="user-btn"
          type="danger"
          :disabled="isDisabled"
          @click="deleteUsageScenario"
        >
          - 删除
        </el-button>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          :rows="6"
          type="textarea"
          placeholder="请输入备注"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="上传附件"
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
          支持office文档格式,文档不超过5MB
        </div>
      </el-form-item>
      <el-form-item>
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
          @click="submitAnalysisForm"
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
  props: ['progress', 'attachment', 'analysisForm', 'getList'],
  data() {
    return {
      fileList: [],
      analysisRules: {
        gender: [
          {
            required: true,
            message: '请选择性别'
          }
        ],
        age: [
          {
            required: true,
            message: '请选择年龄'
          }
        ],
        profession: [
          {
            required: true,
            message: '请输入职业'
          }
        ],
        diploma: [
          {
            required: true,
            message: '请选择学历'
          }
        ],
        annual_household_income: [
          {
            required: true,
            message: '请选择家庭年收入'
          }
        ],
        marital_status: [
          {
            required: true,
            message: '请选择婚姻状况'
          }
        ],
        country: [
          {
            required: true,
            message: '请选择国家'
          }
        ],
        // region: [
        //   {
        //     required: true,
        //     message: '请选择州/大区'
        //   }
        // ],
        // city: [
        //   {
        //     required: true,
        //     message: '请选择城市'
        //   }
        // ],
        usage_scenario: [
          {
            required: true,
            message: '请输入使用场景'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      count: 0,
      show: true,
      ageOptions: [],
      diplomaOptions: [],
      annualHouseholdIncome: [],
      maritalStatus: [],
      genderOptions: [],
      form: this.analysisForm,
      file: this.attachment,
      countryOption: [],
      defaultProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      }
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
    analysisForm(val) {
      this.form = val;
      if (this.form.usage_scenario.length === 0) {
        this.form.usage_scenario = [['']];
      }
      if (this.form.country.length === 0) {
        this.form.usage_scenario = [['']];
      }
    }
  },
  mounted() {
    this.getParams();
    this.getCountryList();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let userAnalysis = JSON.parse(
          localStorage.getItem('params')
        ).survey_user_analysis;
        this.genderOptions = userAnalysis.gender;
        this.ageOptions = userAnalysis.age;
        this.diplomaOptions = userAnalysis.diploma;
        this.annualHouseholdIncome = userAnalysis.annual_household_income;
        this.maritalStatus = userAnalysis.marital_status;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    async getCountryList() {
      await this.$store.dispatch('getCountry');
      this.countryOption = this.$store.state.countryList;
    },
    async updateAnalysis(val) {
      let body = val;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      body['attachment'] = this.file.id;
      await this.$store.dispatch(
        'product/survey/userAnalysis/submitAnalysis',
        body
      );
      this.getList();
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    submitAnalysisForm() {
      this.form.attachment = this.file.id;
      this.$refs.analysisForm.validate((valid) => {
        if (valid) {
          this.updateAnalysis(this.form);
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
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        previewFile(this.$store.state.viewLink);
      }
    },
    addStateCity() {
      this.form.country.push([]);
    },
    addUsageScenario() {
      this.form.usage_scenario.push([]);
    },
    deleteStateCity() {
      this.form.country.pop();
    },
    deleteUsageScenario() {
      this.form.usage_scenario.pop();
    }
  }
};
</script>
