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
          :class="exportContract.state === undefined ? 'hide' : ''"
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
        <div
          v-if="JSON.stringify(purchaseContract) !== '{}'"
          style="display: flex"
        >
          <el-upload
            action
            :show-file-list="false"
            :http-request="(e) => handleFileSuccess(e, 'manual')"
          >
            <el-button
              v-if="
                JSON.stringify(manualFile) === '{}'
              "
              type="text"
            >
              上传
            </el-button>
          </el-upload>
          <div v-if="manualFile !== undefined && manualFile.type === 12860">
            <el-button
              type="text"
              @click="showViewFile(manualFile.id, 'manual-file')"
            >
              预览
            </el-button>
          </div>
          <div
            v-if="purchaseContract.state !== 10"
            :class="purchaseContract.state === undefined ? 'hide' : ''"
          >
            <span
              v-if="manualFile !== undefined && manualFile.type === 12860"
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
              JSON.stringify(manualFile) !== '{}' &&
                purchaseContract.state === 10
            "
          >
            <span
              v-if="manualFile !== undefined && manualFile.type === 12860"
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
        <div
          v-if="JSON.stringify(purchaseContract) !== '{}'"
          style="display: flex"
        >
          <el-upload
            action
            :show-file-list="false"
            :http-request="(e) => handleFileSuccess(e, 'diecuts')"
          >
            <el-button
              v-if="JSON.stringify(diecutsFile) === '{}'"
              type="text"
            >
              上传
            </el-button>
          </el-upload>
          <div v-if="diecutsFile !== undefined && diecutsFile.type === 12860">
            <el-button
              type="text"
              @click="showViewFile(diecutsFile.id, 'diecuts-file')"
            >
              预览
            </el-button>
          </div>
          <div
            v-if="purchaseContract.state !== 10"
            :class="purchaseContract.state === undefined ? 'hide' : ''"
          >
            <span
              v-if="diecutsFile !== undefined && diecutsFile.type === 12860"
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
              JSON.stringify(diecutsFile) !== '{}' &&
                purchaseContract.state === 10
            "
          >
            <span
              v-if="diecutsFile !== undefined && diecutsFile.type === 12860"
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
          :class="purchaseContract.state === undefined ? 'hide' : ''"
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
  inject: ['getContract', 'changeColor', 'getProgress'],
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
      try {
        await this.$store.dispatch('product/order/confirmExportContract', {
          id
        });
        this.getContract();
      } catch (err) {
        return;
      }
    },
    async confirmPurchaseContract(id) {
      try {
        await this.$store.dispatch('product/order/confirmPurchaseContract', {
          id,
          product_manual_file: this.manualFile.id,
          diecuts_file: this.diecutsFile.id
        });
        this.getContract();
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    async handleFileSuccess(e, val) {
      if(e.file.size > 5 * 1024 * 1024 ) {
        this.$message.warning('附件大小超过限制，请重新上传！');
      } else if(e.file.type.indexOf('application') > -1 || e.file.type === 'text/csv') {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            let file = {
              id: this.$store.state.fileRes.id,
              name: this.$store.state.fileRes.file_name,
              type: this.$store.state.fileRes.type
            };
            this.show = true;
            if (val === 'manual') {
              this.manualFile = file;
            } else {
              this.diecutsFile = file;
            }
          }
        } catch (err) {
          return;
        }
      } else {
        this.$message.warning('上传的附件格式有误！');
       }
    },
    async showViewFile(id, str) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { 
          params: { id },
          url:  str === 'manual-file' ? 'product-manual' : 'diecuts'
        });
        if (this.$store.state.attachmentState) {
          previewFile(this.$store.state.viewLink);
        }
      } catch (err) {
        return;
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
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          downloadFile(this.$store.state.viewLink, name);
        }
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
