<template>
  <div v-loading="$store.state.product.survey.plan.planLoading">
    <div class="survey-title">
      调研进度表
    </div>

    <survey-schedule :get-progress="progress" />

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
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="project-plan_btn"
          :disabled="isDisabled"
          @click="addUsageScenario"
        >
          + 新增
        </el-button>
        <el-button
          class="user-btn"
          type="danger"
          :disabled="isDisabled"
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
          :disabled="isDisabled"
          clearable
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
          :disabled="isDisabled"
          clearable
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
          :disabled="isDisabled"
          clearable
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
                    :disabled="isDisabled"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="inner_box_dimension_w">
                  <el-input
                    v-model="productForm.inner_box_dimension_w"
                    class="analy-form_mar"
                    placeholder="宽度"
                    :disabled="isDisabled"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="inner_box_dimension_h">
                  <el-input
                    v-model="productForm.inner_box_dimension_h"
                    placeholder="高度"
                    :disabled="isDisabled"
                    clearable
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
                    :disabled="isDisabled"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="outer_box_dimension_w">
                  <el-input
                    v-model="productForm.outer_box_dimension_w"
                    class="analy-form_mar"
                    placeholder="宽度"
                    :disabled="isDisabled"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="outer_box_dimension_h">
                  <el-input
                    v-model="productForm.outer_box_dimension_h"
                    placeholder="高度"
                    :disabled="isDisabled"
                    clearable
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
                :disabled="isDisabled"
                clearable
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
                :disabled="isDisabled"
                clearable
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
                  :disabled="isDisabled"
                  clearable
                >
                  <el-option
                    v-for="item in currency"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
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
                >
                  <template #prepend>
                    ￥
                  </template>
                </el-input>
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
                  :disabled="isDisabled"
                  clearable
                >
                  <el-option
                    v-for="item in currency"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="tail_cost">
                <el-input
                  v-model="productForm.tail_cost"
                  class="analy-form_mar"
                  placeholder="请输入金额"
                  :disabled="isDisabled"
                  clearable
                />
              </el-form-item>
              <el-form-item prop="tail_cost_rmb">
                <el-input
                  v-model="productForm.tail_cost_rmb"
                  disabled
                  placeholder="请输入人民币"
                >
                  <template #prepend>
                    ￥
                  </template>
                </el-input>
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
      <el-form-item>
        <el-button
          type="primary"
          @click="submitProductForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SurveySchedule from '../../common/survey- schedule.vue';
import CompetitiveTable from '../../common/competitive-table.vue';

export default {
  components: {
    SurveySchedule,
    CompetitiveTable
  },
  props: [
    'progress',
    'attachment',
    'getList',
    'competitiveProduct',
    'productForm'
  ],
  data() {
    return {
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
      show: true,
      currency: []
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 ? false : true;
    }
  },
  mounted() {
    this.getCurrency();
  },
  methods: {
    async getCurrency() {
      if (localStorage.getItem('params')) {
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getCurrency();
      }
    },
    async updatePlan(val) {
      let body = val;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      body['attachment'] = this.attachment.id;
      await this.$store.dispatch('product/survey/plan/submitPlan', body);
      this.getList();
    },
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
          this.updatePlan(this.productForm);
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
