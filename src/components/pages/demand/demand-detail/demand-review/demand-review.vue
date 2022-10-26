<template>
  <div v-loading="$store.state.demand.demandDetailLoading">
    <div class="border">
      <div class="detail-title">
        {{ demandDetail.name }}
        <div class="tag-position">
          <base-tag
            class="tag"
            :mode="changeDemandColor(demandDetail.state)"
          >
            {{ demandDetail.state_desc }}
          </base-tag>
        </div>
      </div>

      <el-descriptions :column="4">
        <el-descriptions-item
          v-if="demandDetail.state === 30"
          label="关联产品:"
        >
          <el-button
            type="text"
            @click="toProductDetail(demandDetail.product_id)"
          >
            查看
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="创建人:">
          {{ demandDetail.creator_desc }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间:">
          {{ demandDetail.create_time }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="border">
      <div class="select-title review-msg">
        <div><span class="line">|</span> 需求信息</div>
        <div>
          <el-button
            v-if="!show"
            type="text"
            @click="showForm"
          >
            展开内容
          </el-button>
          <el-button
            v-else
            type="text"
            @click="show = !show"
          >
            收起内容
          </el-button>
        </div>
      </div>
      <demand-form
        v-if="show"
        type="review"
      />
      <el-form
        ref="reviewForm"
        :model="reviewForm"
        label-width="120px"
        style="width: 70%"
        :rules="rules"
      >
        <el-form-item
          label="评审结果"
          prop="state"
        >
          <el-select
            v-model="reviewForm.state"
            style="width: 30%"
            clearable
            placeholder="请选择评审结果"
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
              :rules="rules.market_id"
            >
              <el-select
                v-model="item.market_id"
                placeholder="请选择市场"
                style="width: 30%"
                clearable
                @change="clearPlatform(index)"
              >
                <el-option
                  v-for="market in market"
                  :key="market.key"
                  :label="market.value"
                  :value="market.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="'平台' + (index + 1)"
              :prop="`market.${index}.platform`"
              :rules="rules.platform"
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
            <base-delete
              :id="index"
              mode="demand-btn"
              content="移除"
              :show="reviewForm.market.length > 1"
              :list="reviewForm.market"
              @get-list="getReviewFormMarket"
            />
          </div>
          <el-form-item>
            <el-button @click="addRow">
              + 新增市场
            </el-button>
          </el-form-item>
          <el-divider />
          <div class="pass-form_title">
            调研计划完成时间
          </div>
          <div class="form-item">
            <el-form-item
              v-if="isNewCategory"
              label="市场调研"
              prop="market_survey_time"
            >
              <el-date-picker
                v-model="reviewForm.market_survey_time"
                type="datetime"
                placeholder="请选择日期"
                style="width: 100%"
                clearable
                :default-time="$global.defaultTime"
                :disabled-date="setDisabledDate"
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
                style="width: 100%"
                clearable
                :default-time="$global.defaultTime"
                :disabled-date="setDisabledDate"
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
                style="width: 100%"
                clearable
                :default-time="$global.defaultTime"
                :disabled-date="setDisabledDate"
              />
            </el-form-item>
            <el-form-item
              v-if="isNewProduct"
              label="产品方案"
              prop="product_solutions_time"
            >
              <el-date-picker
                v-model="reviewForm.product_solutions_time"
                type="datetime"
                placeholder="请选择日期"
                style="width: 100%"
                clearable
                :default-time="$global.defaultTime"
                :disabled-date="setDisabledDate"
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
                style="width: 100%"
                clearable
                :default-time="$global.defaultTime"
                :disabled-date="setDisabledDate"
              />
            </el-form-item>
            <el-form-item
              v-if="isNewProduct"
              label="用户调研"
              prop="user_survey_time"
            >
              <el-date-picker
                v-model="reviewForm.user_survey_time"
                type="datetime"
                placeholder="请选择日期"
                style="width: 100%"
                clearable
                :default-time="$global.defaultTime"
                :disabled-date="setDisabledDate"
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
              <el-tree-select
                v-model="reviewForm.project_director_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="运营总监"
              prop="coo_id"
            >
              <el-tree-select
                v-model="reviewForm.coo_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="营销总监"
              prop="cmo_id"
            >
              <el-tree-select
                v-model="reviewForm.cmo_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="供应链总监"
              prop="cpo_id"
            >
              <el-tree-select
                v-model="reviewForm.cpo_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="项目经理"
              prop="project_manager_id"
            >
              <el-tree-select
                v-model="reviewForm.project_manager_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="项目管理员"
              prop="project_administrator_id"
            >
              <el-tree-select
                v-model="reviewForm.project_administrator_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="运营主管"
              prop="operations_supervisor_id"
            >
              <el-tree-select
                v-model="reviewForm.operations_supervisor_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="运营专员"
              prop="operations_specialist_id"
            >
              <el-tree-select
                v-model="reviewForm.operations_specialist_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="产品负责人"
              prop="product_principal_id"
            >
              <el-tree-select
                v-model="reviewForm.product_principal_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="采购负责人"
              prop="purchase_principal_id"
            >
              <el-tree-select
                v-model="reviewForm.purchase_principal_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="市研负责人"
              prop="market_survey_principal_id"
              :rules="
                isNewCategoryFlag ? productRules.market_survey_principal_id : []
              "
            >
              <el-tree-select
                v-model="reviewForm.market_survey_principal_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="用研负责人"
              prop="user_survey_principal_id"
              :rules="
                isNewProductFlag ? categoryRules.user_survey_principal_id : []
              "
            >
              <el-tree-select
                v-model="reviewForm.user_survey_principal_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="用测负责人"
              prop="user_test_principal_id"
              :rules="
                isNewProductFlag ? categoryRules.user_test_principal_id : []
              "
            >
              <el-tree-select
                v-model="reviewForm.user_test_principal_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
            <el-form-item
              label="品质负责人"
              prop="quality_principal_id"
            >
              <el-tree-select
                v-model="reviewForm.quality_principal_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
                class="review-form_item"
              />
            </el-form-item>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitDemandForm"
            >
              提交
            </el-button>
          </el-form-item>
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
              clearable
              maxlength="200"
              show-word-limit
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
    </div>
  </div>
</template>
<script>
import {
  timestamp,
  getOrganizationList,
  changeDemandColor,
  setDisabledDate
} from '../../../../../utils';

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
      isNewCategoryFlag: false,
      isNewProductFlag: false,
      rules: {
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
        operations_supervisor_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        operations_specialist_id: [
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
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      show: true
    };
  },
  computed: {
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
    },
    demandDetail() {
      return this.$store.state.demand.demandDetail;
    }
  },
  watch: {
    getCategory(val) {
      if (val === 1) {
        this.isNewCategory = true;
        this.isNewCategoryFlag = true;
      } else {
        this.isNewCategory = false;
        this.isNewCategoryFlag = false;
      }
    },
    getProduct(val) {
      if (val === 1) {
        this.isNewProduct = true;
        this.isNewProductFlag = true;
      } else {
        this.isNewProduct = false;
        this.isNewProductFlag = false;
      }
    },
    getPosition(val) {
      if (val === '11') {
        this.isNewCategoryIsNewProduct = true;
      } else {
        this.isNewCategoryIsNewProduct = false;
      }
    },
    'reviewForm.state'(val) {
      if (val === 1) {
        this.getDefaultMember(val);
      }
    }
  },
  mounted() {
    this.getMarket();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    changeDemandColor,
    setDisabledDate,
    async reviewDemandForm(val) {
      let body = val;
      body['demand_id'] = +this.$route.params.id;
      try {
        await this.$store.dispatch('demand/reviewDemandForm', body);
        this.$router.push('/demand-list');
      } catch (err) {
        return;
      }
    },
    submitDemandForm() {
      let timeForm = JSON.parse(JSON.stringify(this.reviewForm));
      for (let item of Object.keys(timeForm)) {
        if (item.indexOf('time') !== -1) {
          timeForm[item] = timestamp(timeForm[item]);
        }
      }
      this.$refs.reviewForm.validate((valid) => {
        if (valid) {
          this.reviewDemandForm(timeForm);
        }
      });
    },
    addRow() {
      this.reviewForm.market.push({});
    },
    async getMarket() {
      if (localStorage.getItem('params')) {
        let { demand } = JSON.parse(localStorage.getItem('params'));
        this.market = demand.market;
        this.platform = demand.platform;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getMarket();
        } catch (err) {
          return;
        }
      }
    },
    clearPlatform(index) {
      if (this.reviewForm.market[index].platform) {
        this.reviewForm.market[index].platform.length = 0;
      }
    },
    showForm() {
      this.show = !this.show;
    },
    getReviewFormMarket(val) {
      this.reviewForm.market = val;
    },
    toProductDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    },
    async getDefaultMember(val) {
      try {
        await this.$store.dispatch('demand/getDefaultMember');
        let { defaultMember } = this.$store.state.demand;
        for (let i in defaultMember) {
          if (defaultMember[i] === 0) {
            defaultMember[i] = '';
          }
        }
        this.reviewForm = defaultMember;
        this.reviewForm.state = val;
        this.reviewForm.market = [{}];
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style scoped>
.review-form_item {
  width: 100%;
}

.pass-form_title {
  font-size: 14px;
  margin: 15px;
}

.review-msg {
  display: flex;
  justify-content: space-between;
  background: #f6f6f6;
  padding: 15px;
}
</style>
