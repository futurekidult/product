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
      <el-descriptions-item
        v-if="exportContract.state !== 40 && exportContract.state !== undefined"
        label="操作"
      >
        <text-btn @handle-click="confirmExportContract(exportContract.id)">
          确认合同
        </text-btn>
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
          <text-btn
            v-if="JSON.stringify(manualFile) === '{}'"
            @handle-click="showUploadDialog(manualFile, 'manual')"
          >
            上传附件
          </text-btn>
          <div
            v-if="purchaseContract.state !== 10"
            :class="purchaseContract.state === undefined ? 'hide' : ''"
          >
            <div v-if="manualFile !== undefined && manualFile.type === 12860">
              <text-btn
                @handle-click="
                  previewOrDownload(
                    manualFile.id,
                    manualFile.name,
                    'manual-file',
                    'preview'
                  )
                "
              >
                预览
              </text-btn>
            </div>
            <span
              v-if="manualFile !== undefined && manualFile.type === 12860"
              class="table-btn"
            >|</span>
            <text-btn
              @handle-click="
                previewOrDownload(
                  manualFile.id,
                  manualFile.name,
                  'manual-file',
                  'download'
                )
              "
            >
              下载
            </text-btn>
          </div>
          <div
            v-if="
              JSON.stringify(manualFile) !== '{}' &&
                purchaseContract.state === 10
            "
          >
            <text-btn @handle-click="showUploadDialog(manualFile, 'manual')">
              编辑附件
            </text-btn>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="刀模附件">
        <div
          v-if="JSON.stringify(purchaseContract) !== '{}'"
          style="display: flex"
        >
          <text-btn
            v-if="JSON.stringify(diecutsFile) === '{}'"
            @handle-click="showUploadDialog(diecutsFile, 'diecuts')"
          >
            上传附件
          </text-btn>
          <div
            v-if="purchaseContract.state !== 10"
            :class="purchaseContract.state === undefined ? 'hide' : ''"
          >
            <div v-if="diecutsFile !== undefined && diecutsFile.type === 12860">
              <text-btn
                @handle-click="
                  previewOrDownload(
                    diecutsFile.id,
                    diecutsFile.name,
                    'diecuts-file',
                    'preview'
                  )
                "
              >
                预览
              </text-btn>
            </div>
            <span
              v-if="diecutsFile !== undefined && diecutsFile.type === 12860"
              class="table-btn"
            >|</span>
            <text-btn
              @handle-click="
                previewOrDownload(
                  diecutsFile.id,
                  diecutsFile.name,
                  'diecuts-file',
                  'download'
                )
              "
            >
              下载
            </text-btn>
          </div>
          <div
            v-if="
              JSON.stringify(diecutsFile) !== '{}' &&
                purchaseContract.state === 10
            "
          >
            <text-btn @handle-click="showUploadDialog(diecutsFile, 'diecuts')">
              编辑附件
            </text-btn>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="
          purchaseContract.state !== 40 && purchaseContract.state !== undefined
        "
        label="操作"
      >
        <text-btn @handle-click="confirmPurchaseContract(purchaseContract.id)">
          提交
        </text-btn>
      </el-descriptions-item>
    </el-descriptions>
    <file-upload-dialog
      v-if="uploadVisible"
      :upload-visible="uploadVisible"
      :label="type === 'manual' ? '产品说明书' : '刀模附件  '"
      :file="type === 'manual' ? manualFile : diecutsFile"
      @get-upload-file="getContractFile"
      @get-upload-file-visible="getUploadVisible"
    />
  </div>
</template>

<script>
import { previewOrDownloadFile } from '../../../../../utils';
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
      diecutsFile: this.diecuts,
      type: 'manual',
      uploadVisible: false
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
    async upload(val, url, file) {
      let type = val;
      let params = {
        id: +this.purchaseContract.id,
        [`${type}_file`]: this[`${file}`].id
      };
      try {
        await this.$store.dispatch(`product/order/upload${url}`, params);
        this.uploadVisible = false;
        this.getContract();
        this.getProgress();
      } catch (err) {
        return;
      }
    },
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
          id
        });
        this.getContract();
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    uploadAttachment() {
      if (this.type === 'manual') {
        this.upload('product_manual', 'Manual', 'manualFile');
      } else {
        this.upload('diecuts', 'Diecuts', 'diecutsFile');
      }
    },
    async previewOrDownload(id, name, str, type) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', {
          params: { id },
          url: str === 'manual-file' ? 'product-manual' : 'diecuts'
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
    showUploadDialog(file, type) {
      this.uploadVisible = true;
      if (type === 'manual') {
        this.manualFile = file;
      } else {
        this.discutsFile = file;
      }
      this.type = type;
    },
    getContractFile(val) {
      if (this.type === 'manual') {
        this.manualFile = val;
      } else {
        this.diecutsFile = val;
      }
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
