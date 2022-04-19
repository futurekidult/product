<template>
  <div class="select-title">
    <span class="line">|</span> 项目立项
  </div>

  <div class="project-title">
    立项进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="项目管理员" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="评审状态" />
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <template #default="scope">
        <div v-if="scope.row.status === '审批中'">
          <el-button>不通过</el-button>
          <el-button type="primary">
            通过
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

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
      prop="result"
    >
      <el-select
        v-model="projectForm.result"
        placeholder="请选择评审结果"
      >
        <el-option
          value="1"
          label="通过"
        />
        <el-option
          value="0"
          label="不通过"
        />
      </el-select>
    </el-form-item>
    <el-divider />
    <el-form-item
      v-if="flag === 'fail'"
      label="不通过原因"
      style="width: 50%"
      prop="failReason"
    >
      <el-input
        v-model="projectForm.failReason"
        type="textarea"
        placeholder="请输入不通过原因"
      />
    </el-form-item>
    <div v-if="flag === 'pass'">
      <profit-calculation />
      <process-table />

      <div class="profit-plan_title">
        销售计划表
      </div>

      <el-form-item
        label="上传附件"
        prop="attachment"
        style="margin-bottom: 18px"
      >
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleFileSuccess"
          :limit="1"
        >
          <el-button type="primary">
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px">
        <div
          v-for="file in fileList"
          :key="file.id"
          class="attachment-list"
        >
          <div @click="previewFile(file.id)">
            {{ file.name }}
          </div>
          <el-button
            type="text"
            @click="deleteFile(file.id)"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
    </div>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitProjectForm"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ProfitCalculation from '../common/profit-calculation.vue';
import ProcessTable from '../common/process-table.vue';

export default {
  components: {
    ProfitCalculation,
    ProcessTable
  },
  data() {
    return {
      projectForm: {},
      flag: '',
      fileList: [],
      passRules: {
        result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      failRules: {
        result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        failReason: [
          {
            required: true,
            message: '请输入不通过原因'
          }
        ]
      }
    };
  },
  computed: {
    getResult() {
      return this.projectForm.result;
    },
    projectRules() {
      if (this.projectForm.result === '1') {
        return this.passRules;
      } else {
        return this.failRules;
      }
    }
  },
  watch: {
    getResult(val) {
      if (val === '1') {
        this.flag = 'pass';
      } else {
        this.flag = 'fail';
      }
    }
  },
  methods: {
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.projectForm.attachment = file.id;
    },
    previewFile(id) {
      console.log(id);
    },
    deleteFile(id) {
      console.log(id);
    },
    submitProjectForm() {
      this.$refs.projectForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    closeProjectForm() {
      this.addVisible = false;
    }
  }
};
</script>

<style scoped>
.project-form {
  margin: 20px 0;
}
</style>
