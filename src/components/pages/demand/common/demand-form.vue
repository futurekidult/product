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
      :rules="[{ required: true, message: '请输入产品名称' }]"
    >
      <el-input
        v-model="demandForm.name"
        placeholder="输入产品名称"
        :disabled="isDisabled"
      />
    </el-form-item>
    <el-form-item
      label="产品图片"
      prop="images"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleProductImageSuccess"
        :limit="9"
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
    <el-form-item v-if="demandForm.images !== []">
      <div
        v-for="(item, index) in imagesList"
        :key="index"
        class="attachment-list"
      >
        <div>
          {{ item.name }}
        </div>
        <el-button
          v-if="type === 'create'"
          type="text"
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
    <div class="demand-form_item">
      <el-form-item
        label="大品类"
        prop="big_category"
      >
        <el-select
          v-model="demandForm.big_category"
          placeholder="请选择大品类"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="小品类"
        prop="small_category"
      >
        <el-select
          v-model="demandForm.small_category"
          placeholder="请选择小品类"
          :disabled="isDisabled"
        />
      </el-form-item>
    </div>
    <el-form-item
      label="品牌"
      prop="brand"
    >
      <el-input
        v-model="demandForm.brand"
        placeholder="请输入品牌"
        :disabled="isDisabled"
      />
    </el-form-item>
    <el-scrollbar height="400px">
      <div
        v-for="(item, index) in demandForm.competitive_product"
        :key="index"
      >
        <el-form-item
          :label="'竞品图片' + (index + 1)"
          :prop="`competitive_product.${index}.images`"
        >
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :limit="9"
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
        <el-form-item v-if="item.images !== []">
          <div
            v-for="(images, idx) in item.images"
            :key="idx"
            class="attachment-list"
          >
            <div>
              {{ images.name }}
            </div>
            <el-button
              v-if="type === 'create'"
              type="text"
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
          />
        </el-form-item>
        <el-form-item
          :label="'对标理由' + (index + 1)"
          :prop="`competitive_product.${index}.reason`"
          :rules="demandRules.reason"
        >
          <el-input
            v-model="item.reason"
            placeholder="请输入对标理由"
            type="textarea"
            :rows="6"
            :disabled="isDisabled"
          />
        </el-form-item>
      </div>
    </el-scrollbar>
    <el-form-item v-if="type === 'create'">
      <el-button @click="addRow">
        + 新增竞品
      </el-button>
      <el-button
        type="danger"
        @click="deleteRow"
      >
        - 删除竞品
      </el-button>
    </el-form-item>
    <el-form-item
      label="核心参数"
      prop="parameter"
    >
      <el-input
        v-model="demandForm.parameter"
        placeholder="请输入核心参数"
        :disabled="isDisabled"
      />
    </el-form-item>
    <div class="demand-form_item">
      <el-form-item label="产品尺寸/cm">
        <div style="display: flex">
          <el-form-item prop="product_dimension_l">
            <el-input
              v-model="demandForm.product_dimension_l"
              class="analy-form_mar"
              placeholder="长度"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item prop="product_dimension_w">
            <el-input
              v-model="demandForm.product_dimension_w"
              class="analy-form_mar"
              placeholder="宽度"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item prop="product_dimension_h">
            <el-input
              v-model="demandForm.product_dimension_h"
              placeholder="高度"
              :disabled="isDisabled"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="包装尺寸/cm">
        <div style="display: flex">
          <el-form-item prop="packing_dimension_l">
            <el-input
              v-model="demandForm.packing_dimension_l"
              class="analy-form_mar"
              placeholder="长度"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item prop="packing_dimension_w">
            <el-input
              v-model="demandForm.packing_dimension_w"
              class="analy-form_mar"
              placeholder="宽度"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item prop="packing_dimension_h">
            <el-input
              v-model="demandForm.packing_dimension_h"
              placeholder="高度"
              :disabled="isDisabled"
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
            />
          </el-form-item>
          <el-form-item prop="selling_price">
            <el-input
              v-model="demandForm.selling_price"
              class="analy-form_mar"
              placeholder="请输入金额"
              :disabled="isDisabled"
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
      >
        <div style="display: flex">
          <el-form-item prop="purchase_price_currency">
            <el-select
              v-model="demandForm.purchase_price_currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item prop="purchase_price">
            <el-input
              v-model="demandForm.purchase_price"
              class="analy-form_mar"
              placeholder="请输入金额"
              :disabled="isDisabled"
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
      />
    </el-form-item>
    <el-form-item
      label="需求洞察来源"
      prop="source"
    >
      <el-select
        v-model="demandForm.source"
        type="textarea"
        :rows="6"
        placeholder="请选择需求洞察来源"
        :disabled="isDisabled"
      />
    </el-form-item>
    <el-form-item
      label="痛点"
      prop="pain_spot"
    >
      <el-input
        v-model="demandForm.pain_spot"
        placeholder="请输入痛点"
        :disabled="isDisabled"
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
      />
    </el-form-item>
    <el-form-item v-if="type === 'create'">
      <el-button
        class="draft-btn"
        @click="submitDemandForm(0)"
      >
        保存草稿
      </el-button>
      <el-button
        type="primary"
        @click="submitDemandForm(1)"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ['type'],
  data() {
    return {
      demandForm: {
        competitive_product: [{}]
      },
      commonRules: {
        big_category: [
          {
            required: true,
            message: '请选择大品类'
          }
        ],
        small_category: [
          {
            required: true,
            message: '请选择小品类'
          }
        ],
        brand: [
          {
            required: true,
            message: '请输入品牌'
          }
        ]
      },
      demandRules: {},
      imagesList: [],
      department: {},
      operationDepartment: {
        link: [
          {
            required: true,
            message: '请输入产品链接'
          }
        ],
        reason: [
          {
            required: true,
            message: '请输入对标理由'
          }
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
            message: '请输入采购价'
          }
        ],
        selling_point: [
          {
            required: true,
            message: '请输入特别卖点'
          }
        ],
        product_dimension_l: [
          {
            reuqired: true,
            message: '请输入长度'
          }
        ],
        product_dimension_w: [
          {
            reuqired: true,
            message: '请输入宽度'
          }
        ],
        product_dimension_h: [
          {
            reuqired: true,
            message: '请输入高度'
          }
        ],
        packing_dimension_l: [
          {
            reuqired: true,
            message: '请输入长度'
          }
        ],
        packing_dimension_w: [
          {
            reuqired: true,
            message: '请输入宽度'
          }
        ],
        packing_dimension_h: [
          {
            reuqired: true,
            message: '请输入高度'
          }
        ],
        rough_weight: [
          {
            reuqired: true,
            message: '请输入毛重'
          }
        ],
        parameter: [
          {
            reuqired: true,
            message: '请输入核心参数'
          }
        ]
      },
      saleDepartment: {
        images: [
          {
            required: true,
            message: '请上传产品图片'
          }
        ],
        source: [
          {
            required: true,
            message: '请选择来源'
          }
        ],
        pain_spot: [
          {
            required: true,
            message: '请输入痛点'
          }
        ],
        demand_point: [
          {
            required: true,
            message: '请输入需求点'
          }
        ],
        information: [
          {
            required: true,
            message: '请输入产品信息'
          }
        ]
      },
      isDisabled: false
    };
  },
  mounted() {
    if (this.type === 'detail') {
      this.getDetail();
      this.isDisabled = true;
    }
    // setTimeout(() => {
    //   if (this.type === 'detail') {
    //     console.log(this.demandMsg);
    //   }
    // }, 1000);
    // this.getDepartment();
    // console.log(this.demandRules);
  },
  methods: {
    async getDetail() {
      await this.$store.dispatch('demand/getDemandDetail', {
        params: {
          demand_id: +this.$route.params.id
        }
      });
      this.demandForm = this.$store.state.demand.demandDetail;
      this.imagesList = this.demandForm.images;
    },
    async getDepartment() {
      await this.$store.dispatch('demand/getDepartment');
      this.department = this.$store.state.demand.department.department;
    },
    async createDemandForm(body) {
      await this.$store.dispatch('demand/createDemandForm', body);
      if (this.$store.state.demand.isSuccess) {
        this.$router.push('/demand-list');
        this.$store.commit('demand/setDemandLoading', true);
      }
    },
    addRow() {
      this.demandForm.competitive_product.push({});
    },
    deleteRow() {
      this.demandForm.competitive_product.pop();
    },
    handleProductImageSuccess(file, fileList) {
      this.imagesList.push({
        id: file.id,
        name: fileList.name
      });
      this.imagesList.forEach((item) => {
        let { id } = item;
        this.demandForm.images.push(id);
      });
    },
    // handleCProductImageSuccess(file, fileList) {
    //   // this.productImagesList.push({
    //   //   id: file.id,
    //   //   name: fileList.name
    //   // });
    //   // this.productImagesList.forEach((item) => {
    //   //   let { id } = item;
    //   //   this.demandForm.competitive_product.images.push(id);
    //   // });
    // },
    submitDemandForm(val) {
      this.$refs.demandForm.validate((valid) => {
        if (valid) {
          console.log(val);
          // let form = this.demandForm;
          // form.type = val;
          // this.createDemandForm(form);
        }
      });
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

.demand-form_item {
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>
