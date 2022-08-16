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
      :model="form"
      :rules="productRules"
    >
      <el-form-item
        v-for="(item, index) in form.usage_scenario"
        :key="index"
        :label="'使用场景' + (index + 1)"
        :prop="`usage_scenario[${index}]`"
        :rules="[{ required: true, message: '请输入使用场景'}, checkValid(15)]"
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
          />
          <base-delete 
            :id="index"
            mode="user_analysis-btn"
            content=""
            :show="form.usage_scenario.length > 1 && progress.state !== 50"
            :list="form.usage_scenario"
            @get-list="(val) => getReturnData(val, 'usage')"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="progress.state !== 50">
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
        />
      </el-form-item>
      <competitive-table :product-form="form" />
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
            />
          </el-form-item>
          <el-form-item
            label="头程费用"
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
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item class="form-item_width">
            <div class="desc">
              若没有海运费的金额请填0
            </div>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <el-form-item
        label="上传附件"
        prop="attachment"
        class="form-item_width"
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
          支持office文档格式,文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item class="form-item_width">
        <div
          v-for="item in file"
          :key="item.id"
          class="attachment-list"
        >
          <div>
            {{ item.name }}
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
              @click="download(item.id, item.name)"
            >
              下载
            </el-button>
            <span 
              v-if="item.type === 12860"
              class="table-btn"
            >|</span>
            <el-button
              v-if="item.type === 12860"
              type="text"
              @click="showViewFile(item.id)"
            >
              预览
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="!isDisabled">
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
import {
  downloadFile,
  getFile,
  previewFile,
  checkValid
} from '../../../../../utils';

export default {
  components: {
    SurveySchedule,
    CompetitiveTable
  },
  inject: ['getBase'],
  props: ['progress', 'attachment', 'getList', 'productForm', 'scenarioVisible'],
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
    isDisabled() {
      return this.progress.state === 10 ? false : true;
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
    async updatePlan(val) {
      let body = val;
      body['survey_schedule_id'] = this.progress.id;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/survey/plan/submitPlan', body);
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
    async handleFileSuccess(e) {
      if(e.file.size > 5 * 1024 * 1024 ) {
        this.$message.warning('附件大小超过限制，请重新上传！');
      } else if(e.file.type.indexOf('application') > -1 || e.file.type === 'text/csv') {
        if (this.file.length > 4) {
          this.$message.error('附件个数不能传超过5张');
        } else {
          this.$store.commit('setUploadState', false);
          let form = getFile(e);
          try {
            await this.$store.dispatch('uploadFile', form);
            if (this.$store.state.uploadState) {
              this.file.push({
                  id: this.$store.state.fileRes.id,
                  name: this.$store.state.fileRes.file_name,
                  type: this.$store.state.fileRes.type
                });
            }
          } catch (err) {
            return;
          }
        }
      } else {
        this.$message.warning('上传的附件格式有误！');
      } 
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
    submitProductForm() {
      this.form.attachment = [];
      this.file.forEach((item) => {
        let { id } = item;
        this.form.attachment.push(id);
      });
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          this.updatePlan(this.form);
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
