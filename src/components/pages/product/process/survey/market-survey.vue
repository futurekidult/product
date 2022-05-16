<template>
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
        action=""
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
        支持office文档格式,文档不超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div
        v-if="show"
        class="attachment-list"
      >
        <div>
          {{ handleAttachment(attachment.name) }}
        </div>
        <el-button
          v-if="!isDisabled"
          type="text"
          @click="deleteFile(attachment.id)"
        >
          删除
        </el-button>
        <el-button
          v-else
          type="text"
          @click="download(attachment.id)"
        >
          下载附件
        </el-button>
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
</template>

<script>
export default {
  props: ['changeColor'],
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
      show: true,
      attachment: {},
      progress: {}
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  mounted() {
    this.getMarket();
  },
  methods: {
    async getMarket() {
      await this.$store.dispatch('product/survey/market/getMarketData');
      this.progress = this.$store.state.product.survey.market.market.progress;
      this.attachment = this.$store.state.product.survey.market.market.report;
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.marketForm.attachment = file.id;
      this.show = true;
    },
    async submitRequest() {
      let params = {
        product_id: +this.$route.params.productId,
        attchment_id: this.marketForm.attachment,
        survey_schedule_id: this.progress.id
      };
      await this.$store.dispatch(
        'product/survey/market/submitMarketFile',
        params
      );
    },
    submitMarketForm() {
      this.$refs.marketForm.validate((valid) => {
        if (valid) {
          this.submitRequest();
          this.getMarket();
        }
      });
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    previewFile(id) {
      console.log(id);
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.marketForm.attachment = {};
      this.show = false;
    },
    download(id) {
      console.log(id);
    }
  }
};
</script>
