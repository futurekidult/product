<template>
  <el-form
    :model="productForm"
    label-width="100px"
    :style="type === 'detail' ? 'width: 60%' : 'width: 100%'"
  >
    <el-form-item label="产品名称">
      <el-input
        v-model="productForm.name"
        disabled
      />
    </el-form-item>
    <el-form-item label="产品图片">
      <base-upload
        type="image"
        :is-disabled="true"
        :list="attachment"
        tag="产品图片"
        count="8"
        url="prod-img"
      />
    </el-form-item>
    <div class="form-item">
      <el-form-item label="大品类">
        <el-input
          v-model="productForm.big_category_desc"
          disabled
        />
      </el-form-item>
      <el-form-item label="小品类">
        <el-input
          v-model="productForm.small_category_desc"
          disabled
        />
      </el-form-item>
    </div>
    <el-form-item
      label="品牌"
      style="width: 50%"
    >
      <el-input
        v-model="productForm.brand"
        disabled
      />
    </el-form-item>
    <el-form-item label="是否新品类">
      <el-radio
        v-for="item in options"
        :key="item.value"
        v-model="productForm.is_new_category"
        :label="item.value"
        disabled
      >
        {{ item.label }}
      </el-radio>
    </el-form-item>
    <el-form-item label="是否新产品">
      <el-radio
        v-for="item in options"
        :key="item.value"
        v-model="productForm.is_new_product"
        :label="item.value"
        disabled
      >
        {{ item.label }}
      </el-radio>
    </el-form-item>
    <div
      v-for="(item, index) in productForm.market"
      :key="index"
    >
      <el-form-item
        :label="'市场' + (index + 1)"
        style="width: 50%"
      >
        <el-select
          v-model="item.id"
          disabled
        >
          <el-option
            v-for="content in market"
            :key="content.key"
            :label="content.value"
            :value="content.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-model="item.id"
        :label="'平台' + (index + 1)"
      >
        <el-checkbox-group v-model="item.platform">
          <el-checkbox
            v-for="(content, i) in platform"
            :key="i"
            :label="content.key"
            disabled
          >
            {{ content.value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </div>
    <div v-if="type === 'quotation'">
      <el-divider />
      <div style="margin: 18px 0">
        调研文档
      </div>
      <el-form-item
        v-if="showAttachment(productForm.platform_survey_file)"
        label="平台调研"
      >
        <base-upload
          type="survey"
          url="platform-survey-report"
          :file="productForm.platform_survey_file"
          :is-disabled="true"
        />
      </el-form-item>
      <el-form-item
        v-if="showAttachment(productForm.market_survey_file)"
        label="市场调研"
      >
        <base-upload
          type="survey"
          url="market-survey-report"
          :is-disabled="true"
          :file="productForm.market_survey_file"
        />
      </el-form-item>
      <el-form-item
        v-if="showAttachment(productForm.user_analysis_file)"
        label="用户分析"
      >
        <base-upload
          type="survey"
          url="user-analysis-report"
          :is-disabled="true"
          :file="productForm.user_analysis_file"
        />
      </el-form-item>
      <el-form-item
        v-if="showAttachment(productForm.product_solutions_file)"
        label="产品方案"
      >
        <div
          v-for="item in productForm.product_solutions_file"
          :key="item.id"
        >
          <base-upload
            type="survey"
            url="product-solution"
            :is-disabled="true"
            :file="item"
          />
        </div>
      </el-form-item>
      <el-form-item
        v-if="showAttachment(productForm.risk_survey_file)"
        label="风险调研"
      >
        <base-upload
          type="survey"
          url="risk-survey-report"
          :is-disabled="true"
          :file="productForm.risk_survey_file"
        />
      </el-form-item>
      <el-form-item
        v-if="showAttachment(productForm.user_survey_file)"
        label="用户调研"
      >
        <div
          v-for="item in productForm.user_survey_file"
          :key="item.id"
        >
          <base-upload
            type="survey"
            url="user-survey-report"
            :is-disabled="true"
            :file="item"
          />
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  props: ['attachment', 'productForm', 'type'],
  data() {
    return {
      market: [],
      platform: [],
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let { demand } = JSON.parse(localStorage.getItem('params'));
        this.market = demand.market;
        this.platform = demand.platform;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    showAttachment(file) {
      if (file) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
