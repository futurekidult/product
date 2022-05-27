<template>
  <div v-loading="$store.state.product.survey.platform.platformLoading">
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
        {{ progress.is_multi_platform }}
      </el-descriptions-item>
      <el-descriptions-item label="调研平台">
        {{ progress.platform_desc }}
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
      ref="surveyForm"
      label-width="121px"
      style="width: 50%"
      :rules="surveyRules"
      :model="surveyForm"
    >
      <el-form-item
        label="产品图片"
        prop="images"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="handleImgSuccess"
          :limit="9"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-for="img in productImages"
          :key="img.id"
          class="attachment-list"
        >
          <div @click="previewImg(img.id)">
            {{ img.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="deleteImg(img.id)"
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="产品链接"
        prop="product_link"
      >
        <el-input
          v-model="surveyForm.product_link"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入内容"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="规格参数"
        prop="specification_parameter"
      >
        <el-input
          v-model="surveyForm.specification_parameter"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入内容"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="产品功能"
        prop="product_function"
      >
        <el-input
          v-model="surveyForm.product_function"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入内容"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="需求分析"
        prop="demand_analysis"
      >
        <el-input
          v-model="surveyForm.demand_analysis"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入内容"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <div class="form-item">
        <el-form-item
          label="年度销售额（万）"
          prop="annual_sales"
        >
          <el-input
            v-model="surveyForm.annual_sales"
            placeholder="请输入年度销售额"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="最近3年年销售额同比增长率"
          prop="growth_rate"
        >
          <el-input
            v-model="surveyForm.growth_rate"
            placeholder="请输入同比增长率"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item
          label="淡旺季系数"
          prop="peak_season_start"
        >
          <el-select
            v-model="surveyForm.peak_season_start"
            placeholder="请选择淡旺季系数"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in 12"
              :key="item"
              :label="`${item}月`"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="至"
          prop="peak_season_end"
        >
          <el-select
            v-model="surveyForm.peak_season_end"
            placeholder="请选择淡旺季系数"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in 12"
              :key="item"
              :label="`${item}月`"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item
          label="竞争度/垄断性"
          prop="competitive_degree"
        >
          <el-select
            v-model="surveyForm.competitive_degree"
            placeholder="请选择竞争度/垄断性"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in competitiveDegree"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="类目是否跳水"
          prop="is_nosedive_category"
        >
          <el-select
            v-model="surveyForm.is_nosedive_category"
            placeholder="请选择类目是否跳水"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="精准价位段"
          prop="precise_price_range"
        >
          <el-select
            v-model="surveyForm.precise_price_range"
            placeholder="请选择精准价位段
        "
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in precisePriceRange"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="流量丰富度"
          prop="flow_richness"
        >
          <el-select
            v-model="surveyForm.flow_richness"
            placeholder="请选择流量丰富度"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in trafficRichness"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="关键词是否跳水"
          prop="is_nosedive_keyword"
        >
          <el-select
            v-model="surveyForm.is_nosedive_keyword"
            placeholder="请选择关键词是否跳水"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="关键词竞价"
          prop="keyword_bidding_degree"
        >
          <el-select
            v-model="surveyForm.keyword_bidding_degree"
            placeholder="请选择关键词竞价"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="item in keywordDegree"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        label="竞品是否对标"
        style="width: 50%"
        prop="is_benchmarking"
      >
        <el-select
          v-model="surveyForm.is_benchmarking"
          placeholder="请选择竞品是否对标"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
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
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="!isDisabled">
        <el-button
          type="primary"
          @click="submitSurveyForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: [
    'changeColor',
    'progress',
    'surveyForm',
    'attachment',
    'productImages',
    'getList'
  ],
  data() {
    return {
      surveyRules: {
        images: [
          {
            required: true,
            message: '请上传图片'
          }
        ],
        product_link: [
          {
            required: true,
            message: '请输入产品链接'
          }
        ],
        specification_parameter: [
          {
            required: true,
            message: '请输入规格参数'
          }
        ],
        product_function: [
          {
            required: true,
            message: '请输入产品功能'
          }
        ],
        demand_analysis: [
          {
            required: true,
            message: '请输入需求分析'
          }
        ],
        annual_sales: [
          {
            required: true,
            message: '请输入年度销售额'
          }
        ],
        growth_rate: [
          {
            required: true,
            message: '请输入同比增长率'
          }
        ],
        peak_season_start: [
          {
            required: true,
            message: '请选择淡旺季系数'
          }
        ],
        peak_season_end: [
          {
            required: true,
            message: '请选择淡旺季系数'
          }
        ],
        competitive_degree: [
          {
            required: true,
            message: '请选择竞争度/垄断性'
          }
        ],
        is_nosedive_category: [
          {
            required: true,
            message: '请选择类目是否跳水'
          }
        ],
        precise_price_range: [
          {
            required: true,
            message: '请选择精准价位段'
          }
        ],
        flow_richness: [
          {
            required: true,
            message: '请选择流量丰富度'
          }
        ],
        is_nosedive_keyword: [
          {
            required: true,
            message: '请选择关键词是否跳水'
          }
        ],
        keyword_bidding_degree: [
          {
            required: true,
            message: '请选择关键词竞价'
          }
        ],
        is_benchmarking: [
          {
            required: true,
            message: '请选择竞品是否对标'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      show: true,
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      precisePriceRange: [],
      competitiveDegree: [],
      trafficRichness: [],
      keywordDegree: []
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  mounted() {
    this.getParams();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let platform = JSON.parse(
          localStorage.getItem('params')
        ).survey_platform;
        this.precisePriceRange = platform.precise_price_range;
        this.competitiveDegree = platform.competitive_degree;
        this.trafficRichness = platform.traffic_richness;
        this.keywordDegree = platform.keyword_bidding_degree;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    async updatePlatform(val) {
      let body = val;
      body['attachment'] = this.attachment.id;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      await this.$store.dispatch(
        'product/survey/platform/submitPlatform',
        body
      );
    },
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    handleImgSuccess(file, fileList) {
      this.productImages.push({
        id: file.id,
        name: fileList.name
      });
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.surveyForm.attachment = file.id;
      this.show = true;
    },
    previewImg(id) {
      console.log(id);
    },
    deleteImg(id) {
      this.productImages.splice(
        this.productImages.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    submitSurveyForm() {
      this.productImages.forEach((item) => {
        let { id } = item;
        this.surveyForm.images.push(id);
      });
      this.$refs.surveyForm.validate((valid) => {
        if (valid) {
          this.updatePlatform(this.surveyForm);
          this.getList();
        }
      });
    }
  }
};
</script>
