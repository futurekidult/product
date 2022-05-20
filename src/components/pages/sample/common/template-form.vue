<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="templateForm"
      :model="templateForm"
      label-width="100px"
      :rules="templateRules"
    >
      <el-form-item
        label="测试模板"
        prop="user_template_file"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="handleFileSuccess"
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="type !== 'create'"
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
            v-if="type === 'create'"
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
      <el-divider />
      <div
        v-if="type === 'create'"
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
          @click="submitTemplateForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getUser'],
  props: ['id', 'dialogVisible', 'type', 'title'],
  emits: ['hide-dialog'],
  data() {
    return {
      templateForm: {},
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
  mounted() {
    if (this.type === 'view') {
      this.getTemplate();
    }
  },
  methods: {
    async getTemplate() {
      await this.$store.dispatch('sample/user/getTemplate', {
        params: {
          user_test_apply_id: this.id
        }
      });
      this.templateForm = this.$store.state.sample.user.templateFile;
      this.attchement = this.templateForm.user_template_file;
      this.show = true;
    },
    async createTemplate(val) {
      let body = {
        user_test_apply_id: this.id,
        user_template_file: val
      };
      await this.$store.dispatch('sample/user/createTemplate', body);
      this.visible = false;
      this.getUser();
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
      this.templateForm.user_template_file = this.attachment.id;
      this.show = true;
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.templateForm = {};
      this.show = false;
    },
    submitTemplateForm() {
      this.$refs.templateForm.validate((valid) => {
        if (valid) {
          this.createTemplate(this.templateForm);
        }
      });
    }
  }
};
</script>
