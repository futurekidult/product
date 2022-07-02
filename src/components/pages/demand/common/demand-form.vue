<template>
  <el-form
    ref="demandForm"
    label-width="120px"
    class="demand-form"
    style="width: 60%"
    :model="demandForm"
    :rules="demandRules"
  >
    <el-form-item
      label="产品名称"
      prop="name"
      :rules="[
        { required: true, message: '请输入产品名称' },
        { max: 15, message: '长度不超过 15个字符' }
      ]"
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.name"
        placeholder="输入产品名称"
        :disabled="isDisabled"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="产品图片"
      prop="images"
      class="form-item_width"
    >
      <el-upload
        action
        :show-file-list="false"
        :http-request="handleProductImageSuccess"
      >
        <el-button
          type="primary"
          :disabled="isDisabled"
        >
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        请上传 jpg/png/jepg等图片格式, 单个文件不超过 5MB
      </div>
    </el-form-item>
    <el-form-item 
      v-if="demandForm.images !== []"  
      class="form-item_width"
    >
      <div
        v-for="(item, index) in imagesList"
        :key="index"
        class="attachment-list"
      >
        <div>
          {{ item.name }}
        </div>
        <div style="display: flex">
          <div v-if="type !== 'detail'">
            <el-button
              type="text"
              @click="deleteProductImg(item.id, imagesList)"
            >
              删除
            </el-button>
            <span class="table-btn">|</span>
          </div>
          <el-button
            type="text"
            @click="showViewDialog(item.id)"
          >
            预览
          </el-button>
        </div>
      </div>
    </el-form-item>
    <div class="form-item form-item_width">
      <el-form-item
        label="大品类"
        prop="big_category_id"
      >
        <el-select
          v-model="demandForm.big_category_id"
          placeholder="请选择大品类"
          :disabled="isDisabled"
          clearable
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
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.brand"
        placeholder="请输入品牌"
        :disabled="isDisabled"
        clearable
      />
    </el-form-item>
    <el-scrollbar height="440px">
      <div
        v-for="(item, index) in demandForm.competitive_product"
        :key="index"
        class="form-item_width"
      >
        <el-form-item
          :label="'竞品图片' + (index + 1)"
          :prop="`competitive_product.${index}.images `"
        >
          <el-upload
            action
            :show-file-list="false"
            :http-request="(e) => handleCProductImageSuccess(e, index)"
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
            v-for="(image, idx) in attachment[index].images"
            :key="idx"
            class="attachment-list"
          >
            <div>
              {{ image.name }}
            </div>
            <div style="display: flex">
              <div v-if="type !== 'detail'">
                <el-button
                  type="text"
                  @click="deleteProductImg(image.id, attachment[index].images)"
                >
                  删除
                </el-button>
                <span class="table-btn">|</span>
              </div>
              <el-button
                type="text"
                @click="showViewDialog(image.id)"
              >
                预览
              </el-button>
            </div>
          </div>
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
          />
        </el-form-item>
      </div>
    </el-scrollbar>
    <el-form-item v-if="type === 'create'">
      <el-button @click="addRow">
        + 新增竞品
      </el-button>
      <el-button
        v-if="demandForm.competitive_product.length !== 1"
        type="danger"
        @click="deleteRow"
      >
        - 删除竞品
      </el-button>
    </el-form-item>
    <el-form-item
      label="核心参数"
      prop="parameter"
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.parameter"
        placeholder="请输入核心参数"
        :disabled="isDisabled"
        clearable
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
            />
          </el-form-item>
          <el-form-item prop="product_dimension_w">
            <el-input
              v-model="demandForm.product_dimension_w"
              class="analy-form_mar"
              placeholder="宽度"
              :disabled="isDisabled"
              clearable
            />
          </el-form-item>
          <el-form-item prop="product_dimension_h">
            <el-input
              v-model="demandForm.product_dimension_h"
              placeholder="高度"
              :disabled="isDisabled"
              clearable
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
            />
          </el-form-item>
          <el-form-item prop="packing_dimension_w">
            <el-input
              v-model="demandForm.packing_dimension_w"
              class="analy-form_mar"
              placeholder="宽度"
              :disabled="isDisabled"
              clearable
            />
          </el-form-item>
          <el-form-item prop="packing_dimension_h">
            <el-input
              v-model="demandForm.packing_dimension_h"
              placeholder="高度"
              :disabled="isDisabled"
              clearable
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label="毛重/kg"
        prop="rough_weight"
        class="form-item_width"
      >
        <el-input
          v-model="demandForm.rough_weight"
          placeholder="请输入毛重"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="出货量"
        prop="shipments"
        class="form-item_width"
      >
        <el-input
          v-model="demandForm.shipments"
          placeholder="请输入出货量"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="销售价格"
        style="margin-bottom: 18px"
        :required="isRequired"
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
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.selling_point"
        type="textarea"
        :rows="6"
        placeholder="请输入特别卖点"
        :disabled="isDisabled"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="需求洞察来源"
      prop="demand_source"
      class="form-item_width"
    >
      <el-select
        v-model="demandForm.demand_source"
        type="textarea"
        :rows="6"
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
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.pain_spot"
        placeholder="请输入痛点"
        :disabled="isDisabled"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="需求点"
      prop="demand_point"
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.demand_point"
        type="textarea"
        :rows="6"
        placeholder="请输入需求点"
        :disabled="isDisabled"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="产品信息"
      prop="information"
      class="form-item_width"
    >
      <el-input
        v-model="demandForm.information"
        type="textarea"
        :rows="6"
        placeholder="请输入产品信息"
        :disabled="isDisabled"
        clearable
      />
    </el-form-item>
    <el-form-item v-if="type !== 'detail'">
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
  </el-form>

  <view-dialog
    v-if="viewImgDialog"
    :link="imgLink"
    :visible="viewImgDialog"
    @hide-dialog="closeViewDialog"
  />
