<template>
  <el-dialog
    v-model="visible"
    :title="formTitle"
    width="30%"
    @close="cancel"
  >
    <el-form
      :model="userSurveyForm"
      label-width="110px"
      style="width: 80%; margin: auto"
    >
      <el-form-item label="产品链接">
        <el-input
          v-model="userSurveyForm.link"
          placeholder="请输入产品链接"
        />
      </el-form-item>
      <el-form-item label="具体需求">
        <el-input
          v-model="userSurveyForm.concreteDemand"
          type="textarea"
          placeholder="请输入具体需求"
        />
      </el-form-item>
      <el-form-item label="期望结果">
        <el-input
          v-model="userSurveyForm.expectedResult"
          type="textarea"
          placeholder="请输入期望结果"
        />
      </el-form-item>
      <el-form-item label="期望完成时间">
        <el-date-picker
          v-model="userSurveyForm.expectedFinishTime"
          type="datetime"
          placeholder="请选择时间"
        />
      </el-form-item>
      <el-divider />
      <el-form-item label="评审结果">
        <el-select
          v-model="userSurveyForm.reviewResult"
          placeholder="请选择评审结果"
        />
      </el-form-item>
      <div style="text-align: right">
        <el-button type="primary">
          取消
        </el-button>
        <el-button type="primary">
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'formTitle'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      userSurveyForm: {}
    };
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    }
  }
};
</script>
