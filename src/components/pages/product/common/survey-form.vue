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
        prop="productLink"
      >
        <el-input
          v-model="userSurveyForm.link"
          placeholder="请输入产品链接"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="具体需求"
        prop="concreteDemand"
      >
        <el-input
          v-model="userSurveyForm.concreteDemand"
          type="textarea"
          placeholder="请输入具体需求"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="期望结果"
        prop="expectedResult"
      >
        <el-input
          v-model="userSurveyForm.expectedResult"
          type="textarea"
          placeholder="请输入期望结果"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="期望完成时间"
        prop="expectedFinishTime"
      >
        <el-date-picker
          v-model="userSurveyForm.expectedFinishTime"
          type="datetime"
          placeholder="请选择时间"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-divider />
      <el-form-item
        v-if="type === 'review'"
        label="评审结果"
        prop="reviewResult"
      >
        <el-select
          v-model="userSurveyForm.reviewResult"
          placeholder="请选择评审结果"
        />
      </el-form-item>
      <div style="text-align: right">
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
  props: ['dialogVisible', 'formTitle', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      userSurveyForm: {},
      applyRules: {
        productLink: [
          {
            required: true,
            message: '请输入产品链接'
          }
        ],
        concreteDemand: [
          {
            required: true,
            message: '请输入具体需求'
          }
        ],
        expectedResult: [
          {
            required: true,
            message: '请输入期望结果'
          }
        ],
        expectedFinishTime: [
          {
            required: true,
            message: '请选择期望完成时间'
          }
        ]
      },
      reviewRules: {
        reviewResult: [
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
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitSurveyForm() {
      this.$refs.userSurveyForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
