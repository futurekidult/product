<template>
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
      {{ schedule.state_desc }}
    </el-descriptions-item>
  </el-descriptions>

  <el-form
    ref="skuForm"
    label-width="110px"
    style="width: 50%; margin: 20px 0"
    :model="skuForm"
    :rules="skuRules"
  >
    <div
      v-for="(item, index) in skuForm.sku"
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
        />
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
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleFileSuccess"
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
    <el-form-item v-if="show">
      <div class="attachment-list">
        <div>
          {{ handleAttachment(attachment.name) }}
        </div>
        <el-button
          v-if="isDisabled"
          type="text"
        >
          下载
        </el-button>
        <el-button
          v-else
          type="text"
          @click="deleteFile(attachment.id)"
        >
          删除
        </el-button>
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
      {{ skuEntrySchedule.state_desc }}
    </el-descriptions-item>
    <el-descriptions-item label="操作">
      <el-button
        :disabled="skuEntrySchedule.state !== 10 "
        @click="completeEntry"
      >
        已完成SKU录入甲骨文
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
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
      skuForm: {},
      attachment: {},
      skuEntrySchedule: {},
      schedule: {},
      skuId: 0
    };
  },
  computed: {
    isDisabled() {
      return this.schedule.state === 40 ? true : false;
    }
  },
  mounted() {
    this.getSku();
  },
  methods: {
    async getSku() {
      await this.$store.dispatch('product/order/getSkuForm', {
        params: {
          order_id: this.orderId
        }
      });
      this.skuForm = this.$store.state.product.order.sku.sku_info;
      this.skuId = this.$store.state.product.order.sku.id;
      this.attachment = this.skuForm.project_plan_file;
      this.skuEntrySchedule =
        this.$store.state.product.order.sku.sku_entry_schedule;
      this.schedule = this.$store.state.product.order.sku.sku_name_schedule;
    },
    async updateSkuname(val) {
      let body = {};
      body['sku_info'] = {};
      body['sku_info']['sku'] = val.sku;
      body['id'] = this.skuId;
      body['sku_info']['project_plan_file'] = this.attachment.id;
      await this.$store.dispatch('product/order/submitSkuname', body);
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
    },
    previewFile(id) {
      console.log(id);
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    async getSkuForm() {
      await this.$store.dispatch('product/order/getSkuForm');
    },
    submitSkuForm() {
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          this.updateSkuname(this.skuForm);
          this.getSku();
        }
      });
    },
    async completeEntry() {
      await this.$store.dispatch('product/order/completeSkuEntry', {
        id: this.getSkuId
      });
      this.getSku();
    },
    addSku() {
      this.skuForm.sku.push({});
    },
    deleteSku() {
      this.skuForm.sku.pop();
    }
  }
};
</script>
