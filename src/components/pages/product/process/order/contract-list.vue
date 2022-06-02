<template>
  <div v-loading="$store.state.product.order.contractLoading">
    <div class="order-title">
      合同确认进度表
    </div>

    <el-descriptions
      border
      :column="4"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ exportContract.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="【香港→宁波】的合同确认">
        <div :class="changeColor(exportContract.state)">
          {{ exportContract.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ exportContract.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          type="primary"
          :disabled="exportContract.state !== 10"
          @click="confirmExportContract(exportContract.id)"
        >
          已完成
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      border
      :column="6"
      direction="vertical"
      style="margin-top: 20px"
    >
      <el-descriptions-item label="任务负责人">
        {{ purchaseContract.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="【宁波→工厂】的合同确认">
        <div :class="changeColor(purchaseContract.state)">
          {{ purchaseContract.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ purchaseContract.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="产品说明书">
        <div style="display: flex">
          <el-upload
            action
            :show-file-list="false"
            :http-request="(e) => handleFileSuccess(e, 'manual')"
            :limit="1"
          >
            <el-button
              v-if="
                JSON.stringify(purchaseContract.product_manual_file) === '{}'
              "
              type="text"
            >
              上传
            </el-button>
          </el-upload>
          <div v-if="manualFile.type === 12860">
            <el-button
              type="text"
              @click="showViewFile(manualFile.id)"
            >
              预览
            </el-button>
          </div>
          <div v-if="purchaseContract.state !== 10">
            <span
              v-if="manualFile.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              type="text"
              @click="download(manualFile.id, manualFile.name)"
            >
              下载
            </el-button>
          </div>
          <div
            v-if="
              JSON.stringify(purchaseContract.product_manual_file) !== '{}' &&
                purchaseContract.state === 10
            "
          >
            <span
              v-if="manualFile.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              type="text"
              @click="deleteFile('manual')"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="刀模附件">
        <div style="display: flex">
          <el-upload
            action
            :show-file-list="false"
            :http-request="(e) => handleFileSuccess(e, 'diecuts')"
            :limit="1"
          >
            <el-button
              v-if="JSON.stringify(purchaseContract.diecuts_file) === '{}'"
              type="text"
            >
              上传
            </el-button>
          </el-upload>
          <div v-if="diecutsFile.type === 12860">
            <el-button
              type="text"
              @click="showViewFile(diecutsFile.id)"
            >
              预览
            </el-button>
          </div>
          <div v-if="purchaseContract.state !== 10">
            <span
              v-if="diecutsFile.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              type="text"
              @click="download(diecutsFile.id, diecutsFile.name)"
            >
              下载
            </el-button>
          </div>
          <div
            v-if="
              JSON.stringify(purchaseContract.diecuts_file) !== '{}' &&
                purchaseContract.state === 10
            "
          >
            <span
              v-if="diecutsFile.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              type="text"
              @click="deleteFile('diecuts')"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          type="primary"
          :disabled="purchaseContract.state !== 10"
          @click="confirmPurchaseContract(purchaseContract.id)"
        >
          提交
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../../utils';
export default {
  inject: ['getContract', 'changeColor'],
  props: [
    'contract',
    'exportContract',
    'purchaseContract',
    'manual',
    'diecuts'
  ],
  data() {
    return {
      manualFile: this.manual,
      diecutsFile: this.diecuts
    };
  },
  watch: {
    manual(val) {
      this.manualFile = val;
    },
    diecuts(val) {
      this.diecutsFile = val;
    }
  },
  methods: {
    async confirmExportContract(id) {
      await this.$store.dispatch('product/order/confirmExportContract', {
        id
      });
      this.getContract();
    },
    async confirmPurchaseContract(id) {
      await this.$store.dispatch('product/order/confirmPurchaseContract', {
        id,
        product_manual_file: this.manualFile.id,
        diecuts_file: this.diecutsFile.id
      });
      this.getContract();
    },
    async handleFileSuccess(e, val) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      await this.$store.dispatch('uploadFile', form);
      if (this.$store.state.uploadState) {
        this.show = true;
        if (val === 'manual') {
          this.manualFile = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
        } else {
          this.diecutsFile = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
        }
      }
      this.getContract();
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        previewFile(this.$store.state.viewLink);
      }
    },
    deleteFile(val) {
      if (val === 'manual') {
        this.manualFile = {};
      } else {
        this.diecutsFile = {};
      }
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        downloadFile(this.$store.state.viewLink, name);
      }
    }
  }
};
</script>
