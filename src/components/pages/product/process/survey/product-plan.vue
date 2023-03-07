<template>
  <div v-loading="$store.state.product.survey.plan.planLoading">
    <div class="survey-title">
      调研进度表
    </div>

    <survey-schedule
      :id="productForm.id"
      :get-progress="progress"
      type="plan"
      @refresh-plan="refreshList"
    />

    <div class="survey-title">
      调研报告内容
    </div>

    <el-form
      ref="productForm"
      label-width="110px"
      style="width: 60%"
      :model="form"
      :rules="productRules"
    >
      <el-form-item
        v-for="(item, index) in form.usage_scenario"
        :key="index"
        :label="'使用场景' + (index + 1)"
        :prop="`usage_scenario[${index}]`"
        :rules="[{ required: true, message: '请输入使用场景' }, checkValid(15)]"
        class="form-item_width"
      >
        <div class="usage-scenario_include-delete">
          <el-input
            v-model="form.usage_scenario[index]"
            placeholder="请输入使用场景"
            maxlength="15"
            show-word-limit
            clearable
            :disabled="isDisabled"
            :validate-event="false"
          />
          <base-delete
            :id="index"
            mode="user_analysis-btn"
            content=""
            :show="showDelete"
            :list="form.usage_scenario"
            @get-list="getReturnData"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="!isDisabled">
        <el-button
          class="project-plan_btn"
          :disabled="isDisabled"
          @click="addUsageScenario"
        >
          + 新增
        </el-button>
      </el-form-item>
      <el-form-item
        label="用户痛点"
        prop="pain_spot"
        class="form-item_width"
      >
        <el-input
          v-model="form.pain_spot"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入用户痛点"
          :disabled="isDisabled"
          clearable
          :rows="6"
          :validate-event="false"
        />
      </el-form-item>
      <el-form-item
        label="用户需求分析"
        prop="user_demand_analysis"
        class="form-item_width"
      >
        <el-input
          v-model="form.user_demand_analysis"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入用户需求分析"
          :disabled="isDisabled"
          clearable
          :rows="6"
          :validate-event="false"
        />
      </el-form-item>
      <el-form-item
        label="产品切入点"
        prop="pointcut"
        class="form-item_width"
      >
        <el-input
          v-model="form.pointcut"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入产品切入点"
          :disabled="isDisabled"
          clearable
          :rows="6"
          :validate-event="false"
        />
      </el-form-item>
      <competitive-table
        v-if="
          form.competitive_product !== undefined &&
            form.competitive_product.length !== 0
        "
        :product-form="form"
      />
      <el-collapse
        v-model="activeCollapse"
        class="collapse-item"
      >
        <el-collapse-item
          title="新品信息"
          name="open"
        >
          <el-form-item
            label="内箱尺寸/cm"
            required
          >
            <div style="display: flex">
              <el-form-item prop="inner_box_dimension_l">
                <el-input
                  v-model="form.inner_box_dimension_l"
                  class="analy-form_mar"
                  placeholder="长度"
                  :disabled="isDisabled"
                  clearable
                  maxlength="15"
                  show-word-limit
                  :validate-event="false"
                />
              </el-form-item>
              <el-form-item prop="inner_box_dimension_w">
                <el-input
                  v-model="form.inner_box_dimension_w"
                  class="analy-form_mar"
                  placeholder="宽度"
                  :disabled="isDisabled"
                  clearable
                  maxlength="15"
                  show-word-limit
                  :validate-event="false"
                />
              </el-form-item>
              <el-form-item prop="inner_box_dimension_h">
                <el-input
                  v-model="form.inner_box_dimension_h"
                  placeholder="高度"
                  :disabled="isDisabled"
                  clearable
                  maxlength="15"
                  show-word-limit
                  :validate-event="false"
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
                  v-model="form.outer_box_dimension_l"
                  class="analy-form_mar"
                  placeholder="长度"
                  :disabled="isDisabled"
                  clearable
                  maxlength="15"
                  show-word-limit
                  :validate-event="false"
                />
              </el-form-item>
              <el-form-item prop="outer_box_dimension_w">
                <el-input
                  v-model="form.outer_box_dimension_w"
                  class="analy-form_mar"
                  placeholder="宽度"
                  :disabled="isDisabled"
                  clearable
                  maxlength="15"
                  show-word-limit
                  :validate-event="false"
                />
              </el-form-item>
              <el-form-item prop="outer_box_dimension_h">
                <el-input
                  v-model="form.outer_box_dimension_h"
                  placeholder="高度"
                  :disabled="isDisabled"
                  clearable
                  maxlength="15"
                  show-word-limit
                  :validate-event="false"
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
              v-model="form.inner_box_weight"
              placeholder="请输入内箱重量"
              :disabled="isDisabled"
              clearable
              maxlength="15"
              show-word-limit
              :validate-event="false"
            />
          </el-form-item>
          <el-form-item
            label="外箱重量/kg"
            style="margin-bottom: 18px"
            prop="outer_box_weight"
          >
            <el-input
              v-model="form.outer_box_weight"
              placeholder="请输入外箱重量"
              :disabled="isDisabled"
              clearable
              maxlength="15"
              show-word-limit
              :validate-event="false"
            />
          </el-form-item>
          <div
            v-if="!isDisabled"
            class="form-hint"
            style="margin-left: 20px"
          >
            <span>提示：以下费用填写可通过辅助工具进行计算。</span>
            /* IFTRUE_heyme */
            <a
              :href="$global.heymeLink"
              target="_blank"
              rel="noopener noreferrer"
              class="condition-link"
            >点击前往 >>
            </a>
            /* FITRUE_heyme */ /* IFTRUE_basepoint */
            <a
              :href="$global.haomiLink"
              target="_blank"
              rel="noopener noreferrer"
              class="condition-link"
            >点击前往 >>
            </a>
            /* FITRUE_basepoint */ /* IFTRUE_heytool */
            <a
              :href="$global.haomiLink"
              target="_blank"
              rel="noopener noreferrer"
              class="condition-link"
            >点击前往 >>
            </a>
            /* FITRUE_heytool */
          </div>
          <el-form-item
            label="头程附加费"
            style="margin-bottom: 18px"
            required
            class="form-item_width"
          >
            <div style="display: flex">
              <el-form-item prop="head_cost_currency">
                <el-select
                  v-model="form.head_cost_currency"
                  class="analy-form_mar"
                  placeholder="请选择货币"
                  :disabled="isDisabled"
                  clearable
                  :validate-event="false"
                  @clear="clearCurrency('head')"
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
                  v-model="form.head_cost"
                  class="analy-form_mar"
                  placeholder="请输入金额"
                  :disabled="isDisabled"
                  clearable
                  :validate-event="false"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="desc">
              此处为单个产品的费用
            </div>
          </el-form-item>
          <el-form-item
            label="尾程费用"
            style="margin-bottom: 18px"
            required
            class="form-item_width"
          >
            <div style="display: flex">
              <el-form-item prop="tail_cost_currency">
                <el-select
                  v-model="form.tail_cost_currency"
                  class="analy-form_mar"
                  placeholder="请选择货币"
                  :disabled="isDisabled"
                  clearable
                  :validate-event="false"
                  @clear="clearCurrency('tail')"
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
                  v-model="form.tail_cost"
                  class="analy-form_mar"
                  placeholder="请输入金额"
                  :disabled="isDisabled"
                  clearable
                  :validate-event="false"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="desc">
              此处为单个产品的费用
            </div>
          </el-form-item>
          <el-form-item
            label="海运单价"
            style="margin-bottom: 18px"
            required
            class="form-item_width"
          >
            <div style="display: flex">
              <el-form-item prop="sea_freight_currency">
                <el-select
                  v-model="form.sea_freight_currency"
                  class="analy-form_mar"
                  placeholder="请选择货币"
                  :disabled="isDisabled"
                  clearable
                  :validate-event="false"
                  @clear="clearCurrency('sea_freight')"
                >
                  <el-option
                    v-for="item in currency"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="sea_freight_cost">
                <el-input
                  v-model="form.sea_freight_cost"
                  class="analy-form_mar"
                  placeholder="请输入金额"
                  :disabled="isDisabled"
                  clearable
                  :validate-event="false"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item class="form-item_width">
            <div class="desc">
              此处请填写一立方的海运单价,若没有海运费金额请填0
            </div>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <el-form-item
        label="产品方案"
        prop="attachment"
        class="form-item_width"
      >
        <base-upload
          type="file-list"
          tag="产品方案"
          count="4"
          url="product-solution"
          :is-disabled="isDisabled"
          :file-list="file"
          @get-file="getUploadFile"
        />
      </el-form-item>
      <el-form-item v-if="!isDisabled">
        <el-button
          type="primary"
          @click="submitProductForm(10)"
        >
          提交
        </el-button>
        <el-button
          class="draft-btn"
          @click="submitProductForm(5)"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>

    <survey-suggestion
      v-if="progress.state === 50"
      :ids="$store.state.product.survey.plan.ids"
      type="product-solutions"
    />
  </div>
