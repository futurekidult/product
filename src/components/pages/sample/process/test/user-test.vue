<template>
  <div v-loading="$store.state.sample.user.userLoading">
    <div class="test-item">
      <div class="test-title">
        用户测试申请进度表
      </div>
      <el-button @click="showApplyForm">
        申请用户测试
      </el-button>
    </div>

    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="applyList"
    >
      <el-table-column
        label="序号"
        type="index"
        width="80px"
      />
      <el-table-column
        label="申请人"
        prop="creator"
      />
      <el-table-column
        label="提交时间"
        prop="submit_time"
        width="200px"
      />
      <el-table-column
        label="用户体验时长"
        prop="user_experience_duration"
      />
      <el-table-column
        label="期望完成日期"
        prop="estimated_finish_time"
        width="200px"
      />
      <el-table-column
        label="样品需求数"
        prop="sample_demand_quantity"
      />
      <el-table-column
        label="评审完成时间"
        prop="review_finish_time"
        width="200px"
      />
      <el-table-column
        label="评审状态"
        prop="review_state_desc"
      />
      <el-table-column
        label="操作"
        width="200px"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.review_state === 10"
            type="text"
            @click="showReviewForm(scope.row.id)"
          >
            用户测试需求评审
          </el-button>
          <el-button
            v-if="scope.row.review_state !== 10"
            type="text"
            @click="showViewForm(scope.row.id)"
          >
            查看
          </el-button>
          <span
            v-if="scope.row.review_state === 30"
            class="table-btn"
          >|</span>
          <el-button
            v-if="scope.row.review_state === 30"
            type="text"
            @click="showEditForm(scope.row.id)"
          >
            编辑
          </el-button>
          <span
            v-if="scope.row.review_state === 30"
            class="table-btn"
          >|</span>
          <el-button
            v-if="
              scope.row.review_state === 30 &&
                scope.row.test_template_state === 0
            "
            type="text"
            @click="showUploadForm(scope.row.id)"
          >
            上传测试模板
          </el-button>
          <el-button
            v-if="
              scope.row.review_state === 30 &&
                scope.row.test_template_state === 1
            "
            type="text"
            @click="showViewTemplateForm(scope.row.id)"
          >
            查看测试模板
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="test-title">
      测试用户表
    </div>
    <user-list />

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
        label="上传附件"
        prop="test_result_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="handleFileSuccess"
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="submitState === 1"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="show"
          class="attachment-list"
        >
          <div>{{ attachment.name }}</div>
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

  <test-required
    v-if="applyFormVisible"
    :dialog-visible="applyFormVisible"
    title="申请用户测试"
    type="apply"
    @hide-dialog="closeApplyForm"
  />

  <test-required
    v-if="reviewFormVisible"
    :id="reviewId"
    :dialog-visible="reviewFormVisible"
    title="用户测试需求评审"
    type="review"
    @hide-dialog="closeReviewForm"
  />

  <test-required
    v-if="viewFormVisible"
    :id="viewId"
    :dialog-visible="viewFormVisible"
    title="用户测试需求"
    type="view"
    @hide-dialog="closeViewForm"
  />

  <el-dialog
    v-model="specialistFormVisible"
    title="编辑"
    width="20%"
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
    @hide-dialog="closeUploadForm"
  />

  <template-form
    v-if="viewTemplateFromVisible"
    :id="fileId"
    :dialog-visible="viewTemplateFromVisible"
    title="查看"
    type="view"
    @hide-dialog="closeViewTemplateForm"
  />
</template>

<script>
import UserList from '../../common/user-template.vue';
import TestRequired from '../../common/test-requred.vue';
import TestQuestions from '../../common/test-template.vue';
import TemplateForm from '../../common/template-form.vue';
import { downloadFile, getFile, previewFile } from '../../../../../utils';

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
    'testId'
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
      show: true,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  watch: {
    attachment(val) {
      this.file = val;
    }
  },
  mounted() {
    this.getOrganizationList();
  },
  methods: {
    async confirmTestResult(val) {
      let body = val;
      body.id = this.testId;
      body['sample_id'] = +this.$route.params.id;
      body['test_apply_id'] = this.id;
      await this.$store.dispatch('sample/user/confirmTestResult', body);
      if (val.test_result === 0) {
        this.failFormVisible = false;
      }
      this.getProgress();
    },
    async getSpecialist(val) {
      await this.$store.dispatch('sample/user/getSpecialist', {
        params: {
          id: val
        }
      });
      this.editForm = this.$store.state.sample.user.specialist;
    },
    async updateSpecialist(val) {
      let body = val;
      body.id = this.id;
      await this.$store.dispatch('sample/user/updateSpecialist', body);
      this.specialistFormVisible = false;
      this.getProgress();
    },
    async submitTestResult(val) {
      let body = {
        test_result_file: val,
        sample_id: +this.$route.params.id,
        test_apply_id: this.id
      };
      await this.$store.dispatch('sample/user/submitTestResult', body);
      this.getProgress();
    },
    async getOrganizationList() {
      await this.$store.dispatch('getOrganizationList');
      this.memberList = this.$store.state.organizationList;
      for (let key in this.memberList) {
        this.childrenFunc(this.memberList[key]);
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
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      await this.$store.dispatch('uploadFile', form);
      if (this.$store.state.uploadState) {
        this.show = true;
        this.file = {
          id: this.$store.state.fileRes.id,
          name: this.$store.state.fileRes.file_name,
          type: this.$store.state.fileRes.type
        };
      }
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        downloadFile(this.$store.state.viewLink, name);
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        previewFile(this.$store.state.viewLink);
      }
    },
    deleteFile() {
      this.file = {};
      this.fileForm.test_result_file = '';
      this.show = false;
    },
    confirmResult() {
      this.confirmTestResult({
        test_result: 1
      });
    },
    submitFailResult() {
      this.confirmTestResult({
        test_result: 0,
        unapproved_reason_text: this.reasonForm.reason
      });
    },
    submitReport() {
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          this.submitTestResult(this.file.id);
        }
      });
    },
    childrenFunc(data) {
      if (data.member_list) {
        for (const item of data.member_list) {
          data.children.push(item);
        }
      }
      return data.children;
    }
  }
};
</script>
