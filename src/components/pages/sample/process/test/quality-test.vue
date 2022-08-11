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
      <el-descriptions-item label="不通过原因">
        {{ progress.unapproved_reason_text }}
      </el-descriptions-item>
      <el-descriptions-item
        label="操作"
        width="300px"
      >
        <div :class="progress.state === undefined ? 'hide' : ''">
          <el-button
            v-if="progress.unapproved_reason_text || progress.state === 10"
            :disabled="progress.state !== 10"
            @click="showFailReason"
          >
            测试不通过
          </el-button>
          <el-button
            v-if="!progress.unapproved_reason_text"
            type="primary"
            :disabled="progress.state !== 10"
            @click="confirmResult"
          >
            测试通过
          </el-button>
        </div>
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
        label="上传附件"
        prop="test_result_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
          :disabled="submitState === 1"
        >
          <el-button
            type="primary"
            :disabled="submitState === 1"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式,文件不能超过5MB(仅限一个)
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="JSON.stringify(file) !== '{}'"
          class="attachment-list"
        >
          <div>{{ file.name }}</div>
          <div style="display: flex">
            <el-button
              v-if="submitState !== 1"
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
            <span
              v-if="file.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              v-if="file.type === 12860"
              type="text"
              @click="showViewFile(file.id)"
            >
              预览
            </el-button>
          </div>
        </div>
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
  </div>
  <el-dialog
    v-model="failFormVisible"
    title="不通过"
    width="20%"
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
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../../utils';
import TestQuestions from '../../common/test-template.vue';

export default {
  components: {
    TestQuestions
  },
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
  watch: {
    attachment(val) {
      this.file = val;
    }
  },
  methods: {
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
    async handleFileSuccess(e) {
      if(e.file.size > 5 * 1024 * 1024 ) {
        this.$message.warning('附件大小超过限制，请重新上传！');
      } else if(e.file.type.indexOf('application') > -1 || e.file.type === 'text/csv') {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            this.file = {
              id: this.$store.state.fileRes.id,
              name: this.$store.state.fileRes.file_name,
              type: this.$store.state.fileRes.type
            };
          }
        } catch (err) {
          return;
        }
      } else {
        this.$message.warning('上传的附件格式有误！');
      }
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          downloadFile(this.$store.state.viewLink, name);
        }
      } catch (err) {
        return;
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          previewFile(this.$store.state.viewLink);
        }
      } catch (err) {
        return;
      }
    },
    deleteFile() {
      this.file = {};
      this.fileForm.test_result_file = '';
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
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>