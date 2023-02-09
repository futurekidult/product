<template>
  <el-form
    v-if="type === 'create' ? isGetRules : isGetData"
    ref="demandForm"
    label-width="120px"
    class="demand-form"
    :model="demandForm"
    :rules="type === 'create' || type === 'edit' ? demandRules : {}"
  >
    <el-form-item
      label="产品名称"
      prop="name"
      :rules="
        type === 'detail'
          ? []
          : [
            { required: true, message: '请输入产品名称' },
            { max: 15, message: '长度不超过 15个字符' }
          ]
      "
    >
      <el-input
        v-model="demandForm.name"
        placeholder="输入产品名称"
        :disabled="isDisabled"
        clearable
        maxlength="15"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="产品图片"
      prop="images"
      :rules="demandRules.images"
    >
      <base-upload
        type="image"
        :is-disabled="isDisabled"
        :list="imagesList"
        tag="产品图片"
        count="8"
        url="demand-prod-img"
        @get-file="(val) => getUploadFile(val, 'images')"
      />
    </el-form-item>
    <div class="form-item">
      <el-form-item
        label="大品类"
        prop="big_category_id"
        :rules="demandRules.big_category_id"
      >
        <el-select
          v-model="demandForm.big_category_id"
          placeholder="请选择大品类"
          :disabled="isDisabled"
          clearable
          @change="clearSmallCategory"
        >
          <el-option
            v-for="item in bigCategoryList"
            :key="item.id"
            v-loading="$store.state.demand.optionLoading"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="小品类"
        prop="small_category_id"
        :rules="demandRules.small_category_id"
      >
        <el-select
          v-model="demandForm.small_category_id"
          placeholder="请选择小品类"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in smallCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </div>
    <el-form-item
      label="品牌"
      prop="brand"
      :rules="demandRules.brand"
      style="width: 50%"
    >
      <el-input
        v-model="demandForm.brand"
        placeholder="请输入品牌"
        :disabled="isDisabled"
        clearable
        maxlength="15"
        show-word-limit
      />
    </el-form-item>
    <el-collapse
      v-model="active"
      class="form-collapse_item"
      style="margin-left: 15px"
    >
      <el-collapse-item
        title="竞品信息"
        :name="'msg'"
      >
        <div
          v-for="(item, index) in demandForm.competitive_product"
          :key="index"
        >
          <el-form-item
            :label="'竞品图片' + (index + 1)"
            :prop="`competitive_product.${index}.images `"
          >
            <base-upload
              type="image"
              :is-disabled="isDisabled"
              :list="demandForm.competitive_product[index].images"
              tag="竞品图片"
              count="8"
              url="demand-competitive-img"
              @get-file="(val) => getUploadFile(val, 'CPImages', index)"
            />
          </el-form-item>
          <el-form-item
            :label="'竞品链接' + (index + 1)"
            :prop="`competitive_product.${index}.link`"
            :rules="demandRules.link"
          >
            <el-input
              v-model="item.link"
              placeholder="请输入竞品链接"
              type="textarea"
              :rows="6"
              :disabled="isDisabled"
              clearable
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            :label="'竞品参数' + (index + 1)"
            :prop="`competitive_product.${index}.parameter`"
          >
            <el-input
              v-model="item.parameter"
              placeholder="请输入竞品参数"
              type="textarea"
              :rows="6"
              :disabled="isDisabled"
              clearable
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            :label="'对标理由' + (index + 1)"
            :prop="`competitive_product.${index}.benchmarking_reason`"
            :rules="demandRules.benchmarking_reason"
          >
            <el-input
              v-model="item.benchmarking_reason"
              placeholder="请输入对标理由"
              type="textarea"
              :rows="6"
              :disabled="isDisabled"
              clearable
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <base-delete
            :id="index"
            mode="demand-btn"
            content="移除"
            :show="
              demandForm.competitive_product.length > 1 && type !== 'detail'
            "
            :list="demandForm.competitive_product"
            @get-list="getDemandComponentProduct"
          />
        </div>
        <el-form-item v-if="type !== 'detail'">
          <el-button @click="addRow">
            + 新增竞品
          </el-button>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <el-form-item
      label="核心参数"
      prop="parameter"
    >
      <el-input
        v-model="demandForm.parameter"
        placeholder="请输入核心参数"
        :disabled="isDisabled"
        clearable
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
    <div class="demand-form_item">
      <el-form-item
        label="产品尺寸/cm"
        :required="isRequired"
      >
        <div style="display: flex">
          <el-form-item prop="product_dimension_l">
            <el-input
              v-model="demandForm.product_dimension_l"
              class="analy-form_mar"
              placeholder="长度"
              :disabled="isDisabled"
              clearable
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item prop="product_dimension_w">
            <el-input
              v-model="demandForm.product_dimension_w"
              class="analy-form_mar"
              placeholder="宽度"
              :disabled="isDisabled"
              clearable
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item prop="product_dimension_h">
            <el-input
              v-model="demandForm.product_dimension_h"
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
        label="包装尺寸/cm"
        :required="isRequired"
      >
        <div style="display: flex">
          <el-form-item prop="packing_dimension_l">
            <el-input
              v-model="demandForm.packing_dimension_l"
              class="analy-form_mar"
              placeholder="长度"
              :disabled="isDisabled"
              clearable
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item prop="packing_dimension_w">
            <el-input
              v-model="demandForm.packing_dimension_w"
              class="analy-form_mar"
              placeholder="宽度"
              :disabled="isDisabled"
              clearable
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item prop="packing_dimension_h">
            <el-input
              v-model="demandForm.packing_dimension_h"
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
        label="毛重/kg"
        prop="rough_weight"
      >
        <el-input
          v-model="demandForm.rough_weight"
          placeholder="请输入毛重"
          :disabled="isDisabled"
          clearable
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="出货量"
        prop="shipments"
      >
        <el-input
          v-model="demandForm.shipments"
          placeholder="请输入出货量"
          :disabled="isDisabled"
          clearable
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="销售价格"
        style="margin-bottom: 18px"
      >
        <div style="display: flex">
          <el-form-item prop="selling_price_currency">
            <el-select
              v-model="demandForm.selling_price_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              :disabled="isDisabled"
              clearable
              @clear="clearCurrency('selling')"
              @change="changeCurrency('selling')"
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="selling_price">
            <el-input
              v-model="demandForm.selling_price"
              class="analy-form_mar"
              placeholder="请输入金额"
              :disabled="isDisabled"
              clearable
              @change="getRmb('selling')"
              @clear="clearMoney('selling')"
            />
          </el-form-item>
          <el-form-item prop="selling_price_rmb">
            <el-input
              v-model="demandForm.selling_price_rmb"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label="采购价格"
        style="margin-bottom: 18px"
        :required="isRequired"
      >
        <div style="display: flex">
          <el-form-item prop="purchase_price_currency">
            <el-select
              v-model="demandForm.purchase_price_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              :disabled="isDisabled"
              clearable
              @clear="clearCurrency('purchase')"
              @change="changeCurrency('purchase')"
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="purchase_price">
            <el-input
              v-model="demandForm.purchase_price"
              class="analy-form_mar"
              placeholder="请输入金额"
              :disabled="isDisabled"
              clearable
              @change="getRmb('purchase')"
              @clear="clearMoney('purchase')"
            />
          </el-form-item>
          <el-form-item prop="purchase_price_rmb">
            <el-input
              v-model="demandForm.purchase_price_rmb"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
    </div>
    <el-form-item
      label="特别卖点"
      prop="selling_point"
    >
      <el-input
        v-model="demandForm.selling_point"
        type="textarea"
        :rows="6"
        placeholder="请输入特别卖点"
        :disabled="isDisabled"
        clearable
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="需求洞察来源"
      prop="demand_source"
      style="width: 50%"
    >
      <el-select
        v-model="demandForm.demand_source"
        placeholder="请选择需求洞察来源"
        :disabled="isDisabled"
        clearable
      >
        <el-option
          v-for="item in resource"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="痛点"
      prop="pain_spot"
    >
      <el-input
        v-model="demandForm.pain_spot"
        placeholder="请输入痛点"
        :disabled="isDisabled"
        clearable
        :rows="6"
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="需求点"
      prop="demand_point"
    >
      <el-input
        v-model="demandForm.demand_point"
        type="textarea"
        :rows="6"
        placeholder="请输入需求点"
        :disabled="isDisabled"
        clearable
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="产品信息"
      prop="information"
    >
      <el-input
        v-model="demandForm.information"
        type="textarea"
        :rows="6"
        placeholder="请输入产品信息"
        :disabled="isDisabled"
        clearable
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item v-if="type === 'create' || type === 'edit'">
      <el-button
        class="draft-btn"
        @click="submitDemandForm(10)"
      >
        保存草稿
      </el-button>
      <el-button
        type="primary"
        @click="submitDemandForm(20)"
      >
        提交
      </el-button>
    </el-form-item>
    <el-form-item v-else>
      <el-button
        v-if="type === 'review'"
        type="primary"
        @click="updateDemandForm"
      >
        保存
      </el-button>
    </el-form-item>
    <div v-if="type !== 'review' && demandForm.state > 20">
      <el-divider />
      <div class="pass-form_title">
        会议附件内容
      </div>
      <el-form-item
        label="会议纪要"
        prop="meeting_summary_file"
      >
        <base-upload
          type="file"
          tag="会议纪要"
          url="meeting-file"
          :file="file"
          :is-disabled="isDisabled"
          @get-file="(val) => getUploadFile(val)"
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { checkValid } from '../../../../utils';
import { getDemandDetail } from '../../../../utils/demand';

