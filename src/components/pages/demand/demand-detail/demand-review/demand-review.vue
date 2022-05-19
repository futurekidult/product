<template>
  <el-form
    ref="reviewForm"
    :model="reviewForm"
    label-width="120px"
    style="width: 70%"
    :rules="getRules"
  >
    <el-form-item
      label="评审结果"
      prop="state"
    >
      <el-select
        v-model="reviewForm.state"
        style="width: 30%"
      >
        <el-option
          v-for="item in reviewOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <div v-if="reviewForm.state === 1">
      <el-divider />
      <div class="pass-form_title">
        填写补充信息
      </div>
      <el-form-item
        label="是否为新品类"
        prop="is_new_category"
      >
        <el-radio
          v-for="item in options"
          :key="item.value"
          v-model="reviewForm.is_new_category"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="是否为新产品"
        prop="is_new_product"
      >
        <el-radio
          v-for="item in options"
          :key="item.value"
          v-model="reviewForm.is_new_product"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <div
        v-for="(item, index) in reviewForm.market"
        :key="index"
      >
        <el-form-item
          :label="'市场' + (index + 1)"
          :prop="`market.${index}.market_id`"
          :rules="passRules.market_id"
        >
          <el-input
            v-model="item.market_id"
            placeholder="请选择市场"
            style="width: 30%"
          />
        </el-form-item>
        <el-form-item
          :label="'平台' + (index + 1)"
          :prop="`market.${index}.platform`"
          :rules="passRules.platform"
        >
          <el-checkbox-group v-model="item.platform">
            <el-checkbox
              v-for="(content, i) in platform"
              :key="i"
              :label="content.key"
            >
              {{ content.value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button @click="addRow">
          + 新增市场
        </el-button>
        <el-button
          type="danger"
          @click="deleteRow"
        >
          - 删除市场
        </el-button>
      </el-form-item>
      <el-divider />
      <div class="pass-form_title">
        调研计划完成时间
      </div>
      <div class="form-item">
        <el-form-item
          v-if="isNewProduct"
          label="市场调研"
          prop="market_survey_time"
        >
          <el-date-picker
            v-model="reviewForm.market_survey_time"
            type="datetime"
            placeholder="请选择日期"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item
          label="平台调研"
          prop="platform_survey_time"
        >
          <el-date-picker
            v-model="reviewForm.platform_survey_time"
            type="datetime"
            placeholder="请选择日期"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item
          v-if="isNewCategoryIsNewProduct"
          label="用户分析"
          prop="user_analysis_time"
        >
          <el-date-picker
            v-model="reviewForm.user_analysis_time"
            type="datetime"
            placeholder="请选择日期"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item
          v-if="isNewCategory"
          label="产品方案"
          prop="product_solutions_time"
        >
          <el-date-picker
            v-model="reviewForm.product_solutions_time"
            type="datetime"
            placeholder="请选择日期"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item
          label="风险调研"
          prop="risk_survey_time"
        >
          <el-date-picker
            v-model="reviewForm.risk_survey_time"
            type="datetime"
            placeholder="请选择日期"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item
          v-if="isNewCategory"
          label="用户调研"
          prop="user_survey_time"
        >
          <el-date-picker
            v-model="reviewForm.user_survey_time"
            type="datetime"
            placeholder="请选择日期"
            style="width: 80%"
          />
        </el-form-item>
      </div>
      <el-divider />
      <div class="pass-form_title">
        设置项目成员
      </div>
      <div class="form-item">
        <el-form-item
          label="项目总监"
          prop="project_director_id"
        >
          <el-select
            v-model="reviewForm.project_director_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="运营总监"
          prop="coo_id"
        >
          <el-select
            v-model="reviewForm.coo_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="营销总监"
          prop="cmo_id"
        >
          <el-select
            v-model="reviewForm.cmo_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="供应链总监"
          prop="cpo_id"
        >
          <el-select
            v-model="reviewForm.cpo_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="项目经理"
          prop="project_manager_id"
        >
          <el-select
            v-model="reviewForm.project_manager_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="项目管理员"
          prop="project_administrator_id"
        >
          <el-select
            v-model="reviewForm.project_administrator_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="运营负责人"
          prop="operations_principal_id"
        >
          <el-select
            v-model="reviewForm.operations_principal_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="产品负责人"
          prop="product_principal_id"
        >
          <el-select
            v-model="reviewForm.product_principal_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="采购负责人"
          prop="purchase_principal_id"
        >
          <el-select
            v-model="reviewForm.purchase_principal_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="市研负责人"
          prop="market_survey_principal_id"
        >
          <el-select
            v-model="reviewForm.market_survey_principal_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="用研负责人"
          prop="user_survey_principal_id"
        >
          <el-select
            v-model="reviewForm.user_survey_principal_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="用测负责人"
          prop="user_test_principal_id"
        >
          <el-select
            v-model="reviewForm.user_test_principal_id"
            class="pass-form_item"
            placeholder="请选择人员"
          />
        </el-form-item>
        <el-form-item
          label="品质负责人"
          prop="quality_principal_id"
        >
          <el-select
            v-model="reviewForm.quality_principal_id"
            class="pass-form_item"
            placeholder="请选择人员 "
          />
        </el-form-item>
      </div>
    </div>
    <div v-if="reviewForm.state === 0">
      <el-divider />
      <el-form-item
        label="不通过原因"
        prop="failed_reason"
      >
        <el-input
          v-model="reviewForm.failed_reason"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitDemandForm"
        >
          提交
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      reviewForm: {
        market: [{}]
      },
      reviewOptions: [
        {
          label: '不通过',
          value: 0
        },
        {
          label: '通过',
          value: 1
        }
      ],
      isNewCategory: false,
      isNewProduct: false,
      isNewCategoryIsNewProduct: false,
      failRules: {
        state: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        failed_reason: [
          {
            required: true,
            message: '请输入内容'
          }
        ]
      },
      passRules: {
        state: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        is_new_category: [
          {
            required: true,
            message: '请选择'
          }
        ],
        is_new_product: [
          {
            required: true,
            message: '请选择'
          }
        ],
        market_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        platform: [
          {
            required: true,
            message: '请选择'
          }
        ],
        market_survey_time: [
          {
            required: true,
            message: '请选择'
          }
        ],
        platform_survey_time: [
          {
            required: true,
            message: '请选择'
          }
        ],
        user_analysis_time: [
          {
            required: true,
            message: '请选择'
          }
        ],
        product_solutions_time: [
          {
            required: true,
            message: '请选择'
          }
        ],
        risk_survey_time: [
          {
            required: true,
            message: '请选择'
          }
        ],
        user_survey_time: [
          {
            required: true,
            message: '请选择'
          }
        ],
        project_director_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        coo_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        cmo_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        cpo_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        project_manager_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        project_administrator_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        operations_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        purchase_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        product_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        quality_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ]
      },
      categoryRules: {
        user_survey_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        user_test_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ]
      },
      productRules: {
        market_survey_principal_id: [
          {
            required: true,
            message: '请选择'
          }
        ]
      },
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      market: [
        {
          key: 1,
          value: '美国'
        },
        {
          key: 2,
          value: '英国'
        },
        {
          key: 3,
          value: '欧盟'
        },
        {
          key: 4,
          value: '日本'
        }
      ],
      platform: [
        {
          key: 1,
          value: 'Amazon'
        },
        {
          key: 2,
          value: 'Lowe\'s'
        },
        {
          key: 3,
          value: 'Wayfair'
        },
        {
          key: 4,
          value: 'Walmart'
        },
        {
          key: 5,
          value: 'Homedepot'
        }
      ]
    };
  },
  computed: {
    getRules() {
      return this.reviewForm.state === 0 ? this.failRules : this.passRules;
    },
    getCategory() {
      return this.reviewForm.is_new_category;
    },
    getProduct() {
      return this.reviewForm.is_new_product;
    },
    getPosition() {
      return (
        String(this.reviewForm.is_new_category) +
        String(this.reviewForm.is_new_product)
      );
    }
  },
  watch: {
    getCategory(val) {
      console.log(val);
      if (val === 1) {
        this.isNewCategory = true;
        this.passRules = Object.assign(this.passRules, this.categoryRules);
      } else {
        this.isNewCategory = false;
      }
    },
    getProduct(val) {
      if (val === 1) {
        this.isNewProduct = true;
        this.passRules = Object.assign(this.passRules, this.productRules);
      } else {
        this.isNewProduct = false;
      }
    },
    getPosition(val) {
      if (val === '11') {
        this.isNewCategoryIsNewProduct = true;
      } else {
        this.isNewCategoryIsNewProduct = false;
      }
    }
  },
  methods: {
    async reviewDemandForm(val) {
      let body = val;
      body['demand_id'] = +this.$route.params.id;
      await this.$store.dispatch('demand/reviewDemandForm', body);
    },
    submitDemandForm() {
      this.$refs.reviewForm.validate((valid) => {
        if (valid) {
          this.reviewDemandForm(this.reviewForm);
        }
      });
    },
    addRow() {
      this.reviewForm.market.push({});
    },
    deleteRow() {
      this.reviewForm.market.pop();
    }
    // isShow(isNewCategory, isNewProduct) {
    //   if (isNewCategory === 1 && isNewProduct === 1) {
    //     return true;
    //   } else if (isNewCategory === 1 && isNewProduct === 0) {
    //     return true;
    //   } else if (isNewCategory === 0 && isNewProduct === 1) {
    //     return true;
    //   }
    // }
  }
};
</script>

<style scoped>
.pass-form_item {
  width: 80%;
}

.pass-form_title {
  font-size: 14px;
  margin: 15px;
}
</style>
