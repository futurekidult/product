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
      ref="form"
      label-width="121px"
      style="width: 50%"
      :rules="surveyRules"
      :model="form"
    >
      <el-form-item
        label="产品图片"
        prop="images"
      >
        <el-upload
          action
          :show-file-list="false"
          :http-request="handleImgSuccess"
          :disabled="isDisabled"
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
          v-for="img in imgList"
          :key="img.id"
          class="attachment-list"
        >
          <div>
            {{ img.name }}
          </div>
          <div style="display: flex">
            <div v-if="!isDisabled">
              <el-button
                type="text"
                @click="deleteImg(img.id)"
              >
                删除
              </el-button>
              <span class="table-btn">|</span>
            </div>
            <el-button
              type="text"
              @click="showViewDialog(img.id)"
            >
              预览
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="产品链接"
        prop="product_link"
      >
        <el-input
          v-model="form.product_link"
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
          v-model="form.specification_parameter"
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
          v-model="form.product_function"
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
          v-model="form.demand_analysis"
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
            v-model="form.annual_sales"
            placeholder="请输入年度销售额"
            :disabled="isDisabled"
            clearable
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="最近3年年销售额同比增长率"
          prop="growth_rate"
        >
          <el-input
            v-model="form.growth_rate"
            placeholder="请输入同比增长率"
            :disabled="isDisabled"
            clearable
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item
          label="淡旺季系数"
          prop="peak_season_start"
        >
          <el-select
            v-model="form.peak_season_start"
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
            v-model="form.peak_season_end"
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
            v-model="form.competitive_degree"
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
            v-model="form.is_nosedive_category"
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
            v-model="form.precise_price_range"
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
          prop="traffic_richness"
        >
          <el-select
            v-model="form.traffic_richness"
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
            v-model="form.is_nosedive_keyword"
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
            v-model="form.keyword_bidding_degree"
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
          v-model="form.is_benchmarking"
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
          action
          :show-file-list="false"
          :http-request="handleFileSuccess"
          :disabled="isDisabled"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式,文档不超过5MB(仅限一个)
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
            <span 
              v-if="file.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              v-if="file.type === 12860"
              type="text"
              @click="showViewFile(file.id)"
            >
              预览
            </el-button>
          </div>
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

  <view-dialog
    v-if="viewImgDialog"
    :link="imgLink"
    :visible="viewImgDialog"
    @hide-dialog="closeViewDialog"
  />
</template>

<script>
import { downloadFile, getFile, previewFile } from '../../../../../utils';
import ViewDialog from '../../../../common/view-dialog.vue';

export default {
  components: {
    ViewDialog
  },
  inject: ['getBase'],
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
        traffic_richness: [
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
      keywordDegree: [],
      res: {},
      viewImgDialog: false,
      imgLink: '',
      file: this.attachment,
      form: this.surveyForm,
      imgList: this.productImages
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
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async updatePlatform(val) {
      let body = val;
      body['attachment'] = this.file.id;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch(
          'product/survey/platform/submitPlatform',
          body
        );
        this.getList();
        this.getBase();
      } catch (err) {
        return;
      }
    },
    async handleImgSuccess(e) {
      if(e.file.type.indexOf('image') > -1) {
        if (this.imgList.length > 8) {
          this.$message.error('产品图片不能传超过9张');
        } else {
          this.$store.commit('setUploadState', false);
          let form = getFile(e);
          try {
            await this.$store.dispatch('uploadFile', form);
            if (this.$store.state.uploadState) {
              this.res = this.$store.state.fileRes;
              this.imgList.push({
                id: this.res.id,
                name: this.res.file_name,
                type: this.res.type
              });
            }
          } catch (err) {
            return;
          }
        }
      } else {
        this.$message.error('上传的产品图片有误！');
      }
    },
    async handleFileSuccess(e) {
      if(e.file.type.indexOf('application') > -1 || e.file.type === 'text/csv') {
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
            this.form.attachment = this.file.id;
          }
        } catch (err) {
          return;
        }
      } else {
        this.$message.error('上传的附件格式有误！');
      }
    },
    async showViewDialog(id) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          this.viewImgDialog = true;
          this.imgLink = this.$store.state.viewLink;
        }
      } catch (err) {
        return;
      }
    },
    closeViewDialog() {
      this.viewImgDialog = false;
    },
    deleteImg(id) {
      this.imgList.splice(
        this.imgList.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
    },
    deleteFile() {
      this.file = {};
      this.form.attachment = '';
    },
    submitSurveyForm() {
      let form = JSON.parse(JSON.stringify(this.form));
      form.images = [];
      this.imgList.forEach((item) => {
        let { id } = item;
       form.images.push(id);
      });
      form.attachment = this.file.id;
      form.annual_sales = +form.annual_sales;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updatePlatform(form);
        }
      });
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
