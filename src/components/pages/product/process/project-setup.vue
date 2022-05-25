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
        <div v-if="progress.state !== 10">
          <el-button
            :class="progress.state === 40 ? 'hide' : ''"
            class="close-btn"
          >
            不通过
          </el-button>
          <el-button
            type="primary"
            :disabled="isDisabled"
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
      :model="projectForm"
      :rules="projectRules"
    >
      <el-form-item
        label="评审结果"
        style="width: 20%"
        prop="review_result"
      >
        <el-select
          v-model="projectForm.review_result"
          placeholder="请选择评审结果"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-divider />
      <el-form-item
        v-if="projectForm.review_result === 0"
        label="不通过原因"
        style="width: 50%"
        prop="unapproved_reason"
      >
        <el-input
          v-model="projectForm.unapproved_reason"
          type="textarea"
          placeholder="请输入不通过原因"
          clearable
        />
      </el-form-item>
      <div v-if="projectForm.review_result === 1">
        <profit-calculation :get-profit="profit" />
        <process-table
          :get-schedule="schedule"
          :change-color="changeCellColor"
        />

        <div class="profit-plan_title">
          销售计划表
        </div>

        <el-form-item
          label="上传附件"
          prop="sale_plan"
          style="margin-bottom: 18px"
        >
          <el-upload
            action=""
            :show-file-list="false"
            :on-success="handleFileSuccess"
            :limit="1"
          >
            <el-button
              type="primary"
              :disabled="isDisabled"
            >
              点击上传
            </el-button>
          </el-upload>
          <div class="attachment">
            支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 18px; width: 50%">
          <div
            v-if="show"
            class="attachment-list"
          >
            <div @click="previewFile(attachment.id)">
              {{ attachment.name }}
            </div>
            <el-button
              v-if="!isDisabled"
              type="text"
              @click="deleteFile(attachment.id)"
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
  inject: ['getProject'],
  props: ['progress', 'attachment', 'projectForm', 'profit', 'schedule'],
  data() {
    return {
      passRules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        sale_plan: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      failRules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        unapproved_reason: [
          {
            required: true,
            message: '请输入不通过原因'
          }
        ]
      },
      options: [
        {
          value: 1,
          label: '通过'
        },
        {
          value: 0,
          label: '不通过'
        }
      ],
      show: true
    };
  },
  computed: {
    projectRules() {
      if (this.projectForm.review_result === 1) {
        return this.passRules;
      } else {
        return this.failRules;
      }
    },
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  methods: {
    async reviewProject(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      await this.$store.dispatch('product/project/reviewProject', body);
      this.getProject();
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.projectForm.sale_plan = file.id;
      this.show = true;
    },
    previewFile(id) {
      console.log(id);
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    submitProjectForm() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          this.projectForm.sale_plan = this.attachment.id;
          this.reviewProject(this.projectForm);
        }
      });
    },
    closeProjectForm() {
      this.addVisible = false;
    },
    changeCellColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else if (val === 20) {
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
</style>
