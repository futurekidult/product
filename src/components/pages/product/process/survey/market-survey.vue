<template>
  <div class="survey-title">
    调研进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="负责人" />
    <el-table-column label="是否多市场" />
    <el-table-column label="调研市场" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    ref="marketForm"
    label-width="80px"
    style="width: 50%"
    :model="marketForm"
    :rules="marketRules"
  >
    <el-form-item
      label="上传附件"
      prop="attachment"
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
        支持office文档格式,文档不超过5MB
      </div>
    </el-form-item>
    <el-form-item>
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
    <el-form-item>
      <el-button
        type="primary"
        @click="submitMarketForm"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      marketForm: {},
      marketRules: {
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      fileList: []
    };
  },
  methods: {
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.marketForm.attachment = file.id;
    },
    submitMarketForm() {
      this.$refs.marketForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    previewFile(id) {
      console.log(id);
    },
    deleteFile(id) {
      console.log(id);
    }
  }
};
</script>
