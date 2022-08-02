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
        >
          <el-button type="primary">
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式,文件不能超过5MB(仅限一个)
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="JSON.stringify(attachment) !== '{}'"
          class="attachment-list"
        >
          <div>{{ attachment.name }}</div>
          <div style="display: flex">
            <el-button
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
            <span 
              v-if="attachment.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              v-if="attachment.type === 12860"
              type="text"
              @click="showViewFile(attachment.id)"
            >
              预览
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
  props: ['id', 'dialogVisible', 'getList','userId'],
  emits: ['hide-dialog'],
  data() {
    return {
      resultForm: {},
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
  methods: {
    async uploadFile(val) {
      let body = {
        user_test_apply_id: this.id,
        test_result_file: val,
        user_id: this.userId
      };
      try {
        await this.$store.dispatch('sample/user/uploadFile', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async handleFileSuccess(e) {
      if(e.file.type.indexOf('application') > -1 || e.file.type === 'text/csv') {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            this.attachment = {
              id: this.$store.state.fileRes.id,
              name: this.$store.state.fileRes.file_name,
              type: this.$store.state.fileRes.type
            };
          }
        } catch (err) {
          return;
        }
      } else if(e.file.size > 5 * 1024 * 1024 ) {
        this.$message.warning('附件大小超过限制，请重新上传！');
      } else {
        this.$message.warning('上传的附件格式有误！');
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
      this.attachment = {};
      this.resultForm.user_template_file = '';
    },
    submitResultForm() {
      this.resultForm.user_template_file = this.attachment.id;
      this.$refs.resultForm.validate((valid) => {
        if (valid) {
          this.uploadFile(this.attachment.id);
        }
      });
    }
  }
};
</script>
