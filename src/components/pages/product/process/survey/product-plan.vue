<template>
  <div class="survey-title">
    调研进度表
  </div>

  <survey-schedule />

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    ref="productForm"
    label-width="110px"
    style="width: 50%"
    :model="productForm"
    :rules="productRules"
  >
    <el-form-item
      v-for="(item, index) in productForm.usageScenario"
      :key="index"
      :label="'使用场景' + (index + 1)"
      :prop="`usageScenario[${index}]`"
      :rules="productRules.usageScenario"
    >
      <el-input
        v-model="productForm.usageScenario[index]"
        placeholder="请输入使用场景"
        maxlength="15"
        show-word-limit
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="project-plan_btn"
        @click="addUsageScenario"
      >
        + 新增
      </el-button>
      <el-button
        class="user-btn"
        type="danger"
        @click="deleteUsageScenario"
      >
        - 删除
      </el-button>
    </el-form-item>
    <el-form-item
      label="用户痛点"
      prop="userPainspot"
    >
      <el-input
        v-model="productForm.userPainspot"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入用户痛点"
      />
    </el-form-item>
    <el-form-item
      label="用户需求分析"
      prop="demandAnalysis"
    >
      <el-input
        v-model="productForm.demandAnalysis"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入用户需求分析"
      />
    </el-form-item>
    <el-form-item
      label="产品切入点"
      prop="productPointcut"
    >
      <el-input
        v-model="productForm.productPointcut"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入产品切入点"
      />
    </el-form-item>
    <competitive-table />
    <el-collapse class="collapse-item">
      <el-collapse-item title="新品信息">
        <div class="analy-form_item">
          <el-form-item
            label="内箱尺寸/cm"
            required
          >
            <div style="display: flex">
              <el-form-item prop="innerLength">
                <el-input
                  v-model="productForm.innerLength"
                  class="analy-form_mar"
                  placeholder="长度"
                />
              </el-form-item>
              <el-form-item prop="innerWidth">
                <el-input
                  v-model="productForm.innerWidth"
                  class="analy-form_mar"
                  placeholder="宽度"
                />
              </el-form-item>
              <el-form-item prop="innerHeight">
                <el-input
                  v-model="productForm.innerHeight"
                  placeholder="高度"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item
            label="外箱尺寸/cm"
            required
          >
            <div style="display: flex">
              <el-form-item prop="outerLength">
                <el-input
                  v-model="productForm.outerLength"
                  class="analy-form_mar"
                  placeholder="长度"
                />
              </el-form-item>
              <el-form-item prop="outerWidth">
                <el-input
                  v-model="productForm.outerWidth"
                  class="analy-form_mar"
                  placeholder="宽度"
                />
              </el-form-item>
              <el-form-item prop="outerHeight">
                <el-input
                  v-model="productForm.outerHeight"
                  placeholder="高度"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item
            label="内箱重量/kg"
            style="margin-bottom: 18px"
            prop="innerboxWeight"
          >
            <el-input
              v-model="productForm.innerboxWeight"
              placeholder="请输入内箱重量"
            />
          </el-form-item>
          <el-form-item
            label="外箱重量/kg"
            style="margin-bottom: 18px"
            prop="outerboxWeight"
          >
            <el-input
              v-model="productForm.outerboxWeight"
              placeholder="请输入外箱重量"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="头程费用"
          style="margin-bottom: 18px"
          required
        >
          <div style="display: flex">
            <el-form-item prop="headCurrency">
              <el-select
                v-model="productForm.headCurrency"
                class="analy-form_mar"
                placeholder="请选择货币"
              />
            </el-form-item>
            <el-form-item prop="headMoney">
              <el-input
                v-model="productForm.headMoney"
                class="analy-form_mar"
                placeholder="请输入金额"
              />
            </el-form-item>
            <el-form-item prop="headYuan">
              <el-input
                v-model="productForm.headYuan"
                disabled
                placeholder="请输入人民币"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="尾程费用"
          style="margin-bottom: 18px"
          prop="tailCost"
        >
          <div style="display: flex">
            <el-form-item prop="tailCurrency">
              <el-select
                v-model="productForm.tailCurrency"
                class="analy-form_mar"
                placeholder="请选择货币"
              />
            </el-form-item>
            <el-form-item prop="tailMoney">
              <el-input
                v-model="productForm.tailMoney"
                class="analy-form_mar"
                placeholder="请输入金额"
              />
            </el-form-item>
            <el-form-item prop="tailYuan">
              <el-input
                v-model="productForm.tailYuan"
                disabled
                placeholder="请输入人民币"
              />
            </el-form-item>
          </div>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
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
        支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
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
        @click="submitProductForm"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SurveySchedule from '../../common/survey- schedule.vue';
import CompetitiveTable from '../../common/competitive-table.vue';

export default {
  components: {
    SurveySchedule,
    CompetitiveTable
  },
  data() {
    return {
      usageScenario: [],
      count: 0,
      productForm: {
        usageScenario: ['']
      },
      competitiveProductForm: {},
      productRules: {
        usageScenario: [
          {
            required: true,
            message: '请输入使用场景'
          }
        ],
        userPainspot: [
          {
            required: true,
            message: '请输入用户痛点'
          }
        ],
        demandAnalysis: [
          {
            required: true,
            message: '请输入用户需求分析'
          }
        ],
        productPointcut: [
          {
            required: true,
            message: '请输入产品切入点'
          }
        ],
        innerLength: [
          {
            required: true,
            message: '请输入长度'
          }
        ],
        innerWidth: [
          {
            required: true,
            message: '请输入宽度'
          }
        ],
        innerHeight: [
          {
            required: true,
            message: '请输入高度'
          }
        ],
        outerLength: [
          {
            required: true,
            message: '请输入长度'
          }
        ],
        outerWidth: [
          {
            required: true,
            message: '请输入宽度'
          }
        ],
        outerHeight: [
          {
            required: true,
            message: '请输入高度'
          }
        ],
        outerboxDimension: [
          {
            required: true,
            message: '请输入外箱尺寸'
          }
        ],
        innerboxWeight: [
          {
            required: true,
            message: '请输入内箱重量'
          }
        ],
        outerboxWeight: [
          {
            required: true,
            message: '请输入外箱重量'
          }
        ],
        headCurrency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        headMoney: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        headYuan: [
          {
            required: true,
            message: '请输入人民币'
          }
        ],
        tailCurrency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        tailMoney: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        tailYuan: [
          {
            required: true,
            message: '请输入人民币'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      competitiveProductRules: {},
      fileList: []
    };
  },
  methods: {
    addUsageScenario() {
      this.productForm.usageScenario.length++;
    },
    deleteUsageScenario() {
      this.productForm.usageScenario.length--;
    },
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.productForm.attachment = file.id;
    },
    deleteFile(id) {
      console.log(id);
    },
    previewFile(id) {
      console.log(id);
    },
    submitProductForm() {
      this.$refs.productForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>

<style scoped>
.analy-form_item {
  display: grid;
  grid-template-columns: 48.5% 48.5%;
  gap: 18px;
}

.analy-form_mar {
  margin-right: 5px;
}
</style>
