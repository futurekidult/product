<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="35%"
    :close-on-click-modal="false"
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
        <base-upload
          type="file"
          tag="测试模板"
          url="user-template"
          :file="attachment"
          :is-disabled="type !== 'create'"
          @get-file="getUploadFile"
        />
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
      try {
        await this.$store.dispatch('sample/user/getTemplate', {
          params: {
            user_test_apply_id: this.id
          }
        });
        this.templateForm = this.$store.state.sample.user.templateFile;
        this.attachment = this.templateForm.user_template_file;
      } catch (err) {
        return;
      }
    },
    async createTemplate(val) {
      let body = {
        user_test_apply_id: this.id,
        user_template_file: val.user_template_file
      };
      try {
        await this.$store.dispatch('sample/user/createTemplate', body);
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
    submitTemplateForm() {
      this.templateForm.user_template_file = this.attachment.id;
      this.$refs.templateForm.validate((valid) => {
        if (valid) {
          this.createTemplate(this.templateForm);
        }
      });
    },
    getUploadFile(e) {
      this.attachment = e;
    }
  }
};
</script>
