<template>
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
              data.state === 10 && JSON.stringify(data.result_file) === '{}'
            "
            type="text"
            @click="handleFileSuccess"
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
              data.state === 10 && JSON.stringify(data.result_file) !== '{}'
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
          @click="uploadAttachment"
        >
          完成
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../utils';
export default {
  inject: ['getContract'],
  props: ['data', 'type', 'getReport'],
  data() {
    return {
      file: this.data
    };
  },
  watch: {
    data(val) {
      this.file = val;
    }
  },
  methods: {
    async upload(val, url) {
      let type = val;
      let params = {
        product_id: +this.$route.params.productId,
        [type]: this.file.id
      };
      await this.$store.dispatch(`product/patent/upload${url}`, params);
    },
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      await this.$store.dispatch('uploadFile', form);
      if (this.$store.state.uploadState) {
        this.show = true;
        this.file = {
          id: this.$store.state.fileRes.id,
          name: this.$store.state.fileRes.file_name,
          type: this.$store.state.fileRes.type
        };
        if (this.type === 'contract') {
          this.getContract();
        } else {
          this.getReport();
        }
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        previewFile(this.$store.state.viewLink);
      }
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        downloadFile(this.$store.state.viewLink, name);
      }
    },
    uploadAttachment() {
      if (this.type === 'contract') {
        this.upload('comtract', 'Contract');
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
    }
  }
};
</script>
