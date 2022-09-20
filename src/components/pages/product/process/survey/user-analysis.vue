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
            :disabled="isDisabled"
            clearable
            maxlength="15"
            show-word-limit
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
        :class="!isCountryVisible ? 'form-template' : 'form-include_delete'"
      >
        <el-form-item
          :label="'国家' + (index + 1)"
          :prop="`country.${index}.country_id`"
          :rules="analysisRules.country_id"
        >
          <el-select
            v-model="item.country_id"
            :disabled="isDisabled"
            clearable
            filterable
            placeholder="请选择国家"
            @focus="getCountryList"
            @change="clearStateCity(index)"
          >
            <el-option 
              v-for="country in countryOption"
              :key="country.id"
              :label="country.name"
              :value="country.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'州/大区' + (index + 1)"
          :prop="`country.${index}.region_id`"
        >
          <el-select
            v-model="item.region_id"
            :disabled="isDisabled"
            clearable
            filterable
            placeholder="请选择州/大区"
            @focus="getRegionList(item.country_id)"
            @clear="clearCity(index)"
          >
            <el-option 
              v-for="region in regionOption"
              :key="region.id"
              :label="region.name"
              :value="region.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'城市' + (index + 1)"
          :prop="`country.${index}.city_id`"
        >
          <el-select
            v-model="item.city_id"
            :disabled="isDisabled"
            clearable
            filterable
            placeholder="请选择城市"
            @focus="getCityList(item.country_id, item.region_id)"
          >
            <el-option 
              v-for="city in cityOption"
              :key="city.id"
              :label="city.name"
              :value="city.id"
            />
          </el-select>
        </el-form-item>
        <base-delete 
          :id="index"
          mode="user_analysis-btn"
          content=""
          :show="form.country.length > 1 && progress.state !== 50"
          :list="form.country"
          @get-list="(val) => getReturnData(val, 'country')"
        />
      </div>
      <el-form-item v-if="progress.state !== 50">
        <el-button
          class="user-btn"
          :disabled="isDisabled"
          @click="addStateCity"
        >
          + 新增
        </el-button>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in form.usage_scenario"
        :key="index"
        :label="'使用场景' + (index + 1)"
        :prop="`usage_scenario[${index}]`"
        :rules="[{ required: true,message: '请输入使用场景'}, checkValid(15)]"
      >
        <div class="usage-scenario_include-delete">
          <el-input
            v-model="form.usage_scenario[index]"
            placeholder="请输入使用场景"
            clearable
            :disabled="isDisabled"
            maxlength="15"
            show-word-limit
          />
          <base-delete 
            :id="index"
            mode="user_analysis-btn"
            content=""
            :show="form.usage_scenario.length > 1 && progress.state !== 50"
            :list="form.usage_scenario"
            @get-list="(val) => getReturnData(val, 'usage')"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="progress.state !== 50">
        <el-button
          class="user-btn"
          :disabled="isDisabled"
          @click="addUsageScenario"
        >
          + 新增
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
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="分析报告"
        prop="attachment"
      >
        <base-upload 
          type="file"
          tag="分析报告"
          url="user-analysis-report"
          :file="file"
          :is-disabled="isDisabled"
          @get-file="getUploadFile"
        />
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
import { checkValid } from '../../../../../utils';
import SurveySchedule from '../../common/survey-schedule.vue';

export default {
  components: {
    SurveySchedule
  },
  inject: ['getBase'],
  props: ['progress', 'attachment', 'analysisForm', 'getList', 'countryVisible', 'scenarioVisible'],
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
          },
          checkValid(15)
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
        country_id: [
          {
            required: true,
            message: '请选择国家'
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
      ageOptions: [],
      diplomaOptions: [],
      annualHouseholdIncome: [],
      maritalStatus: [],
      genderOptions: [],
      form: this.analysisForm,
      file: this.attachment,
      countryOption: [],
      regionOption: [],
      cityOption: [],
      isScenarioVisible: this.isScenarioVisible,
      isCountryVisible: this.isCountryVisible
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  mounted() {
    this.getParams();
    this.getCountryList();
    this.getState();
  },
  methods: {
    checkValid,
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
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getCountryList() {
      let country = JSON.parse(localStorage.getItem('country'));
      if(country) {
        this.countryOption = country;
      } else {
        try {
          await this.$store.dispatch('getCountry');
          this.getCountryList();
        } catch (err) {
          return;
        }
      }
    },
    async getRegionList(val) {
      if(val) {
        try {
          await this.$store.dispatch('getRegionList',{ params: { country_id: val }});
          this.regionOption = this.$store.state.regionList;
        } catch (err) {
          return;
        }
      } else {
       this.$message.warning('请先选择国家');
       this.regionOption = [];
      }
    },
  async getCityList(country, region) {
    if(country && region) {
      try {
        await this.$store.dispatch('getCityList',{ 
          params: { 
            country_id: country,
            state_id: region
          }
        });
        this.cityOption = this.$store.state.cityList;
        } catch (err) {
          return;
        }
      } else {
        this.$message.warning('请先选择国家和州/大区');
        this.cityOption = [];
      }
    },
    getState() {
      this.form.country.forEach((item) => {
        if(item.country_id) {
          this.getRegionList(item.country_id);
          if(item.region_id) {
            this.getCityList(item.country_id, item.region_id);
          }
        }
      });
    },
    async updateAnalysis(val) {
      let body = val;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      body['attachment'] = this.file.id;
      try {
        await this.$store.dispatch(
          'product/survey/userAnalysis/submitAnalysis',
          body
        );
        this.getList();
        this.getBase();
      } catch (err) {
        return;
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
    addStateCity() {
      this.form.country.push({});
      if (this.form.country.length > 1) {
        this.isCountryVisible = true;
      }
    },
    addUsageScenario() {
      this.form.usage_scenario.length++;
      if (this.form.usage_scenario.length > 1) {
        this.isScenarioVisible = true;
      }
    },
    clearStateCity(index) {
        this.form.country[index].region_id = null;
        this.form.country[index].city_id = null;
    },
    clearCity(index) {
        this.form.country[index].city_id = null;
    },
    getReturnData(val, str) {
      if(str === 'country') {
        this.form.country = val;
      } else {
        this.form.usage_scenario = val;
      }
    },
    getUploadFile(e) {
      this.file = e;
    }
  }
};
</script>
