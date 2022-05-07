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
      :rules="isApply"
    >
      <el-form-item
        label="产品链接"
        prop="product_link"
      >
        <el-input
          v-model="userSurveyForm.product_link"
          placeholder="请输入产品链接"
          :disabled="isDisabled"
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
        />
      </el-form-item>
      <el-divider />
      <el-form-item
        v-if="type !== 'apply'"
        label="评审结果"
        prop="result"
      >
        <el-select
          v-model="userSurveyForm.result"
          placeholder="请选择评审结果"
        />
      </el-form-item>
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
export default {
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
        ]
      }
    };
  },
  computed: {
    isApply() {
      if (this.type === 'apply') {
        return this.applyRules;
      } else {
        return this.reviewRules;
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
  methods: {
    async getUserSurvey() {
      await this.$store.dispatch('product/survey/user/getUserSurveyData');
    },
    async createApply(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      body['survey_schedule_id'] = this.id;
      await this.$store.dispatch(
        'product/survey/user/createUserSurveyApply',
        body
      );
      this.visible = false;
    },
    async applyReview(val) {
      let body = {
        result: val
      };
      body['apply_id'] = this.id;
      await this.$store.dispatch(
        'product/survey/user/createUserSurveyApply',
        body
      );
      this.visible = false;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitSurveyForm() {
      this.$refs.userSurveyForm.validate((valid) => {
        if (valid) {
          if (this.type === 'apply') {
            this.createApply(this.userSurveyForm);
          } else {
            this.applyReview(this.userSurveyForm.result);
          }
          this.getUserSurvey();
        }
      });
    }
  }
};
</script>