</template>

<script>
import { getFile, checkValid } from '../../../../utils';
import ViewDialog from '../../../common/view-dialog.vue';

export default {
  components: {
    ViewDialog
  },
  props: ['type', 'id'],
  data() {
    return {
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
            message: '请选择小品类'
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
            message: '请输入销售价'
          }
        ],
        selling_price_currency: [
          {
            required: true,
            message: '请选择币种'
          }
        ],
        selling_price: [
          {
            required: true,
            message: '请输入采购价'
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
      attachment: [
        {
          images: []
        }
      ],
      currency: [],
      resource: [],
      res: {},
      CRes: {},
      imgLink: '',
      viewImgDialog: false
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
    this.getCategoryList();
    if (this.type === 'detail') {
      this.getDetail();
      this.isDisabled = true;
    } else if (this.type === 'edit') {
      this.getDetail();
      this.getDepartment();
    } else {
      this.getDepartment();
    }
  },
  methods: {
    async getDetail() {
      try {
        await this.$store.dispatch('demand/getDemandDetail', {
          params: {
            demand_id: +this.$route.params.id
          }
        });
        this.demandForm = this.$store.state.demand.demandDetail;
        this.bigCategoryList.map((item) => {
          if (item.id === this.demandForm.big_category_id) {
            this.smallCategoryList = item.children;
          }
        });
        this.imagesList = this.demandForm.images;
        this.attachment = this.demandForm.competitive_product;
      } catch (err) {
        return;
      }
    },
    async getDepartment() {
      try {
        await this.$store.dispatch('getToken');
        await this.$store.dispatch('getUserInfo');
        this.department = this.$store.state.userInfo.center_group;
        this.isRequired = this.department.indexOf(30) > -1;
      } catch (err) {
        return;
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
    async createDemandForm(body) {
      try {
        await this.$store.dispatch('demand/createDemandForm', body);
        this.$router.push('/demand-list');
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
        this.demandRules = Object.assign(this.demandRules,map[this.department[i]]);
      }
      if (Object.keys(this.demandRules).length > 0) {
         Object.assign(this.demandRules, this.commonRules);
      }
    },
    addRow() {
      this.demandForm.competitive_product.push({
        images: []
      });
      this.attachment.push({
        images: []
      });
    },
    deleteRow() {
      this.demandForm.competitive_product.pop();
      this.attachment.pop();
    },
    async handleProductImageSuccess(e) {
      if (this.imagesList.length > 8) {
        this.$message.error('产品图片最多传9张');
      } else {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            this.res = this.$store.state.fileRes;
            this.imagesList.push({
              id: this.res.id,
              name: this.res.file_name,
              type: this.res.type
            });
          }
        } catch (err) {
          return;
        }
      }
    },
    async handleCProductImageSuccess(e, index) {
      if (this.attachment[index].images.length > 0) {
        this.$message.error(`第${index + 1}组竞品中的竞品图片最多传9张`);
      } else {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            this.CRes = this.$store.state.fileRes;
            this.attachment[index].images.push({
              id: this.CRes.id,
              name: this.CRes.file_name,
              type: this.CRes.type
            });
          }
        } catch (err) {
          return;
        }
      }
    },
    deleteProductImg(id, arr) {
      arr.splice(
        arr.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
    },
    submitDemandForm(val) {
      this.demandForm.images = [];
      this.getRules();
      this.imagesList.forEach((item) => {
        let { id } = item;
        this.demandForm.images.push(id);
      });
      for (let index in this.attachment) {
        let imgArr = [];
        let { images } = this.attachment[index];
        for (let i in images) {
          let { id } = images[i];
          imgArr.push(id);
          this.demandForm.competitive_product[index].images = imgArr;
        }
      }
      this.demandRules = val === 10 ? {} : this.demandRules;
      this.$refs.demandForm.validate((valid) => {
        if (valid) {
          let form = this.demandForm;
          form.state = val;
          form.id = +this.$route.params.id;
          this.createDemandForm(form);
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
    async getRmb(val) {
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
    },
    clearMoney(val) {
      this.demandForm[`${val}_price_rmb`] = '';
    },
    clearCurrency(val) {
      this.demandForm[`${val}_price_rmb`] = '';
      this.demandForm[`${val}_price`] = '';
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
  width: 1280px;
  margin: auto;
}
</style>
