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
          v-if="progress.state !== 10"
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
      :rules="projectRules"
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
        >
          <el-option
            v-for="item in options"
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
          label="上传附件"
          prop="sale_plan"
          style="margin-bottom: 18px"
        >
          <el-upload
            action
            :show-file-list="false"
            :http-request="handleFileSuccess"
          >
            <el-button
              type="primary"
              :disabled="isDisabled"
            >
              点击上传
            </el-button>
          </el-upload>
          <div class="attachment">
            支持office文档格式,文件不能超过5MB(仅限一个)
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 18px; width: 50%">
          <div
            v-if="JSON.stringify(file) !== '{}'"
            class="attachment-list"
          >
            <div>
              {{ file.name }}
            </div>
            <div style="display: flex">
              <div v-if="file.type === 12860">
                <el-button
                  type="text"
                  @click="showViewFile(file.id)"
                >
                  预览
                </el-button>
                <span class="table-btn"> |</span>
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
                @click="download(file.id, file.name)"
              >
                下载
              </el-button>
            </div>
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
import { getFile, downloadFile, previewFile } from '../../../../utils';

export default {
  components: {
    ProfitCalculation,
    ProcessTable
  },
  inject: ['getProject', 'getProfitCalcaulation', 'getProcessTable'],
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
          value: -1,
          label: '请选择',
          disabled: true
        },
        {
          value: 1,
          label: '通过'
        },
        {
          value: 0,
          label: '不通过'
        }
      ],
      file: this.attachment,
      form: this.projectForm
    };
  },
  computed: {
    projectRules() {
      return this.projectForm.review_result === 1
        ? this.passRules
        : this.failRules;
    },
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
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
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
      this.form.sale_plan = '';
    },
    submitProjectForm() {
      this.form.sale_plan = this.file.id;
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          this.reviewProject(this.form);
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
      } catch (err) {
        return;
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
