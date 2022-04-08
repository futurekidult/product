<template>
  <div class="survey-title">
    调研进度表
  </div>

  <survey-schedule />

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
        prop="inventivePatent"
      >
        <el-select
          v-model="riskForm.inventivePatent"
          placeholder="请选择发明专利"
        />
      </el-form-item>
      <el-form-item
        label="是否需要认证"
        prop="needVerify"
      >
        <el-select
          v-model="riskForm.needVerify"
          placeholder="请选择是否需要认证"
        />
      </el-form-item>
    </div>
    <el-form-item
      label="外观专利"
      prop="designPatent"
    >
      <el-input
        v-model="riskForm.designPatent"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入外观专利"
      />
    </el-form-item>
    <el-form-item
      label="法律法规"
      prop="legalRegulation"
    >
      <el-input
        v-model="riskForm.legalRegulation"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入法律法规"
      />
    </el-form-item>
    <el-form-item
      label="其他风险"
      prop="otherRisk"
    >
      <el-input
        v-model="riskForm.otherRisk"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入其它风险"
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
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item style="margin-bottom: 18px">
      <div
        v-for="file in fileList"
        :key="file.id"
        class="attachment-list"
      >
        <div @click="previewFile(file.id)">
          {{ file.name }}
        </div>
        <el-button
          type="text"
          @click="deleteFile(file.id)"
        >
          删除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
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
        inventivePatent: [
          {
            required: true,
            message: '请选择发明专利'
          }
        ],
        needVerify: [
          {
            required: true,
            message: '请选择是否需要认证'
          }
        ],
        designPatent: [
          {
            required: true,
            message: '请输入外观专利'
          }
        ],
        legalRegulation: [
          {
            required: true,
            message: '请输入法律法规'
          }
        ],
        otherRisk: [
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
      }
    };
  },
  methods: {
    submitRiskForm() {
      this.$refs.riskForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.riskForm.attachment = file.id;
    },
    deleteFile(id) {
      console.log(id);
    },
    previewFile(id) {
      console.log(id);
    }
  }
};
</script>
