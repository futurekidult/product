<template>
  <div v-loading="$store.state.sample.agency.agencyLoading">
    <el-form
      ref="agencyForm"
      :model="agencyForm"
    >
      <el-form-item
        label="是否机构测试"
        prop="isAgency"
        :rules="[{ required: true, message: '请选择' }]"
        style="width: 20%"
      >
        <el-select
          v-model="agencyForm.isAgency"
          placeholder="请选择"
          :disabled="agencyValue !== -1"
          clearable
        >
          <el-option
            v-for="item in isAgencyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="agencyValue === -1"
          type="primary"
          @click="submitResult"
        >
          提交
        </el-button>
      </el-form-item>
      <div v-if="agencyValue === 1">
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
                v-if="progress.state === 10"
                @click="showFailReason"
              >
                测试不通过
              </el-button>
              <el-button
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
          type="agency"
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
              v-if="show"
              class="attachment-list"
            >
              <div>{{ file.name }}</div>
              <div style="display: flex">
                <div v-if="file.type === 12860">
                  <el-button
                    type="text"
                    @click="showViewFile(file.id)"
                  >
                    预览
                  </el-button>
                  <span class="table-btn">|</span>
                </div>
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
              />
            </el-form-item>
            <el-divider />
            <div style="text-align: right">
              <el-button class="close-btn">
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
    </el-form>
  </div>
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
    'submitState',
    'attachment',
    'agencyValue',
    'id',
    'getProgress',
    'changeColor',
    'testId'
  ],
  data() {
    return {
      agencyForm: {
        isAgency: this.agencyValue
      },
      isAgencyOptions: [
        {
          label: '请选择',
          value: -1,
          disabled: true
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      fileForm: {
        test_result_file: this.attachment
      },
      failFormVisible: false,
      reasonForm: {},
      file: this.attachment,
      show: true
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
        await this.$store.dispatch('sample/agency/confirmTestResult', body);
        if (val.test_result === 0) {
          this.failFormVisible = false;
        }
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    async isAgency(val) {
      let body = val;
      try {
        await this.$store.dispatch('sample/agency/isAgency', body);
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
        await this.$store.dispatch('sample/agency/submitTestResult', body);
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    submitResult() {
      this.$refs.agencyForm.validate((valid) => {
        if (valid) {
          this.isAgency({
            test_apply_id: this.id,
            is_agency: this.agencyForm.isAgency
          });
        }
      });
    },
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
          this.show = true;
          this.file = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
        }
      } catch (err) {
        return;
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
      this.show = false;
    },
    showFailReason() {
      this.failFormVisible = true;
    },
    submitFailResult() {
      this.confirmTestResult({
        test_result: 0,
        unapproved_reason_text: this.reasonForm.reason
      });
    },
    confirmResult() {
      this.confirmTestResult({
        test_result: 1
      });
    },
    submitReport() {
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          this.submitTestResult(this.file.id);
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
