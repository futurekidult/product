<template>
  <div v-loading="$store.state.sample.quality.qualityLoading">
    <div class="test-title">
      测试进度表
    </div>

    <el-descriptions
      :column="5"
      direction="vertical"
      border
    >
      <el-descriptions-item label="负责人">
        {{ progress.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="progress.unapproved_reason_text"
        label="不通过原因"
      >
        {{ progress.unapproved_reason_text }}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="progress.state !== 40"
        label="操作"
        width="300px"
      >
        <div :class="progress.state === undefined ? 'hide' : ''">
          <el-button @click="showFailReason">
            测试不通过
          </el-button>
          <el-button
            type="primary"
            @click="confirmResult"
          >
            测试通过
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <div class="test-title">
      测试结果审批进度表
    </div>

    <el-descriptions
      :column="4"
      direction="vertical"
      border
    >
      <el-descriptions-item label="品质专员">
        {{ testResultSchedule.quality_specialist }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ formatterTime(testResultSchedule.actual_finish_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="setStateColor(testResultSchedule.state)">
          {{ testResultSchedule.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="testResultSchedule.state === 20"
        label="操作"
        width="300px"
      >
        <el-button @click="approvalTestResult(0)">
          不通过
        </el-button>
        <el-button
          type="success"
          @click="approvalTestResult(1)"
        >
          通过
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <div class="test-title">
      测试结果问题表
    </div>
    <test-questions
      type="quality"
      :state="submitState"
      :test-id="id"
    />

    <el-form
      ref="fileForm"
      label-width="80px"
      style="width: 50%"
      :model="fileForm"
    >
      <el-form-item
        label="测试报告"
        prop="test_result_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <base-upload
          type="file"
          tag="测试报告"
          url="quality-test-report"
          :file="file"
          :is-disabled="submitState === 1"
          @get-file="getUploadFile"
        />
      </el-form-item>
      <el-form-item v-if="submitState !== 1">
        <el-button
          type="primary"
          @click="submitReport"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      v-model="failFormVisible"
      title="不通过"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="reasonForm"
        :model="reasonForm"
      >
        <el-form-item
          label="填写原因"
          prop="reason"
          :rules="[{ required: true, message: '请填写原因' }]"
        >
          <el-input
            v-model="reasonForm.reason"
            type="textarea"
            :rows="6"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-divider />
        <div style="text-align: right">
          <el-button
            class="close-btn"
            @click="closeFailReason"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitFailResult"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TestQuestions from '../../common/test-template.vue';
import { formatterTime, setStateColor } from '../../../../../utils/index';

export default {
  components: {
    TestQuestions
  },
  inject: ['getTestResultSchedule', 'getQualityDetail'],
  props: [
    'progress',
    'attachment',
    'submitState',
    'id',
    'getProgress',
    'changeColor',
    'testId'
  ],
  data() {
    return {
      failFormVisible: false,
      reasonForm: {},
      fileForm: {
        test_result_file: this.attachment
      },
      file: this.attachment
    };
  },
  computed: {
    testResultSchedule() {
      return this.getTestResultSchedule().test_result_schedule;
    },
    testResultId() {
      return this.getTestResultSchedule().id;
    }
  },
  watch: {
    attachment(val) {
      this.file = val;
    }
  },
  methods: {
    formatterTime,
    setStateColor,
    async confirmTestResult(val) {
      let body = val;
      body.id = this.testId;
      body['sample_id'] = +this.$route.params.id;
      body['test_apply_id'] = this.id;
      try {
        await this.$store.dispatch('sample/quality/confirmTestResult', body);
        if (val.test_result === 0) {
          this.failFormVisible = false;
        }
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    async submitTestResult(val) {
      let body = {
        test_result_file: val,
        sample_id: +this.$route.params.id,
        test_apply_id: this.id
      };
      try {
        await this.$store.dispatch('sample/quality/submitTestResult', body);
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    confirmResult() {
      this.confirmTestResult({
        test_result: 1
      });
    },
    showFailReason() {
      this.failFormVisible = true;
    },
    closeFailReason() {
      this.failFormVisible = false;
    },
    submitFailResult() {
      this.confirmTestResult({
        test_result: 0,
        unapproved_reason_text: this.reasonForm.reason
      });
    },
    submitReport() {
      this.fileForm.test_result_file = this.file.id;
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          this.submitTestResult(this.fileForm.test_result_file);
        }
      });
    },
    getUploadFile(e) {
      this.file = e;
    },
    async approvalTestResult(val) {
      let body = {
        id: this.testResultId,
        approval_result: val
      };
      try {
        await this.$store.dispatch('sample/quality/approvalTestResult', body);
        this.getQualityDetail();
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
