<template>
  <div>
    <div
      v-loading="
        type === 'contract'
          ? $store.state.product.patent.contractLoading
          : $store.state.product.patent.reportLoading
      "
    >
      <el-descriptions
        border
        :column="5"
        direction="vertical"
      >
        <el-descriptions-item label="任务负责人">
          {{ data.principal }}
        </el-descriptions-item>
        <el-descriptions-item label="实际完成时间">
          {{ data.actual_finish_time }}
        </el-descriptions-item>
        <el-descriptions-item label="结果附件">
          <div v-if="JSON.stringify(data) !== '{}'">
            <el-button
              v-if="
                data.state === 10 && JSON.stringify(file) === '{}'
              "
              type="text"
              @click="showFileDialog"
            >
              上传
            </el-button>
            <div
              v-if="data.state === 40"
              style="display: flex"
            >
              <el-button
                type="text"
                @click="download(file.id, file.name)"
              >
                下载
              </el-button>
              <div v-if="data.result_file.type === 12860">
                <span class="table-btn">|</span>
                <el-button
                  type="text"
                  @click="showViewFile(file.id)"
                >
                  预览
                </el-button>
              </div>
            </div>
            <div
              v-if="
                data.state === 10 && JSON.stringify(file) !== '{}'
              "
              style="display: flex"
            >
              <div v-if="data.result_file.type === 12860">
                <el-button
                  type="text"
                  @click="showViewFile(file.id)"
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
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <div :class="changeColor(data.state)">
            {{ data.state_desc }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="操作">
          <el-button
            v-if="JSON.stringify(data) !== '{}'"
            :disabled="data.state !== 10"
            :class="data.state === undefined ? 'hide' : ''"
            @click="uploadAttachment"
          >
            完成
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    
    <el-dialog
      v-model="uploadVisible"
      title="上传"
      width="30%"
    >
      <el-form
        ref="uploadForm"
        :model="uploadForm"
        label-width="100px"
      >
        <el-form-item
          label="文件"
          prop="file"
          :rules="[{ required: true, message: '请上传附件'}]"
        >
          <el-upload
            action
            :show-file-list="false"
            :http-request="handleFileSuccess"
          >
            <el-button
              type="primary"
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
            v-if="JSON.stringify(file) !== '{}'"
            class="attachment-list"
          >
            <div>{{ file.name }}</div>
            <div style="display: flex">
              <div v-if="file.type === 12860">
                <el-button
                  type="text"
                  @click="showViewFile(file.id)"
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
        <div
          style="text-align: right"
        >
          <el-button
            class="close-btn"
            @click="closeFileDialog"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="closeFileDialog"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../utils';
export default {
  inject: ['getContract'],
  props: ['data', 'type', 'getReport'],
  data() {
    return {
      progress: this.data,
      file: {},
      uploadVisible: false,
      uploadForm: {}
    };
  },
  watch: {
    data(val) {
      this.file = val.result_file;
    }
  },
  methods: {
    async upload(val, url) {
      let type = val;
      let params = {
        product_id: +this.$route.params.productId,
        [type]: this.file.id
      };
      try {
        await this.$store.dispatch(`product/patent/upload${url}`, params);
        this.uploadVisible = false;
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
    uploadAttachment() {
      if (this.type === 'contract') {
        this.upload('contract', 'Contract');
        this.getContract();
      } else {
        this.upload('report', 'Report');
        this.getReport();
      }
    },
    changeColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    deleteFile() {
      this.file = {};
      if (this.type === 'contract') {
        this.getContract();
      } else {
        this.getReport();
      }
    },
    showFileDialog() {
      this.uploadVisible = true;
    },
    closeFileDialog() {
      this.uploadVisible = false;
      this.uploadForm.file = this.file.id;
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
