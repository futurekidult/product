<template>
  <div class="survey-title">
    调研进度表
  </div>

  <survey-schedule :get-progress="getProgress" />

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
      v-for="(item, index) in productForm.usage_scenario"
      :key="index"
      :label="'使用场景' + (index + 1)"
      :prop="`usage_scenario[${index}]`"
      :rules="productRules.usage_scenario"
    >
      <el-input
        v-model="productForm.usage_scenario[index]"
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
      prop="pain_spot"
    >
      <el-input
        v-model="productForm.pain_spot"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入用户痛点"
      />
    </el-form-item>
    <el-form-item
      label="用户需求分析"
      prop="user_demand_analysis"
    >
      <el-input
        v-model="productForm.user_demand_analysis"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入用户需求分析"
      />
    </el-form-item>
    <el-form-item
      label="产品切入点"
      prop="pointcut"
    >
      <el-input
        v-model="productForm.pointcut"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="请输入产品切入点"
      />
    </el-form-item>
    <competitive-table :competitive-product="competitiveProduct" />
    <el-collapse class="collapse-item">
      <el-collapse-item title="新品信息">
        <div class="analy-form_item">
          <el-form-item
            label="内箱尺寸/cm"
            required
          >
            <div style="display: flex">
              <el-form-item prop="inner_box_dimension_l">
                <el-input
                  v-model="productForm.inner_box_dimension_l"
                  class="analy-form_mar"
                  placeholder="长度"
                />
              </el-form-item>
              <el-form-item prop="inner_box_dimension_w">
                <el-input
                  v-model="productForm.inner_box_dimension_w"
                  class="analy-form_mar"
                  placeholder="宽度"
                />
              </el-form-item>
              <el-form-item prop="inner_box_dimension_h">
                <el-input
                  v-model="productForm.inner_box_dimension_h"
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
              <el-form-item prop="outer_box_dimension_l">
                <el-input
                  v-model="productForm.outer_box_dimension_l"
                  class="analy-form_mar"
                  placeholder="长度"
                />
              </el-form-item>
              <el-form-item prop="outer_box_dimension_w">
                <el-input
                  v-model="productForm.outer_box_dimension_w"
                  class="analy-form_mar"
                  placeholder="宽度"
                />
              </el-form-item>
              <el-form-item prop="outer_box_dimension_h">
                <el-input
                  v-model="productForm.outer_box_dimension_h"
                  placeholder="高度"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item
            label="内箱重量/kg"
            style="margin-bottom: 18px"
            prop="inner_box_weight"
          >
            <el-input
              v-model="productForm.inner_box_weight"
              placeholder="请输入内箱重量"
            />
          </el-form-item>
          <el-form-item
            label="外箱重量/kg"
            style="margin-bottom: 18px"
            prop="outer_box_weight"
          >
            <el-input
              v-model="productForm.outer_box_weight"
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
            <el-form-item prop="head_cost_currency">
              <el-select
                v-model="productForm.head_cost_currency"
                class="analy-form_mar"
                placeholder="请选择货币"
              />
            </el-form-item>
            <el-form-item prop="head_cost">
              <el-input
                v-model="productForm.head_cost"
                class="analy-form_mar"
                placeholder="请输入金额"
              />
            </el-form-item>
            <el-form-item prop="head_cost_rmb">
              <el-input
                v-model="productForm.head_cost_rmb"
                disabled
                placeholder="请输入人民币"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="尾程费用"
          style="margin-bottom: 18px"
          required
        >
          <div style="display: flex">
            <el-form-item prop="tail_cost_currency">
              <el-select
                v-model="productForm.tail_cost_currency"
                class="analy-form_mar"
                placeholder="请选择货币"
              />
            </el-form-item>
            <el-form-item prop="tail_cost">
              <el-input
                v-model="productForm.tail_cost"
                class="analy-form_mar"
                placeholder="请输入金额"
              />
            </el-form-item>
            <el-form-item prop="tail_cost_rmb">
              <el-input
                v-model="productForm.tail_cost_rmb"
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
        v-if="show"
        class="attachment-list"
      >
        <div>
          {{ handleAttachment(attachment.name) }}
        </div>
        <el-button
          type="text"
          @click="deleteFile(attachment.id)"
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
      productForm: this.$store.state.product.survey.plan.planForm,
      competitiveProduct:
        this.$store.state.product.survey.plan.planForm.competitive_product,
      productRules: {
        usage_scenario: [
          {
            required: true,
            message: '请输入使用场景'
          }
        ],
        pain_spot: [
          {
            required: true,
            message: '请输入用户痛点'
          }
        ],
        user_demand_analysis: [
          {
            required: true,
            message: '请输入用户需求分析'
          }
        ],
        pointcut: [
          {
            required: true,
            message: '请输入产品切入点'
          }
        ],
        inner_box_dimension_l: [
          {
            required: true,
            message: '请输入长度'
          }
        ],
        inner_box_dimension_w: [
          {
            required: true,
            message: '请输入宽度'
          }
        ],
        inner_box_dimension_h: [
          {
            required: true,
            message: '请输入高度'
          }
        ],
        outer_box_dimension_l: [
          {
            required: true,
            message: '请输入长度'
          }
        ],
        outer_box_dimension_w: [
          {
            required: true,
            message: '请输入宽度'
          }
        ],
        outer_box_dimension_h: [
          {
            required: true,
            message: '请输入高度'
          }
        ],
        inner_box_weight: [
          {
            required: true,
            message: '请输入内箱重量'
          }
        ],
        outer_box_weight: [
          {
            required: true,
            message: '请输入外箱重量'
          }
        ],
        head_cost_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        head_cost: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        head_cost_rmb: [
          {
            required: true,
            message: '请输入人民币'
          }
        ],
        tail_cost_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        tail_cost: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        tail_cost_rmb: [
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
      attachment: this.$store.state.product.survey.plan.planForm.attachment,
      show: true
    };
  },
  computed: {
    getProgress() {
      return this.$store.state.product.survey.plan.progress;
    }
  },
  methods: {
    handleAttachment(file) {
      if (file === undefined) {
        return '';
      } else {
        return file;
      }
    },
    addUsageScenario() {
      this.productForm.usage_scenario.length++;
    },
    deleteUsageScenario() {
      this.productForm.usage_scenario.length--;
    },
    handleFileSuccess(file, fileList) {
      this.attachment = {
        id: file.id,
        name: fileList.name
      };
      this.productForm.attachment = file.id;
      this.show = true;
    },
    deleteFile(id) {
      console.log(id);
      this.attachment = {};
      this.show = false;
    },
    previewFile(id) {
      console.log(id);
    },
    submitProductForm() {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          console.log(this.productForm);
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
