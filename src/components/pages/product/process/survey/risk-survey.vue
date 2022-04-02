<template>
  <div class="survey-title">
    调研进度表
  </div>

  <survey-schedule />

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    label-width="110px"
    style="width: 50%"
  >
    <div class="form-item">
      <el-form-item label="发明专利">
        <el-select />
      </el-form-item>
      <el-form-item label="是否需要认证">
        <el-select />
      </el-form-item>
    </div>
    <el-form-item label="外观专利">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="法律法规">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="其他风险">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="上传附件"
      style="margin-bottom: 18px"
    >
      <el-upload action="#">
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item style="margin-bottom: 18px">
      <div class="attachment-list">
        xx
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">
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
  }
};
</script>
