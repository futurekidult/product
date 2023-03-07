<template>
  <el-dialog
    v-model="visible"
    title="上传"
    width="35%"
    :close-on-click-modal="false"
    @close="closeUploadFileDialog"
  >
    <el-form
      ref="uploadForm"
      :model="uploadForm"
      label-width="100px"
    >
      <el-form-item
        :label="label"
        prop="file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <div style="display: flex">
          <el-upload
            action
            :show-file-list="false"
            :http-request="handleFileSuccess"
          >
            <el-button type="primary">
              点击上传
            </el-button>
          </el-upload>
          <div class="attachment">
            可上传office格式文件(不超过5M)，pdf文件和压缩包文件(不超过15M)
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="JSON.stringify(uploadFile) !== '{}'"
          class="attachment-list"
        >
          <div>{{ uploadFile.name }}</div>
          <div style="display: flex">
            <text-btn @handle-click="deleteFile">
              删除
            </text-btn>
            <span
              v-if="uploadFile.type === 12860"
              class="table-btn"
            >|</span>
            <text-btn
              v-if="uploadFile.type === 12860"
              @handle-click="
                previewOrDownload(uploadFile.id, uploadFile.name, 'preview')
              "
            >
              预览
            </text-btn>
          </div>
        </div>
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeUploadFileDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitUploadFileDialog"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { previewOrDownloadFile, getFile } from '../../utils';
export default {
  props: ['uploadVisible', 'label', 'file'],
  emits: ['get-upload-file', 'get-upload-file-visible'],
  data() {
    return {
      visible: this.uploadVisible,
      uploadFile: this.file,
      uploadForm: {}
    };
  },

  methods: {
    async handleFileSuccess(e) {
      const warningMessage = '附件大小超过限制，请重新上传！';
      if (e.file.size > 15 * 1024 * 1024) {
        this.$message.warning(warningMessage);
      } else if (
        e.file.type.indexOf('office') > -1 &&
        e.file.size > 5 * 1024 * 1024
      ) {
        this.$message.warning(warningMessage);
      } else if (
        e.file.type.indexOf('image') > -1 &&
        e.file.size > 2 * 1024 * 1024
      ) {
        this.$message.warning(warningMessage);
      } else if (
        e.file.type.indexOf('application') > -1 ||
        e.file.type === 'text/csv'
      ) {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            this.uploadFile = {
              id: this.$store.state.fileRes.id,
              name: this.$store.state.fileRes.file_name,
              type: this.$store.state.fileRes.type
            };
          }
        } catch (err) {
          return;
        }
      } else {
        this.$message.warning('上传的附件格式有误！');
      }
    },
    async previewOrDownload(id, name, type) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', {
          params: { id },
          url: this.type === 'contract' ? 'patent-contract' : 'patent-report'
        });
        if (this.$store.state.attachmentState) {
          if (type === 'download') {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'download');
          } else {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'preview');
          }
        }
      } catch (err) {
        return;
      }
    },
    closeUploadFileDialog() {
      this.visible = false;
      this.$emit('get-upload-file-visible', false);
    },
    deleteFile() {
      this.uploadFile = {};
    },
    submitUploadFileDialog() {
      this.uploadForm.file = this.uploadFile.id;
      this.$emit('get-upload-file', this.uploadFile);
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          this.$emit('get-upload-file-visible', false);
        }
      });
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0px !important;
}
</style>
