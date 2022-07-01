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
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
        >
          <el-button
            type="primary"
            :disabled="type !== 'create'"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式,文件不能超过5MB(仅限一个)
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="show"
          class="attachment-list"
        >
          <div>{{ attachment.name }}</div>
          <div style="display: flex">
            <div v-if="attachment.type === 12860">
              <el-button
                type="text"
                @click="showViewFile(attachment.id)"
              >
                预览
              </el-button>
              <span class="table-btn">|</span>
            </div>
            <el-button
              v-if="type === 'create'"
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
            <el-button
              v-else
              type="text"
              @click="download(attachment.id, attachment.name)"
            >
              下载
            </el-button>
          </div>
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
import { downloadFile, getFile, previewFile } from '../../../../utils';
export default {
  inject: ['getUser'],
  props: ['id', 'dialogVisible', 'type', 'title'],
  emits: ['hide-dialog'],
  data() {
    return {
      templateForm: {},
      visible: this.dialogVisible,
      show: true,
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
        this.attchement = this.templateForm.user_template_file;
        this.show = true;
      } catch (err) {
        return;
      }
    },
    async createTemplate(val) {
      let body = {
        user_test_apply_id: this.id,
        user_template_file: val
      };
      try {
        await this.$store.dispatch('sample/user/createTemplate', body);
        this.visible = false;
        this.getUser();
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
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
          this.show = true;
          this.attachment = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
        }
      } catch (err) {
        return;
      }
    },
    deleteFile() {
      this.attachment = {};
      this.templateForm.user_template_file = '';
      this.show = false;
    },
    submitTemplateForm() {
      this.templateForm.user_template_file = this.attachment.id;
      this.$refs.templateForm.validate((valid) => {
        if (valid) {
          this.createTemplate(this.templateForm);
        }
      });
    }
  }
};
</script>
