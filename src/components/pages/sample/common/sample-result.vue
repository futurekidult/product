<template>
  <el-dialog
    v-model="visible"
    title="上传结果"
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
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
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
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
          </div>
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
import { getFile, previewFile } from '../../../../utils';
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
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      await this.$store.dispatch('uploadFile', form);
      if (this.$store.state.uploadState) {
        this.show = true;
        this.attachment = {
          id: this.$store.state.fileRes.id,
          name: this.$store.state.fileRes.file_name,
          type: this.$store.state.fileRes.type
        };
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        previewFile(this.$store.state.viewLink);
      }
    },
    deleteFile() {
      this.attachment = {};
      this.resultForm.user_template_file = '';
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