</template>

<script>
import SurveySchedule from '../../common/survey-schedule.vue';
import CompetitiveTable from '../../common/competitive-table.vue';
import { checkValid, checkPlanValueAllEmpty } from '../../../../../utils';
import SurveySuggestion from '../../common/survey-suggestion.vue';

export default {
  components: {
    SurveySchedule,
    CompetitiveTable,
    SurveySuggestion
  },
  inject: ['getBase', 'getSurveySchedule'],
  props: [
    'progress',
    'attachment',
    'getList',
    'productForm',
    'scenarioVisible'
  ],
  data() {
    return {
      productRules: {
        pain_spot: [
          {
            required: true,
            message: '请输入用户痛点'
          },
          checkValid(200)
        ],
        user_demand_analysis: [
          {
            required: true,
            message: '请输入用户需求分析'
          },
          checkValid(200)
        ],
        pointcut: [
          {
            required: true,
            message: '请输入产品切入点'
          },
          checkValid(200)
        ],
        inner_box_dimension_l: [
          {
            required: true,
            message: '请输入长度'
          },
          checkValid(15)
        ],
        inner_box_dimension_w: [
          {
            required: true,
            message: '请输入宽度'
          },
          checkValid(15)
        ],
        inner_box_dimension_h: [
          {
            required: true,
            message: '请输入高度'
          },
          checkValid(15)
        ],
        outer_box_dimension_l: [
          {
            required: true,
            message: '请输入长度'
          },
          checkValid(15)
        ],
        outer_box_dimension_w: [
          {
            required: true,
            message: '请输入宽度'
          },
          checkValid(15)
        ],
        outer_box_dimension_h: [
          {
            required: true,
            message: '请输入高度'
          },
          checkValid(15)
        ],
        inner_box_weight: [
          {
            required: true,
            message: '请输入内箱重量'
          },
          checkValid(15)
        ],
        outer_box_weight: [
          {
            required: true,
            message: '请输入外箱重量'
          },
          checkValid(15)
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
          },
          checkValid(15)
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
          },
          checkValid(15)
        ],
        sea_freight_currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        sea_freight_cost: [
          {
            required: true,
            message: '请输入金额'
          },
          checkValid(15)
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      currency: [],
      file: this.attachment,
      form: this.productForm,
      isScenarioVisible: this.isScenarioVisible,
      activeCollapse: 'open'
    };
  },
  computed: {
    getState() {
      console.log(1);
      return (
        this.progress.state === 5 ||
        this.progress.state === 10 ||
        this.progress.state === 30 ||
        this.progress.state === 35
      );
    },
    isDisabled() {
      return this.getState ? false : true;
    },
    showDelete() {
      return this.form.usage_scenario.length > 1 && this.getState;
    }
  },
  watch: {
    productForm(val) {
      this.form = val;
    },
    attachment(val) {
      this.file = val;
    }
  },
  mounted() {
    this.getCurrency();
  },
  methods: {
    checkValid,
    async getCurrency() {
      if (localStorage.getItem('params')) {
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getCurrency();
        } catch (err) {
          return;
        }
      }
    },
    async updatePlan(val, type) {
      let body = {
        ...val,
        product_id: +this.$route.params.productId
      };
      let funcName = '';
      switch (this.progress.state) {
        case 5:
          body.state = type;
          body.id = this.$store.state.product.survey.plan.plan.survey_id;
          body['survey_schedule_id'] = this.progress.id;
          funcName = 'product/survey/plan/submitPlan';
          break;
        case 10:
          body.state = type;
          body['survey_schedule_id'] = this.progress.id;
          funcName = 'product/survey/plan/submitPlan';
          break;
        case 30:
          body.state = val === 5 ? 35 : 20;
          body.id = this.productForm.id;
          funcName = 'product/survey/plan/updatePlan';
        case 35:
          body.state = val === 5 ? 35 : 20;
          body.id = this.productForm.id;
          funcName = 'product/survey/plan/updatePlan';
          break;
        default:
      }
      try {
        await this.$store.dispatch(funcName, body);
        this.getList();
        this.getBase();
      } catch (err) {
        return;
      }
    },
    addUsageScenario() {
      this.form.usage_scenario.length++;
      if (this.form.usage_scenario.length > 1) {
        this.isScenarioVisible = true;
      }
    },
    deleteUsageScenario() {
      this.form.usage_scenario.pop();
      if (this.form.usage_scenario.length === 1) {
        this.isScenarioVisible = false;
      }
    },
    clearCurrency(val) {
      this.form[`${val}_cost`] = '';
    },
    deleteFile(id) {
      this.file.splice(
        this.file.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
    },
    submitProductForm(type) {
      this.form.attachment = [];
      if (JSON.stringify(this.file) !== '{}') {
        this.file.forEach((item) => {
          let { id } = item;
          this.form.attachment.push(id);
        });
      }
      let form = JSON.parse(JSON.stringify(this.form));
      if (type === 10) {
        this.$refs.productForm.validate((valid) => {
          if (valid) {
            this.updatePlan(form, type);
          }
        });
      } else {
        this.$refs.productForm.clearValidate();
        let isAllEmpty = checkPlanValueAllEmpty(this.form);
        if (isAllEmpty) {
          this.$message.warning('保存失败，保存内容不可为空');
        } else {
          this.updatePlan(form, type);
        }
      }
    },
    getUploadFile(e) {
      this.file = e;
    },
    getReturnData(val) {
      this.form.usage_scenario = val;
    },
    refreshList(val) {
      this.getList();
      if (val === 1) {
        this.getSurveySchedule();
      }
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
