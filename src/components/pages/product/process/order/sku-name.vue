<template>
  <div v-loading="$store.state.product.order.skuLoading">
    <div class="order-title">
      SKU命名进度表
    </div>

    <el-descriptions
      border
      :column="3"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ schedule.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="完成时间">
        {{ schedule.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(schedule.state)">
          {{ schedule.state_desc }}
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="skuForm"
      label-width="110px"
      style="width: 50%; margin: 20px 0"
      :model="form"
      :rules="skuRules"
    >
      <div
        v-for="(item, index) in form.sku"
        :key="index"
        style="display: flex"
      >
        <el-form-item
          :label="'平台' + (index + 1)"
          :prop="`sku.${index}.platform`"
          :rules="skuRules.platform"
        >
          <el-select
            v-model="item.platform"
            placeholder="请选择平台"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="content in platform"
              :key="content.platform"
              :label="content.platform_desc"
              :value="content.platform"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'SKU命名' + (index + 1)"
          :prop="`sku.${index}.name`"
          :rules="skuRules.name"
        >
          <el-input
            v-model="item.name"
            placeholder="请输入SKU名"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          :disabled="isDisabled"
          @click="addSku"
        >
          + 新增SKU
        </el-button>
        <el-button
          v-if="deleteVisible"
          type="danger"
          :disabled="isDisabled"
          @click="deleteSku"
        >
          + 删除SKU
        </el-button>
      </el-form-item>
      <el-form-item
        label="上传附件"
        prop="project_plan_file"
      >
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
          :limit="1"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item
        v-if="show"
        prop="project_plan_file"
      >
        <div class="attachment-list">
          <div>
            {{ handleAttachment(attachment.name) }}
          </div>
          <div style="display: flex">
            <div v-if="handleAttachment(file.type) === 12860">
              <el-button
                type="text"
                @click="showViewFile(file.id)"
              >
                预览
              </el-button>
              <span class="table-btn">|</span>
            </div>
            <el-button
              v-if="isDisabled"
              type="text"
              @click="download(file.id, file.name)"
            >
              下载
            </el-button>
            <el-button
              v-else
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="submitSkuForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>

    <div class="order-title">
      SKU录入进度表
    </div>

    <el-descriptions
      border
      :column="4"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ skuEntrySchedule.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ skuEntrySchedule.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(skuEntrySchedule.state)">
          {{ skuEntrySchedule.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          :disabled="skuEntrySchedule.state !== 10"
          @click="completeEntry"
        >
          已完成SKU录入甲骨文
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../../utils';
export default {
  inject: ['getSku', 'changeColor'],
  props: ['skuForm', 'attachment', 'skuEntrySchedule', 'schedule', 'skuId'],
  data() {
    return {
      skuRules: {
        platform: [
          {
            required: true,
            message: '请选择平台'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入SKU命名'
          }
        ],
        project_plan_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      show: true,
      platform: [],
      file: this.attachment,
      form: this.skuForm,
      deleteVisible: false
    };
  },
  computed: {
    isDisabled() {
      return this.schedule.state === 40 ? true : false;
    }
  },
  watch: {
    attachment(val) {
      this.file = val;
    },
    skuForm(val) {
      this.form = val;
    }
  },
  mounted() {
    this.getPlatform();
  },
  methods: {
    async getPlatform() {
      let params = {
        product_id: +this.$route.params.productId,
        pricing_id: +this.$route.params.orderId
      };
      try {
        await this.$store.dispatch('getPlatform', { params });
        this.platform = this.$store.state.platform;
      } catch (err) {
        return;
      }
    },
    async updateSkuname(val) {
      let body = {};
      body['sku_info'] = {};
      body['sku_info']['sku'] = val.sku;
      body['order_id'] = +this.$route.params.orderId;
      body['sku_info']['project_plan_file'] = this.attachment.id;
      try {
        await this.$store.dispatch('product/order/submitSkuname', body);
        this.getSku();
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
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
          this.show = true;
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
    deleteFile() {
      this.file = {};
      this.form.project_plan_file = '';
      this.show = false;
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    submitSkuForm() {
      this.form.project_plan_file = this.file.id;
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          this.updateSkuname(this.form);
        }
      });
    },
    async completeEntry() {
      try {
        await this.$store.dispatch('product/order/completeSkuEntry', {
          id: this.skuId
        });
        this.getSku();
      } catch (err) {
        return;
      }
    },
    addSku() {
      this.form.sku.push({});
      if (this.form.sku.length > 1) {
        this.deleteVisible = true;
      }
    },
    deleteSku() {
      this.form.sku.pop();
      if (this.form.sku.length === 1) {
        this.deleteVisible = false;
      }
    }
  }
};
</script>
