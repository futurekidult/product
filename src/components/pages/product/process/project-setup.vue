<template>
  <div v-loading="$store.state.product.project.projectLoading">
    <div class="select-title">
      <span class="line">|</span> 项目立项
    </div>

    <div class="project-title">
      立项进度表
    </div>

    <el-descriptions
      border
      direction="vertical"
      :column="5"
    >
      <el-descriptions-item label="项目管理员">
        {{ progress.project_administrator }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="评审状态">
        <div :class="setReviewStateColor(progress.review_state)">
          {{ progress.review_state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="setStateColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="progress.state === 20"
        label="操作"
        width="300px"
      >
        <el-button
          class="close-btn"
          @click="approvalProject(0)"
        >
          不通过
        </el-button>
        <el-button
          type="success"
          @click="approvalProject(1)"
        >
          通过
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="projectForm"
      label-width="100px"
      class="project-form"
      :model="form"
      :rules="rules"
    >
      <div style="display: flex">
        <el-form-item
          label="评审结果"
          style="width: 30%"
          prop="review_result"
        >
          <el-select
            v-model="form.review_result"
            placeholder="请选择评审结果"
            clearable
            :disabled="isDisabled"
            @change="refresh(form.review_result)"
          >
            <el-option
              v-for="item in reviewOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-button
            v-if="!isDisabled"
            type="primary"
            style="margin-left: 20px"
            @click="submitProjectForm"
          >
            提交
          </el-button>
        </el-form-item>
      </div>
      <el-divider />
      <el-form-item
        v-if="form.review_result === 0"
        label="不通过原因"
        style="width: 50%"
        prop="unapproved_reason"
      >
        <el-input
          v-model="form.unapproved_reason"
          type="textarea"
          placeholder="请输入不通过原因"
          clearable
          :rows="6"
          :disabled="isDisabled"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <div v-if="form.review_result === 1">
        <profit-calculation :get-profit="profit" />
        <process-table :get-schedule="schedule" />

        <div class="profit-plan_title">
          销售计划表
        </div>

        <el-form-item
          label="项目计划书"
          prop="sales_plan"
          class="sales-plan"
        >
          <base-upload
            type="file"
            tag="项目计划书"
            url="sales-plan"
            :file="file"
            :is-disabled="isDisabled"
            @get-file="(val) => getUploadFile(val, 'sales_plan')"
          />
        </el-form-item>
      </div>
      <div v-if="form.review_result === 1 || form.review_result === 0">
        <div class="profit-plan_title">
          会议附件内容
        </div>
        <el-form-item
          class="sales-plan"
          label="会议纪要"
          prop="meeting_summary_file"
        >
          <base-upload
            type="file"
            tag="会议纪要"
            url="project-meeting-summary"
            :file="meetingFile"
            :is-disabled="isDisabled"
            @get-file="(val) => getUploadFile(val, 'meeting_summary_file')"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import ProfitCalculation from '../common/profit-calculation.vue';
import ProcessTable from '../common/process-table.vue';
import { setReviewStateColor, setStateColor } from '../../../../utils/index.js';

export default {
  components: {
    ProfitCalculation,
    ProcessTable
  },
  inject: ['getProject', 'getProfitList', 'getProcessTable', 'getBase'],
  props: [
    'progress',
    'attachment',
    'meetingAttachment',
    'projectForm',
    'profit',
    'schedule'
  ],
  data() {
    return {
      rules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        sales_plan: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        unapproved_reason: [
          {
            required: true,
            message: '请输入不通过原因'
          }
        ]
      },
      reviewOptions: this.$global.reviewOptions,
      file: this.attachment,
      meetingFile: this.meetingAttachment,
      form: this.projectForm
    };
  },
  computed: {
    isDisabled() {
      return this.progress.review_state === 10 ? false : true;
    }
  },
  watch: {
    attachment(val) {
      this.file = val;
    },
    meetingAttachment(val) {
      this.meetingFile = val;
    },
    projectForm(val) {
      this.form = val;
    }
  },
  methods: {
    setStateColor,
    setReviewStateColor,
    async reviewProject(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/project/reviewProject', body);
        this.getProject();
        this.getProfitList();
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    submitProjectForm() {
      this.form.sales_plan = this.file.id;
      this.form.meeting_summary_file = this.meetingFile.id;
      let form = JSON.parse(JSON.stringify(this.form));
      if (form.review_result === 1) {
        delete form.unapproved_reason;
      }
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          this.reviewProject(form);
        }
      });
    },
    closeProjectForm() {
      this.addVisible = false;
    },
    async approvalProject(val) {
      let body = {
        product_id: +this.$route.params.productId,
        approval_result: val
      };
      try {
        await this.$store.dispatch('product/project/approvalProject', body);
        this.getProject();
        this.getBase();
        this.getProfitList();
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    refresh(val) {
      if (val === 1) {
        this.getProfitList();
        this.getProcessTable();
      }
    },
    getUploadFile(e, str) {
      switch (str) {
        case 'sales_plan':
          this.file = e;
          break;
        case 'meeting_summary_file':
          this.meetingFile = e;
          break;
        default:
      }
    }
  }
};
</script>

<style scoped>
.project-form {
  margin: 20px 0;
}

.hide {
  display: none;
}

.sales-plan {
  margin-bottom: 18px;
  margin-bottom: 18px;
  width: 50%;
}
</style>
