<template>
  <el-dialog
    v-model="visible"
    :title="formTitle"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="userSurveyForm"
      :model="userSurveyForm"
      label-width="110px"
      style="width: 80%; margin: auto"
      :rules="getRules"
    >
      <el-form-item
        label="产品链接"
        prop="product_link"
      >
        <el-input
          v-model="userSurveyForm.product_link"
          placeholder="请输入产品链接"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="具体需求"
        prop="concrete_demand"
      >
        <el-input
          v-model="userSurveyForm.concrete_demand"
          type="textarea"
          placeholder="请输入具体需求"
          :disabled="isDisabled"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="期望结果"
        prop="expected_result"
      >
        <el-input
          v-model="userSurveyForm.expected_result"
          type="textarea"
          placeholder="请输入期望结果"
          :disabled="isDisabled"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="期望完成时间"
        prop="expected_finish_time"
      >
        <el-date-picker
          v-model="userSurveyForm.expected_finish_time"
          type="datetime"
          placeholder="请选择时间"
          :disabled="isDisabled"
          clearable
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-divider />
      <div v-if="type !== 'apply'">
        <el-form-item
          label="评审结果"
          prop="result"
        >
          <el-select
            v-model="userSurveyForm.result"
            placeholder="请选择评审结果"
            clearable
            :disabled="type === 'view'"
          >
            <el-option
              v-for="item in reviewOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="userSurveyForm.result === 1"
          label="用研专员"
          prop="user_survey_specialist_id"
        >
          <el-tree-select
            v-model="userSurveyForm.user_survey_specialist_id"
            :data="memberList"
            clearable
            filterable
            :props="defaultProps"
            :disabled="type === 'view'"
          />
        </el-form-item>
      </div>
      <div
        v-if="type !== 'view'"
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
          @click="submitSurveyForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  formatterTime,
  timestamp,
  getOrganizationList
} from '../../../../utils';
export default {
  inject: ['getUserSurvey'],
  props: ['dialogVisible', 'formTitle', 'type', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      userSurveyForm: {},
      applyRules: {
        product_link: [
          {
            required: true,
            message: '请输入产品链接'
          }
        ],
        concrete_demand: [
          {
            required: true,
            message: '请输入具体需求'
          }
        ],
        expected_result: [
          {
            required: true,
            message: '请输入期望结果'
          }
        ],
        expected_finish_time: [
          {
            required: true,
            message: '请选择期望完成时间'
          }
        ]
      },
      reviewRules: {
        result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        user_survey_specialist_id: [
          {
            required: true,
            message: '请选择用研专员'
          }
        ]
      },
      reviewOptions: [
        {
          label: '请选择',
          value: -1,
          disabled: true
        },
        {
          label: '通过',
          value: 1
        },
        {
          label: '不通过',
          value: 0
        }
      ],
      defaultTime: new Date(2000, 1, 1, 23, 59, 59),
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      }
    };
  },
  computed: {
    getRules() {
      if (this.type === 'apply') {
        return this.applyRules;
      } else if (this.type === 'review') {
        return this.reviewRules;
      } else {
        return {};
      }
    },
    isDisabled() {
      if (this.type === 'apply') {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    'userSurveyForm.result'(val) {
      if (val && this.type === 'review') {
        getOrganizationList().then((res) => {
          this.memberList = res;
        });
      }
    }
  },
  mounted() {
    if (this.type !== 'apply') {
      this.getUserSurveyDetail(this.type);
    }
  },
  methods: {
    async createApply(body) {
      try {
        await this.$store.dispatch(
          'product/survey/user/createUserSurveyApply',
          body
        );
        this.visible = false;
        this.getUserSurvey();
      } catch (err) {
        return;
      }
    },
    async applyReview(val, id) {
      let body = {
        result: val,
        user_survey_specialist_id: id
      };
      body['apply_id'] = this.id;
      try {
        await this.$store.dispatch(
          'product/survey/user/ReviewUserSurveyApply',
          body
        );
        this.visible = false;
        this.getUserSurvey();
      } catch (err) {
        return;
      }
    },
    async getUserSurveyDetail(type) {
      let params = {
        id: this.id
      };
      try {
        if (type === 'view') {
          getOrganizationList().then((res) => {
            this.memberList = res;
          });
        }
        await this.$store.dispatch('product/survey/user/viewUserSurveyDetail', {
          params,
          type
        });
        this.userSurveyForm =
          this.$store.state.product.survey.user.userSurveyDetail;
        this.userSurveyForm.expected_finish_time = formatterTime(
          this.userSurveyForm.expected_finish_time
        );
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitSurveyForm() {
      this.$refs.userSurveyForm.validate((valid) => {
        if (valid) {
          let val = {
            product_id: +this.$route.params.productId,
            survey_schedule_id: this.id,
            product_link: this.userSurveyForm.product_link,
            concrete_demand: this.userSurveyForm.concrete_demand,
            expected_result: this.userSurveyForm.expected_result,
            expected_finish_time: timestamp(
              this.userSurveyForm.expected_finish_time
            )
          };
          if (this.type === 'apply') {
            this.createApply(val);
          } else {
            this.applyReview(
              this.userSurveyForm.result,
              this.userSurveyForm.user_survey_specialist_id
            );
          }
        }
      });
    }
  }
};
</script>
