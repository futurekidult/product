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
            label="测试报告"
            prop="test_result_file"
            :rules="[{ required: true, message: '请上传附件' }]"
          >
            <base-upload
              type="file"
              tag="测试报告"
              url="agency-test-report"
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
      </div>
    </el-form>
  </div>
</template>

<script>
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
    confirmResult() {
      this.confirmTestResult({
        test_result: 1
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
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
