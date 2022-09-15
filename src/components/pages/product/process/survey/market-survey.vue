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
      <el-descriptions-item label="是否多市场">
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
        label="调研报告"
        prop="attachment"
      >
        <base-upload
          type="file"
          tag="调研报告"
          url="market-survey-report"
          :file="file"
          :is-disabled="isDisabled"
          @get-file="getUploadFile"
        />
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
    getUploadFile(e) {
      this.file = e;
    }
  }
};
</script>
