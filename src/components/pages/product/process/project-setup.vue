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
        <div :class="changeCellColor(progress.review_state)">
          {{ progress.review_state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        label="操作"
        width="300px"
      >
        <div
          v-if="progress.state !== 10 && progress.review_state !==10"
          :class="progress.state === undefined ? 'hide' : ''"
        >
          <el-button
            :class="progress.state === 40 ? 'hide' : ''"
            class="close-btn"
            @click="approvalProject(0)"
          >
            不通过
          </el-button>
          <el-button
            type="primary"
            :disabled="progress.state === 40"
            @click="approvalProject(1)"
          >
            通过
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="projectForm"
      label-width="100px"
      class="project-form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="评审结果"
        style="width: 20%"
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
          :disabled="isDisabled"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <div v-if="form.review_result === 1">
        <profit-calculation :get-profit="profit" />
        <process-table
          :get-schedule="schedule"
          :change-color="changeColor"
        />

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
            @get-file="getUploadFile"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="submitProjectForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ProfitCalculation from '../common/profit-calculation.vue';
import ProcessTable from '../common/process-table.vue';

export default {
  components: {
    ProfitCalculation,
    ProcessTable
  },
  inject: ['getProject', 'getProfitCalcaulation', 'getProcessTable', 'getBase'],
  props: ['progress', 'attachment', 'projectForm', 'profit', 'schedule'],
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
    projectForm(val) {
      this.form = val;
    }
  },
  methods: {
    async reviewProject(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/project/reviewProject', body);
        this.getProject();
        this.getProfitCalcaulation();
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    submitProjectForm() {
      this.form.sales_plan = this.file.id;
      let form = JSON.parse(JSON.stringify(this.form));
      if(form.review_result === 1) {
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
    changeCellColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else if (val === 30) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    changeColor(val) {
      if (val === 10 || val === 20) {
        return 'result-ing';
      } else if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
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
        this.getProfitCalcaulation();
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    refresh(val) {
      if(val === 1) {
        this.getProfitCalcaulation();
        this.getProcessTable();
      }
    },
    getUploadFile(e) {
      this.file = e;
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
