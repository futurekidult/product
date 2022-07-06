<template>
  <div v-loading="$store.state.product.survey.market.marketLoading">
    <div class="survey-title">
      调研进度表
    </div>

    <el-descriptions
      border
      :column="6"
      direction="vertical"
    >
      <el-descriptions-item label="负责人">
        {{ progress.principal_desc }}
      </el-descriptions-item>
      <el-descriptions-item label="是否多平台">
        {{ progress.is_multi_market }}
      </el-descriptions-item>
      <el-descriptions-item label="调研市场">
        {{ progress.market_name }}
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ progress.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <div class="survey-title">
      调研报告内容
    </div>

    <el-form
      ref="marketForm"
      label-width="80px"
      style="width: 50%"
      :model="marketForm"
      :rules="marketRules"
    >
      <el-form-item
        label="上传附件"
        prop="attachment"
      >
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
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
          <div>
            {{ file.name }}
          </div>
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
            <div style="display: flex">
              <el-button
                v-if="!isDisabled"
                type="text"
                @click="deleteFile"
              >
                删除
              </el-button>
              <el-button
                v-else
                type="text"
                @click="download(file.id, file.name)"
              >
                下载
              </el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="submitMarketForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../../utils';

export default {
  inject: ['getBase'],
  props: ['changeColor', 'progress', 'attachment', 'getList'],
  data() {
    return {
      marketForm: {},
      marketRules: {
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      file: this.attachment
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  methods: {
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
          this.marketForm.attachment = this.file.id;
        }
      } catch (err) {
        return;
      }
    },
    async submitRequest() {
      let params = {
        product_id: +this.$route.params.productId,
        attachment_id: this.marketForm.attachment,
        survey_schedule_id: this.progress.id
      };
      try {
        await this.$store.dispatch(
          'product/survey/market/submitMarketFile',
          params
        );
        this.getList();
        this.getBase();
      } catch (err) {
        return;
      }
    },
    submitMarketForm() {
      this.marketForm.attachment = this.file.id;
      this.$refs.marketForm.validate((valid) => {
        if (valid) {
          this.submitRequest();
        }
      });
    },
    deleteFile() {
      this.file = {};
      this.marketForm.attachment = '';
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
    }
  }
};
</script>
