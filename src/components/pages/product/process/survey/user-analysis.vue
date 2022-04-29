<template>
  <div class="survey-title">
    调研进度表
  </div>

  <survey-schedule :get-progress="getProgress" />

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    ref="analysisForm"
    label-width="110px"
    style="width: 50%"
    :model="analysisForm"
    :rules="analysisRules"
  >
    <div class="form-item">
      <el-form-item
        label="性别"
        prop="gender"
      >
        <el-select
          v-model="analysisForm.gender"
          placeholder="请选择性别"
        />
      </el-form-item>
      <el-form-item
        label="年龄"
        prop="age"
      >
        <el-select
          v-model="analysisForm.age"
          placeholder="请选择年龄"
        />
      </el-form-item>
      <el-form-item
        label="职业"
        prop="profession"
      >
        <el-input
          v-model="analysisForm.profession"
          placeholder="请输入职业"
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="学历"
        prop="diploma"
      >
        <el-select
          v-model="analysisForm.diploma"
          placeholder="请选择学历"
        />
      </el-form-item>
      <el-form-item
        label="家庭年收入"
        prop="annual_household_income"
      >
        <el-select
          v-model="analysisForm.annual_household_income"
          placeholder="请选择家庭年收入"
        />
      </el-form-item>
      <el-form-item
        label="婚姻状况"
        prop="marital_status"
      >
        <el-select
          v-model="analysisForm.marital_status"
          placeholder="请选择婚姻状况"
        />
      </el-form-item>
    </div>
    <div
      v-for="(item, index) in analysisForm.country"
      :key="index"
      style="display: flex"
    >
      <el-form-item
        :label="'国家' + (index + 1)"
        :prop="`country.${index}.country_id`"
        :rules="analysisRules.country"
      >
        <el-select v-model="item.country_id" />
      </el-form-item>
      <el-form-item
        :label="'州/大区' + (index + 1)"
        :prop="`country.${index}.region_id`"
        :rules="analysisRules.region"
      >
        <el-select
          v-model="item.region_id"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="'城市' + (index + 1)"
        :prop="`country.${index}.city_id`"
        :rules="analysisRules.city"
      >
        <el-select v-model="item.city_id" />
      </el-form-item>
    </div>
    <el-form-item>
      <el-button
        class="user-btn"
        @click="addStateCity"
      >
        + 新增
      </el-button>
      <el-button
        class="user-btn"
        type="danger"
        @click="deleteStateCity"
      >
        - 删除
      </el-button>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in analysisForm.usage_scenario"
      :key="index"
      :label="'使用场景' + (index + 1)"
      :prop="`usage_scenario[${index}]`"
      :rules="analysisRules.usage_scenario"
    >
      <el-input
        v-model="analysisForm.usage_scenario[index]"
        placeholder="请输入使用场景"
        maxlength="15"
        show-word-limit
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="user-btn"
        @click="addUsageScenario"
      >
        + 新增
      </el-button>
      <el-button
        class="user-btn"
        type="danger"
        @click="deleteUsageScenario"
      >
        - 删除
      </el-button>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model="analysisForm.remark"
        :rows="6"
        type="textarea"
        placeholder="请输入备注"
      />
    </el-form-item>
    <el-form-item
      label="上传附件"
      prop="attachment"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleFileSuccess"
        :limit="1"
      >
        <el-button type="primary">
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
          {{ handleAttachment(attachment.name) }}
        </div>
        <el-button
          type="text"
          @click="deleteFile(attachment.id)"
        >
          删除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitAnalysisForm"
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
      countryRow: {
        country_id: null,
        region_id: null,
        city_id: null
      },
      analysisForm: this.$store.state.product.survey.userAnalysis.analysisForm,
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
        region: [
          {
            required: true,
            message: '请选择州/大区'
          }
        ],
        city: [
          {
            required: true,
            message: '请选择城市'
          }
        ],
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
      attachment:
        this.$store.state.product.survey.userAnalysis.analysisForm.attachment
    };
  },
  computed: {
    getProgress() {
      return this.$store.state.product.survey.userAnalysis.progress;
    }
  },
  methods: {
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    submitAnalysisForm() {
      this.$refs.analysisForm.validate((valid) => {
        if (valid) {
          console.log(this.analysisForm);
        }
      });
    },
    addUsageScenario() {
      this.analysisForm.usage_scenario.length++;
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.analysisForm.attachment = file.id;
      this.show = true;
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    previewFile(id) {
      console.log(id);
    },
    addStateCity() {
      this.analysisForm.country.push(this.countryRow);
    },
    deleteStateCity() {
      this.analysisForm.country.pop();
    },
    deleteUsageScenario() {
      this.analysisForm.usage_scenario.length--;
    }
  }
};
</script>
