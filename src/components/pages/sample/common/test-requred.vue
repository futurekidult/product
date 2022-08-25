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
          :disabled="isDisabled"
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
          :disabled="isDisabled"
          clearable
          :default-time="defaultTime"
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
          :disabled="isDisabled"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="需求清单及假设"
        prop="demand_list_file"
      >
        <base-upload 
          type="file"
          tag="需求清单及假设"
          url="user-demand-list"
          :file="attachment"
          :is-disabled="isDisabled"
          @get-file="(val) => getUploadFile(val, 'demand_list_file')"
        />
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
          <base-upload 
            type="file"
            tag="用户要求"
            url="user-requirement"
            :file="requiredAttachment"
            :is-disabled="isViewDisabled"
            @get-file="(val) => getUploadFile(val, 'user_requirement_file')"
          />
        </el-form-item>
        <el-form-item
          label="选择用研专员"
          prop="user_survey_specialist_id"
        >
          <el-tree-select
            v-model="demandForm.user_survey_specialist_id"
            :data="memberList"
            clearable
            filterable
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
  formatterTime,
  getOrganizationList,
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
      attachment: {},
      requiredAttachment: {},
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      defaultTime: new Date(2000,1,1,23,59,59)
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
    isDisabled() {
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
    getOrganizationList().then( (res) => {
      this.memberList = res;
    });
    if (this.type === 'review') {
      this.getUserTestApply();
    } else if (this.type === 'view') {
      this.viewUserTestApply();
    }
  },
  methods: {
    async createTestApply(val) {
      let body = {
        'sample_id': +this.$route.params.id,
        'user_experience_duration': +val.user_experience_duration,
        'estimated_finish_time': timestamp(val.estimated_finish_time),
        'illustrate_text': val.illustrate_text,
        'demand_list_file': val.demand_list_file
      }
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
        this.demandForm.estimated_finish_time = formatterTime(this.demandForm.estimated_finish_time);
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
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitForm() {
      this.demandForm.demand_list_file = this.attachment.id;
      if(this.type === 'review') {
        this.demandForm.user_requirement_file = this.requiredAttachment.id;
      }
      this.$refs.demandForm.validate((valid) => {
        if (valid) {
          if (this.type === 'apply') {
            this.createTestApply(this.demandForm);
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
    getUploadFile(e, str) {
      if(str === 'demand_list_file') {
        this.attachment = e;
      } else {
        this.requiredAttachment = e;
      }
    }
  }
};
</script>
