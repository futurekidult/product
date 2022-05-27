<template>
  <el-dialog
    v-model="visible"
    v-loading="loading"
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
          action=""
          :show-file-list="false"
          :on-success="handleFileSuccess"
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="isDisbaled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          只能上传jpg/png格式文件,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="show"
          class="attachment-list"
        >
          <div>{{ attachment.name }}</div>
          <el-button
            v-if="type === 'apply'"
            type="text"
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
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
            action=""
            :show-file-list="false"
            :on-success="handleRequirementFileSuccess"
            :limit="1"
          >
            <el-button
              type="primary"
              :disabled="isViewDisabled"
            >
              点击上传
            </el-button>
          </el-upload>
          <div class="attachment">
            只能上传jpg/png格式文件,单个文件不能超过5MB
          </div>
        </el-form-item>
        <el-form-item>
          <div
            v-if="requiredShow"
            class="attachment-list"
          >
            <div>{{ requiredAttachment.name }}</div>
            <el-button
              v-if="type === 'apply'"
              type="text"
            >
              删除
            </el-button>
            <el-button type="text">
              下载
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="选择用研专员"
          prop="user_survey_specialist_id"
        >
          <el-select
            v-model="demandForm.user_survey_specialist_id"
            placeholder="请选择用研专员"
            :disabled="isViewDisabled"
            clearable
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
import { timestamp } from '../../../../utils';
export default {
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
      loading: true
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
      await this.$store.dispatch('sample/user/createTestApply', body);
      this.visible = false;
    },
    async getUserTestApply() {
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
      this.loading = this.$store.state.sample.user.reviewLoading;
    },
    async viewUserTestApply() {
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
      this.loading = this.$store.state.sample.user.viewLoading;
    },

    async reviewTestApply(val) {
      let body = val;
      body.id = this.id;
      await this.$store.dispatch('sample/user/reviewTestApply', body);
      this.visible = false;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    handleRequirementFileSuccess(file, fileList) {
      this.requiredAttachment = {
        id: file.id,
        name: fileList.name
      };
      this.demandForm.user_requirement_file = this.requiredAttachment.id;
      this.requiredShow = true;
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
    handleFileSuccess(file, fileList) {
      this.show = true;
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.demandForm.demand_list_file = this.attachment.id;
    },
    deleteFile() {
      this.show = false;
    }
  }
};
</script>
