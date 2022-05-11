<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="resultForm"
      :model="resultForm"
      label-width="100px"
      :rules="templateRules"
    >
      <el-form-item
        label="测试结果"
        prop="user_template_file"
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
            type="text"
            @click="deleteFile(attachment.id)"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitResultForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['id', 'dialogVisible', 'getList'],
  emits: ['hide-dialog'],
  data() {
    return {
      resultForm: {},
      visible: this.dialogVisible,
      show: false,
      attachment: {},
      templateRules: {
        user_template_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      }
    };
  },
  methods: {
    async uploadFile(val) {
      let body = {
        user_test_apply_id: this.id,
        user_template_file: val
      };
      await this.$store.dispatch('sample/user/uploadFile', body);
      this.visible = false;
      this.getList();
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.resultForm.user_template_file = this.attachment.id;
      this.show = true;
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.templateForm = {};
      this.show = false;
    },
    submitResultForm() {
      this.$refs.resultForm.validate((valid) => {
        if (valid) {
          this.uploadFile(this.attachment.id);
        }
      });
    }
  }
};
</script>
