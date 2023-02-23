<template>
  <div>
    <div v-loading="$store.state.sample.user.userLoading">
      <div class="test-item">
        <div class="test-title">
          用户测试申请进度表
        </div>
        <el-button
          :disabled="buttonState === 0"
          @click="showApplyForm"
        >
          申请用户测试
        </el-button>
      </div>
      <base-table
        :table-column="$global.userTestTableColumn"
        :table-data="applyList"
        :operation-width="250"
        :pagination-visible="false"
      >
        <template #default="slotProps">
          <text-btn
            v-if="slotProps.row.review_state === 10"
            @handle-click="showReviewForm(slotProps.row.id)"
          >
            用户测试需求评审
          </text-btn>
          <text-btn
            v-if="slotProps.row.review_state !== 10"
            @handle-click="showViewForm(slotProps.row.id)"
          >
            查看
          </text-btn>
          <span
            v-if="slotProps.row.review_state === 30"
            class="table-btn"
          >|</span>
          <text-btn
            v-if="slotProps.row.review_state === 30"
            @handle-click="showEditForm(slotProps.row.id)"
          >
            编辑
          </text-btn>
          <span
            v-if="slotProps.row.review_state === 30"
            class="table-btn"
          >|</span>
          <text-btn
            v-if="
              slotProps.row.review_state === 30 &&
                slotProps.row.test_template_state === 0
            "
            @handle-click="showUploadForm(slotProps.row.id)"
          >
            上传测试模板
          </text-btn>
          <text-btn
            v-if="
              slotProps.row.review_state === 30 &&
                slotProps.row.test_template_state === 1
            "
            @handle-click="showViewTemplateForm(slotProps.row.id)"
          >
            查看测试模板
          </text-btn>
        </template>
      </base-table>
      <div class="test-title">
        测试用户表
      </div>
      <user-list :user-list="userList" />

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
        测试结果问题表
      </div>
      <test-questions
        type="user"
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
            url="user-test-report"
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
    </div>
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

    <test-required
      v-if="applyFormVisible"
      :dialog-visible="applyFormVisible"
      title="申请用户测试"
      type="apply"
      :close-on-click-modal="false"
      @hide-dialog="closeApplyForm"
    />

    <test-required
      v-if="reviewFormVisible"
      :id="reviewId"
      :dialog-visible="reviewFormVisible"
      title="用户测试需求评审"
      type="review"
      :close-on-click-modal="false"
      @hide-dialog="closeReviewForm"
    />

    <test-required
      v-if="viewFormVisible"
      :id="viewId"
      :dialog-visible="viewFormVisible"
      title="用户测试需求"
      type="view"
      :close-on-click-modal="false"
      @hide-dialog="closeViewForm"
    />

    <el-dialog
      v-model="specialistFormVisible"
      title="编辑"
      width="25%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editForm"
        v-loading="$store.state.sample.user.editLoading"
        :model="editForm"
      >
        <el-form-item
          label="选择用研专员"
          prop="user_survey_specialist_id"
          :rules="[{ required: true, message: '请选择用研专员' }]"
        >
          <el-tree-select
            v-model="editForm.user_survey_specialist_id"
            :data="memberList"
            clearable
            filterable
            :props="defaultProps"
          />
        </el-form-item>
        <el-divider />
        <div style="text-align: right">
          <el-button
            class="close-btn"
            @click="closeEditForm"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitEditForm"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <template-form
      v-if="templateFormVisible"
      :id="fileId"
      :dialog-visible="templateFormVisible"
      title="上传"
      type="create"
      :close-on-click-modal="false"
      @hide-dialog="closeUploadForm"
    />

    <template-form
      v-if="viewTemplateFromVisible"
      :id="fileId"
      :dialog-visible="viewTemplateFromVisible"
      title="查看"
      type="view"
      :close-on-click-modal="false"
      @hide-dialog="closeViewTemplateForm"
    />
  </div>
</template>

<script>
import UserList from '../../common/user-template.vue';
import TestRequired from '../../common/test-requred.vue';
import TestQuestions from '../../common/test-template.vue';
import TemplateForm from '../../common/template-form.vue';
import { getOrganizationList } from '../../../../../utils';

export default {
  components: {
    UserList,
    TestRequired,
    TestQuestions,
    TemplateForm
  },
  props: [
    'id',
    'progress',
    'attachment',
    'submitState',
    'buttonState',
    'applyList',
    'getProgress',
    'changeColor',
    'testId',
    'userList'
  ],
  data() {
    return {
      applyFormVisible: false,
      failFormVisible: false,
      reviewFormVisible: false,
      reasonForm: {},
      fileForm: {
        test_result_file: this.attachment
      },
      reviewId: 0,
      viewFormVisible: false,
      viewId: 0,
      specialistFormVisible: false,
      editForm: {},
      templateFormVisible: false,
      viewTemplateFromVisible: false,
      fileId: 0,
      file: this.attachment,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      editId: 0
    };
  },
  watch: {
    attachment(val) {
      this.file = val;
    }
  },
  mounted() {
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    async confirmTestResult(val) {
      let body = val;
      body.id = this.testId;
      body['sample_id'] = +this.$route.params.id;
      body['test_apply_id'] = this.id;
      try {
        await this.$store.dispatch('sample/user/confirmTestResult', body);
        if (val.test_result === 0) {
          this.failFormVisible = false;
        }
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    async getSpecialist(val) {
      try {
        await this.$store.dispatch('sample/user/getSpecialist', {
          params: {
            id: val
          }
        });
        this.editForm = this.$store.state.sample.user.specialist;
      } catch (err) {
        return;
      }
    },
    async updateSpecialist(val) {
      let body = val;
      body.id = this.editId;
      try {
        await this.$store.dispatch('sample/user/updateSpecialist', body);
        this.specialistFormVisible = false;
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
        await this.$store.dispatch('sample/user/submitTestResult', body);
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    showApplyForm() {
      this.applyFormVisible = true;
    },
    closeApplyForm() {
      this.applyFormVisible = false;
    },
    showReviewForm(id) {
      this.reviewFormVisible = true;
      this.reviewId = id;
    },
    closeReviewForm() {
      this.reviewFormVisible = false;
    },
    showViewForm(id) {
      this.viewFormVisible = true;
      this.viewId = id;
    },
    closeViewForm() {
      this.viewFormVisible = false;
    },
    showViewTemplateForm(id) {
      this.viewTemplateFromVisible = true;
      this.fileId = id;
    },
    closeViewTemplateForm() {
      this.viewTemplateFromVisible = false;
    },
    showEditForm(id) {
      this.specialistFormVisible = true;
      this.getSpecialist(id);
      this.editId = id;
    },
    closeEditForm() {
      this.specialistFormVisible = false;
    },
    showUploadForm(id) {
      this.templateFormVisible = true;
      this.fileId = id;
    },
    closeUploadForm() {
      this.templateFormVisible = false;
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.updateSpecialist(this.editForm);
        }
      });
    },
    showFailReason() {
      this.failFormVisible = true;
    },
    closeFailReason() {
      this.failFormVisible = false;
    },
    confirmResult() {
      this.confirmTestResult({
        test_result: 1
      });
    },
    submitFailResult() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          this.confirmTestResult({
            test_result: 0,
            unapproved_reason_text: this.reasonForm.reason
          });
        }
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
