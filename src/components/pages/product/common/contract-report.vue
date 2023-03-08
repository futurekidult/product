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
            <text-btn
              v-if="data.state === 10 && JSON.stringify(file) === '{}'"
              @handle-click="showUploadDialog(file)"
            >
              上传附件
            </text-btn>
            <div
              v-if="data.state === 40"
              style="display: flex"
            >
              <text-btn
                @handle-click="
                  previewOrDownload(file.id, file.name, 'download')
                "
              >
                下载
              </text-btn>
              <div v-if="data.result_file.type === 12860">
                <span class="table-btn">|</span>
                <text-btn
                  @handle-click="
                    previewOrDownload(file.id, file.name, 'preview')
                  "
                >
                  预览
                </text-btn>
              </div>
            </div>
            <div
              v-if="data.state === 10 && JSON.stringify(file) !== '{}'"
              style="display: flex"
            >
              <text-btn @handle-click="showUploadDialog(file)">
                编辑附件
              </text-btn>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <div :class="changeColor(data.state)">
            {{ data.state_desc }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item
          v-if="data.state !== 40 && data.state !== undefined"
          label="操作"
        >
          <text-btn @handle-click="confirm">
            完成
          </text-btn>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <file-upload-dialog
      v-if="uploadVisible"
      :upload-visible="uploadVisible"
      :label="type === 'contract' ? '合同附件' : '专利报告'"
      :file="confirmFile"
      :type="type"
      :url="'contract' ? 'patent-contract' : 'patent-report'"
      @get-upload-file="getConfirmFile"
      @get-upload-file-visible="getUploadVisible"
    />
  </div>
</template>

<script>
import { previewOrDownloadFile } from '../../../../utils';
import FileUploadDialog from '../../../common/file-upload-dialog.vue';

export default {
  components: { FileUploadDialog },
  inject: ['getContract'],
  props: ['data', 'type', 'getReport', 'changeColor'],
  emits: ['get-contract-confirm-file', 'get-upload-file'],
  data() {
    return {
      progress: this.data,
      file: {},
      uploadVisible: false,
      operationType: 'upload',
      confirmFile: {}
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
        if (type === 'contract') {
          this.getContract();
        } else {
          this.getReport();
        }
      } catch (err) {
        return;
      }
    },
    async confirm() {
      let params = {
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch(
          `product/patent/confirm${this.type.replace(
            this.type[0],
            this.type[0].toUpperCase()
          )}`,
          params
        );
        if (this.type === 'contract') {
          this.getContract();
        } else {
          this.getReport();
        }
      } catch (err) {
        return;
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
    uploadAttachment() {
      if (this.type === 'contract') {
        this.upload('contract', 'Contract');
      } else {
        this.upload('report', 'Report');
      }
    },
    showUploadDialog(file) {
      this.uploadVisible = true;
      this.confirmFile = file;
    },
    getConfirmFile(val) {
      this.file = val;
      this.uploadAttachment();
    },
    getUploadVisible(val) {
      this.uploadVisible = val;
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