export default {
  props: ['type', 'id'],
  data() {
    return {
      file: {},
      demandForm: {
        images: [],
        competitive_product: [
          {
            images: []
          }
        ]
      },
      commonRules: {
        big_category_id: [
          {
            required: true,
            message: '请选择大品类'
          }
        ],
        small_category_id: [
          {
            required: true,
            message: '请选择小品类',
            trigger: 'blur'
          }
        ],
        brand: [
          {
            required: true,
            message: '请输入品牌'
          },
          checkValid(15)
        ]
      },
      imagesList: [],
      department: {},
      operationDepartment: {
        link: [
          {
            required: true,
            message: '请输入产品链接'
          },
          checkValid(200)
        ],
        benchmarking_reason: [
          {
            required: true,
            message: '请输入对标理由'
          },
          checkValid(200)
        ]
      },
      supplyChainDepartment: {
        images: [
          {
            required: true,
            message: '请上传产品图片'
          }
        ],
        shipments: [
          {
            required: true,
            message: '请输入出货量'
          }
        ],
        purchase_price_currency: [
          {
            required: true,
            message: '请选择币种'
          }
        ],
        purchase_price: [
          {
            required: true,
            message: '请输入采购价',
            trigger: 'blur'
          }
        ],
        selling_point: [
          {
            required: true,
            message: '请输入特别卖点'
          },
          checkValid(200)
        ],
        product_dimension_l: [
          {
            required: true,
            message: '请输入长度'
          },
          checkValid(15)
        ],
        product_dimension_w: [
          {
            required: true,
            message: '请输入宽度'
          },
          checkValid(15)
        ],
        product_dimension_h: [
          {
            required: true,
            message: '请输入高度'
          },
          checkValid(15)
        ],
        packing_dimension_l: [
          {
            required: true,
            message: '请输入长度'
          },
          checkValid(15)
        ],
        packing_dimension_w: [
          {
            required: true,
            message: '请输入宽度'
          },
          checkValid(15)
        ],
        packing_dimension_h: [
          {
            required: true,
            message: '请输入高度'
          },
          checkValid(15)
        ],
        rough_weight: [
          {
            required: true,
            message: '请输入毛重'
          },
          checkValid(15)
        ],
        parameter: [
          {
            required: true,
            message: '请输入核心参数'
          },
          checkValid(50)
        ]
      },
      saleDepartment: {
        images: [
          {
            required: true,
            message: '请上传产品图片'
          }
        ],
        demand_source: [
          {
            required: true,
            message: '请选择来源'
          }
        ],
        pain_spot: [
          {
            required: true,
            message: '请输入痛点'
          },
          checkValid(200)
        ],
        demand_point: [
          {
            required: true,
            message: '请输入需求点'
          },
          checkValid(200)
        ],
        information: [
          {
            required: true,
            message: '请输入产品信息'
          },
          checkValid(200)
        ]
      },
      isDisabled: false,
      demandRules: {},
      isRequired: false,
      bigCategoryList: [],
      smallCategoryList: [],
      currency: [],
      resource: [],
      res: {},
      CRes: {},
      isGetRules: false,
      isGetData: false,
      active: 'msg'
    };
  },
  computed: {
    getBigCategory() {
      return this.demandForm.big_category_id;
    }
  },
  watch: {
    getBigCategory(val) {
      this.bigCategoryList.map((item) => {
        if (item.id === val) {
          this.smallCategoryList = item.children;
        }
      });
    }
  },
  mounted() {
    this.getParams();
    this.getDepartment();
    if (this.type !== 'create') {
      this.getDetail();
    } else {
      this.getCategoryList();
    }
  },
  methods: {
    async getDetail() {
      let demandForm = this.$store.state.demand.demandDetail;
      if (JSON.stringify(demandForm) === '{}') {
        let type =
          this.$route.path.indexOf('review') > -1 ? 'review' : 'detail';
        await getDemandDetail(this.$route.params.id, type, false);
      }
      this.demandForm = this.$store.state.demand.demandDetail;
      this.file = this.demandForm.meeting_summary_file;
      this.$store.commit('demand/setDemandDetailLoading', false);
      if (this.type === 'detail') {
        this.isDisabled = true;
      }
      this.bigCategoryList = this.$store.state.demand.categoryList;
      this.bigCategoryList.map((item) => {
        if (item.id === this.demandForm.big_category_id) {
          this.smallCategoryList = item.children;
        }
      });
      this.imagesList = this.demandForm.images;
      this.isGetData = true;
    },
    async getDepartment() {
      this.department = JSON.parse(localStorage.getItem('center_group'));
      this.isRequired =
        this.department.indexOf(30) > -1 &&
        (this.type === 'create' || this.type === 'edit');
      if (this.type === 'review') {
        this.demandRules = Object.assign(this.demandRules, this.commonRules);
        this.demandRules = Object.assign(this.demandRules, {
          images: [
            {
              required: true,
              message: '请上传产品图片'
            }
          ]
        });
      } else if (this.type !== 'detail') {
        this.getRules();
      }
    },
    async getCategoryList() {
      try {
        await this.$store.dispatch('demand/getCategoryList');
        this.bigCategoryList = this.$store.state.demand.categoryList;
      } catch (err) {
        return;
      }
    },
    async createDemandForm(body, type) {
      try {
        await this.$store.dispatch('demand/createDemandForm', body);
        if (type === 10) {
          this.$router.push('/draft-list');
        } else {
          this.$router.push('/demand-list');
        }
      } catch (err) {
        return;
      }
    },
    getRules() {
      let map = {
        10: this.operationDepartment,
        20: this.operationDepartment,
        30: this.supplyChainDepartment,
        40: this.saleDepartment
      };
      for (let i = 0; i < this.department.length; i++) {
        if (this.department[i] === 100) {
          continue;
        }
        this.demandRules = Object.assign(
          this.demandRules,
          map[this.department[i]]
        );
      }
      if (Object.keys(this.demandRules).length > 0) {
        Object.assign(this.demandRules, this.commonRules);
      }
      this.isGetRules = true;
    },
    addRow() {
      this.demandForm.competitive_product.push({
        images: []
      });
    },
    getForm(str, val) {
      let form = JSON.parse(JSON.stringify(this.demandForm));
      let fileArr = JSON.parse(JSON.stringify(form.competitive_product));
      for (let index in fileArr) {
        let imgArr = [];
        let { images } = fileArr[index];
        for (let i in images) {
          let { id } = images[i];
          imgArr.push(id);
          form.competitive_product[index].images = imgArr;
        }
      }
      if (str !== 'review') {
        form.state = val;
      }
      form.id = +this.$route.params.id;
      return form;
    },
    getProductImages() {
      let imgArr = [];
      this.imagesList.forEach((item) => {
        let { id } = item;
        imgArr.push(id);
      });
      this.demandForm.images = imgArr;
    },
    submitDemandForm(val) {
      this.getProductImages();
      this.demandRules = val === 10 ? {} : this.demandRules;
      this.$refs.demandForm.validate((valid) => {
        if (valid) {
          let form = this.getForm('create', val);
          this.createDemandForm(form, val);
        }
      });
    },
    async getParams() {
      if (localStorage.getItem('params')) {
        let { demand } = JSON.parse(localStorage.getItem('params'));
        this.currency = demand.currency;
        this.resource = demand.resource;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getRmb(val) {
      if (
        this.demandForm[`${val}_price`] &&
        this.demandForm[`${val}_price_currency`]
      ) {
        try {
          await this.$store.dispatch('getPriceRmb', {
            params: {
              price: this.demandForm[`${val}_price`],
              currency: this.demandForm[`${val}_price_currency`]
            }
          });
          this.demandForm[`${val}_price_rmb`] = this.$store.state.priceRmb;
        } catch (err) {
          return;
        }
      }
    },
    clearMoney(val) {
      this.demandForm[`${val}_price_rmb`] = '';
    },
    changeCurrency(val) {
      this.getRmb(val);
    },
    clearCurrency(val) {
      this.demandForm[`${val}_price_rmb`] = '';
      this.demandForm[`${val}_price`] = '';
    },
    clearSmallCategory() {
      this.demandForm.small_category_id = '';
    },
    async updateReviewDemand(body) {
      await this.$store.dispatch('demand/updateDemandForm', body);
    },
    updateDemandForm() {
      this.getProductImages();
      this.$refs.demandForm.validate((valid) => {
        if (valid) {
          let form = this.getForm('review');
          this.updateReviewDemand(form);
        }
      });
    },
    getDemandComponentProduct(val) {
      this.demandForm.competitive_product = val;
    },
    getUploadFile(e, str, idx) {
      if (str === 'CPImages') {
        this.demandForm.competitive_product[idx].images = e;
      } else {
        this.imagesList = e;
      }
    }
  }
};
</script>

<style scoped>
.tip {
  font-size: 12px;
  color: #606266;
  margin-left: 10px;
}

.demand-form {
  width: 70%;
}

.form-collapse_item {
  padding: 0px 0 0 45px;
  margin: 18px 0;
}
</style>
