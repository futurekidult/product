<template>
  <base-dialog
    v-if="src"
    @close="handleClose"
  >
    <img :src="src">
  </base-dialog>
  <div class="survey-title">
    调研进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="负责人" />
    <el-table-column label="是否多平台" />
    <el-table-column label="调研平台" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
  </el-table>

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
      prop="productImage"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleImgSuccess"
        :limit="9"
      >
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div
        v-for="img in productImage"
        :key="img.id"
        class="attachment-list"
      >
        <div @click="previewImg(img.id)">
          {{ img.name }}
        </div>
        <el-button
          type="text"
          @click="deleteImg(img.id)"
        >
          删除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item
      label="产品链接"
      prop="productLink"
    >
      <el-input
        v-model="surveyForm.productLink"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入内容"
      />
    </el-form-item>
    <el-form-item
      label="规格参数"
      prop="specificationParameter"
    >
      <el-input
        v-model="surveyForm.specificationParameter"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入内容"
      />
    </el-form-item>
    <el-form-item
      label="产品功能"
      prop="productFeature"
    >
      <el-input
        v-model="surveyForm.productFeature"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入内容"
      />
    </el-form-item>
    <el-form-item
      label="需求分析"
      prop="demandAnalysis"
    >
      <el-input
        v-model="surveyForm.demandAnalysis"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入内容"
      />
    </el-form-item>
    <div class="form-item">
      <el-form-item
        label="年度销售额（万）"
        prop="annualSales"
      >
        <el-input
          v-model="surveyForm.annualSales"
          placeholder="请输入年度销售额"
        />
      </el-form-item>
      <el-form-item
        label="最近3年年销售额同比增长率"
        prop="growthRate"
      >
        <el-input
          v-model="surveyForm.growthRate"
          placeholder="请输入同比增长率"
        />
      </el-form-item>
    </div>
    <el-form-item
      label="淡旺季系数"
      prop="peakSeason"
    >
      <div class="form-template">
        <el-select
          v-model="surveyForm.startPeakSeason"
          placeholder="请选择淡旺季系数"
        />
        <div style="text-align: center">
          至
        </div>
        <el-select
          v-model="surveyForm.endPeakSeason"
          placeholder="请选择淡旺季系数"
        />
      </div>
    </el-form-item>
    <div class="form-item">
      <el-form-item
        label="竞争度/垄断性"
        prop="monopoly"
      >
        <el-select
          v-model="surveyForm.monopoly"
          placeholder="请选择竞争度/垄断性"
        />
      </el-form-item>
      <el-form-item
        label="类目是否跳水"
        prop="isNosediveCategory"
      >
        <el-select
          v-model="surveyForm.isNosediveCategory"
          placeholder="请选择类目是否跳水"
        />
      </el-form-item>
      <el-form-item
        label="精准价位段"
        prop="precisePriceRange"
      >
        <el-select
          v-model="surveyForm.precisePriceRange"
          placeholder="请选择精准度家段
        "
        />
      </el-form-item>
      <el-form-item
        label="流量丰富度"
        prop="trafficRichness"
      >
        <el-select
          v-model="surveyForm.trafficRichness"
          placeholder="请选择流量丰富度"
        />
      </el-form-item>
      <el-form-item
        label="关键词是否跳水"
        prop="isNosediveKeyword"
      >
        <el-select
          v-model="surveyForm.isNosediveKeyword"
          placeholder="请选择关键词是否跳水"
        />
      </el-form-item>
      <el-form-item
        label="关键词竞价"
        prop="keywordBiddingDegree"
      >
        <el-select
          v-model="surveyForm.keywordBiddingDegree"
          placeholder="请选择关键词竞价"
        />
      </el-form-item>
    </div>
    <el-form-item
      label="竞品是否对标"
      style="width: 49%"
      prop="isBenchmarking"
    >
      <el-select
        v-model="surveyForm.isBenchmarking"
        placeholder="请选择竞品是否对标"
      />
    </el-form-item>
    <el-form-item
      label="上传附件"
      prop="attachment"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleFileSuccess"
        :limit="1"
      >
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式,文档不超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div
        v-for="file in fileList"
        :key="file.id"
        class="attachment-list"
      >
        <div @click="previewFile(file.id)">
          {{ file.name }}
        </div>
        <el-button
          type="text"
          @click="deleteFile(file.id)"
        >
          删除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitSurveyForm"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import BaseDialog from '../../../../common/base-dialog.vue';
export default {
  components: {
    BaseDialog
  },
  data() {
    return {
      fileList: [],
      productImage: [],
      src: null,
      surveyRules: {
        productImage: [
          {
            required: true,
            message: '请上传图片'
          }
        ],
        productLink: [
          {
            required: true,
            message: '请输入产品链接'
          }
        ],
        specificationParameter: [
          {
            required: true,
            message: '请输入规格参数'
          }
        ],
        productFeature: [
          {
            required: true,
            message: '请输入产品功能'
          }
        ],
        demandAnalysis: [
          {
            required: true,
            message: '请输入需求分析'
          }
        ],
        annualSales: [
          {
            required: true,
            message: '请输入年度销售额'
          }
        ],
        growthRate: [
          {
            required: true,
            message: '请输入同比增长率'
          }
        ],
        peakSeason: [
          {
            required: true,
            message: '请选择淡旺季系数'
          }
        ],
        monopoly: [
          {
            required: true,
            message: '请选择竞争度/垄断性'
          }
        ],
        isNosediveCategory: [
          {
            required: true,
            message: '请选择类目是否跳水'
          }
        ],
        precisePriceRange: [
          {
            required: true,
            message: '请选择精准价位段'
          }
        ],
        trafficRichness: [
          {
            required: true,
            message: '请选择流量丰富度'
          }
        ],
        isNosediveKeyword: [
          {
            required: true,
            message: '请选择关键词是否跳水'
          }
        ],
        keywordBiddingDegree: [
          {
            required: true,
            message: '请选择关键词竞价'
          }
        ],
        isBenchmarking: [
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
      surveyForm: {}
    };
  },
  methods: {
    handleImgSuccess(file, fileList) {
      this.productImage.push({
        id: file.id,
        name: fileList.name
      });
    },
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.surveyForm.attachment = file.id;
    },
    previewImg(id) {
      console.log(id);
      this.src =
        'https://img0.baidu.com/it/u=2775655496,2255017447&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800';
    },
    deleteImg(id) {
      console.log(id);
    },
    previewFile(id) {
      console.log(id);
      this.src =
        'https://img0.baidu.com/it/u=2775655496,2255017447&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800';
    },
    deleteFile(id) {
      console.log(id);
    },
    handleClose() {
      this.src = null;
    },
    submitSurveyForm() {
      this.surveyForm.productImage = this.productImage;
      console.log(this.surveyForm);
      this.$refs.surveyForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
