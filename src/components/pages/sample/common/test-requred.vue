<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="demandForm"
      label-width="130px"
      :model="demandForm"
      :rules="getRules"
    >
      <el-form-item
        label="用户体验时长"
        prop="user_experience_duration"
      >
        <el-input
          v-model="demandForm.user_experience_duration"
          placeholder="请输入天数"
          :disabled="isDisbaled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="期望完成日期"
        prop="estimated_finish_time"
      >
        <el-date-picker
          v-model="demandForm.estimated_finish_time"
          type="datetime"
          placeholder="请选择日期"
          :disabled="isDisbaled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="说明"
        prop="illustrate_text"
      >
        <el-input
          v-model="demandForm.illustrate_text"
          placeholder="请输入内容"
          type="textarea"
          :rows="6"
          :disabled="isDisbaled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="需求清单及假设"
        prop="demand_list_file"
      >
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
        >
          <el-button
            type="primary"
            :disabled="isDisbaled"
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
          <div>{{ attachment.name }}</div>
          <div style="display: flex">
            <div v-if="attachment.type === 12860">
              <el-button
                type="text"
                @click="showViewFile(attachment.id)"
              >
                预览
              </el-button>
              <span class="table-btn">|</span>
            </div>
            <el-button
              v-if="type === 'apply'"
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
            <el-button
              v-else
              type="text"
              @click="download(attachment.id, attachment.name)"
            >
              下载
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-divider />
      <el-form-item
        v-if="type !== 'apply'"
        label="评审结果"
        prop="review_result"
      >
        <el-select
          v-model="demandForm.review_result"
          placeholder="请选择"
          :disabled="isViewDisabled"
          clearable
        >
          <el-option
            v-for="item in reviewOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="demandForm.review_result === 1">
        <el-form-item
          label="样品需求数"
          prop="sample_demand_quantity"
        >
          <el-input
            v-model="demandForm.sample_demand_quantity"
            placeholder="请输入需求数"
            :disabled="isViewDisabled"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="用户要求"
          prop="user_requirement_file"
        >
          <el-upload
            action
            :show-file-list="false"
            :http-request="handleRequirementFileSuccess"
          >
            <el-button
              type="primary"
              :disabled="isViewDisabled"
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
            v-if="requiredShow"
            class="attachment-list"
          >
            <div>{{ requiredAttachment.name }}</div>
            <div style="display: flex">
              <div v-if="requiredAttachment.type === 12860">
                <el-button
                  type="text"
                  @click="showViewFile(requiredAttachment.id)"
                >
                  预览
                </el-button>
                <span class="table-btn">|</span>
              </div>
              <el-button
                v-if="type !== 'view'"
                type="text"
                @click="deleteRequiredFile"
              >
                删除
              </el-button>
              <el-button
                v-else
                type="text"
                @click="
                  download(requiredAttachment.id, requiredAttachment.name)
                "
              >
                下载
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="选择用研专员"
          prop="user_survey_specialist_id"
        >
          <el-tree-select
            v-model="demandForm.user_survey_specialist_id"
            :data="memberList"
            clearable
            show-checkbox
            :props="defaultProps"
            :disabled="isViewDisabled"
          />
        </el-form-item>
      </div>
      <div
        v-if="type !== 'view'"
        style="text-align: right"
      >
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  downloadFile,
  getFile,
  previewFile,
  timestamp
} from '../../../../utils';

export default {
  inject: ['getUser'],
  props: ['dialogVisible', 'title', 'type', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      reviewOptions: [
        {
          label: '评审通过',
          value: 1
        },
        {
          label: '评审不通过',
          value: 0
        }
      ],
      applyRules: {
        user_experience_duration: [
          {
            required: true,
            message: '请输入天数'
          }
        ],
        estimated_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        demand_list_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      reviewRules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        sample_demand_quantity: [
          {
            required: true,
            message: '请输入需求数'
          }
        ],
        user_requirement_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        user_survey_specialist_id: [
          {
            required: true,
            message: '请选择用研专员'
          }
        ]
      },
      demandForm: {},
      show: false,
      attachment: {},
      requiredAttachment: {},
      requiredShow: false,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  computed: {
    getRules() {
      if (this.type === 'apply') {
        return this.applyRules;
      } else if (this.type === 'review') {
        return this.reviewRules;
      } else {
        return {};
      }
    },
    isDisbaled() {
      if (this.type === 'apply') {
        return false;
      } else {
        return true;
      }
    },
    isViewDisabled() {
      if (this.type === 'view') {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.getOrganizationList();
    if (this.type === 'review') {
      this.getUserTestApply();
    } else if (this.type === 'view') {
      this.viewUserTestApply();
    }
  },
  methods: {
    async createTestApply(val) {
      let body = val;
      body['sample_id'] = +this.$route.params.id;
      try {
        await this.$store.dispatch('sample/user/createTestApply', body);
        this.visible = false;
        this.getUser();
      } catch (err) {
        return;
      }
    },
    async getUserTestApply() {
      try {
        await this.$store.dispatch('sample/user/getUserTestApply', {
          params: {
            id: this.id
          }
        });
        this.demandForm = this.$store.state.sample.user.applyDetail;
        this.attachment = this.demandForm.demand_list_file;
        this.show = true;
        if (!this.demandForm.user_survey_specialist_id) {
          this.demandForm.user_survey_specialist_id = '';
        }
      } catch (err) {
        return;
      }
    },
    async viewUserTestApply() {
      try {
        await this.$store.dispatch('sample/user/viewUserTestApply', {
          params: {
            id: this.id
          }
        });
        this.demandForm = this.$store.state.sample.user.viewApplyDetail;
        this.attachment = this.demandForm.demand_list_file;
        this.requiredAttachment = this.demandForm.user_requirement_file;
        this.show = true;
        this.requiredShow = true;
      } catch (err) {
        return;
      }
    },
    async reviewTestApply(val) {
      let body = val;
      body.id = this.id;
      try {
        await this.$store.dispatch('sample/user/reviewTestApply', body);
        this.visible = false;
        this.getUser();
      } catch (err) {
        return;
      }
    },
    async getOrganizationList() {
      try {
        await this.$store.dispatch('getOrganizationList');
        this.memberList = this.$store.state.organizationList;
        for (let key in this.memberList) {
          this.childrenFunc(this.memberList[key]);
        }
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async handleRequirementFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
          this.requiredShow = true;
          this.requiredAttachment = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
          this.demandForm.user_requirement_file = this.requiredAttachment.id;
        }
      } catch (err) {
        return;
      }
    },
    submitForm() {
      this.$refs.demandForm.validate((valid) => {
        if (valid) {
          if (this.type === 'apply') {
            this.demandForm.user_experience_duration =
              +this.demandForm.user_experience_duration;
            this.createTestApply(this.demandForm);
            this.demandForm.estimated_finish_time = timestamp(
              this.demandForm.estimated_finish_time
            );
          } else {
            this.reviewTestApply({
              review_result: this.demandForm.review_result,
              sample_demand_quantity: +this.demandForm.sample_demand_quantity,
              user_requirement_file: this.demandForm.user_requirement_file,
              user_survey_specialist_id:
                this.demandForm.user_survey_specialist_id
            });
          }
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
          this.attachment = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
          this.demandForm.demand_list_file = this.attachment.id;
        }
      } catch (err) {
        return;
      }
    },
    deleteFile() {
      this.attachment = {};
      this.demandForm.demand_list_file = '';
      this.show = false;
    },
    deleteRequiredFile() {
      this.requiredAttachment = {};
      this.demandForm.user_requirement_file = '';
      this.requiredShow = false;
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
