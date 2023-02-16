<template>
  <div>
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 筛选条件
      </div>
      <div class="select-item">
        <el-form
          label-width="80px"
          style="display: flex"
          :model="chooseForm"
        >
          <el-form-item label="产品名称">
            <el-input
              v-model="chooseForm.name"
              placeholder="请输入内容"
              clearable
              @clear="searchProduct"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.category_id"
              placeholder="请选择"
              clearable
              @clear="searchProduct"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择状态"
              @clear="searchProduct"
            >
              <el-option
                v-for="item in productState"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            type="primary"
            @click="searchProduct"
          >
            查询
          </el-button>
          <el-button
            class="close-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div
      v-loading="$store.state.product.listLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 新品列表
      </div>
      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="productList"
      >
        <el-table-column
          fixed
          label="产品ID"
          prop="id"
          width="100"
        />
        <el-table-column
          fixed
          label="产品名称"
          prop="name"
          min-width="150"
        />
        <el-table-column
          fixed
          label="关联需求ID"
          width="110"
        >
          <template #default="scope">
            <text-btn @handle-click="toDemand(scope.row.demand_id)">
              {{ scope.row.demand_id }}
            </text-btn>
          </template>
        </el-table-column>
        <el-table-column
          label="品类"
          prop="category"
        />
        <el-table-column
          label="产品定位"
          prop="positioning_desc"
          min-width="100"
        />
        <el-table-column
          label="项目管理员"
          prop="project_administrator"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
          width="200"
        />
        <el-table-column
          label="状态"
          prop="state_desc"
          fixed="right"
        >
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="150"
        >
          <template #default="scope">
            <div style="display: flex">
              <text-btn @handle-click="toDetail(scope.row.id)">
                查看详情
              </text-btn>
              <div v-if="scope.row.state !== 90">
                <span class="table-btn">|</span>
                <text-btn
                  @handle-click="
                    showEditForm(scope.row.id, scope.row.category_id)
                  "
                >
                  编辑
                </text-btn>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="$store.state.product.productListLength"
        :current-page="currentPage"
        :page-num="pageSize"
        @change-size="changePageSize"
        @change-page="changeCurrentPage"
      />

      <el-dialog
        v-model="editVisible"
        title="编辑"
        width="42%"
        :close-on-click-modal="false"
      >
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editRules"
          label-width="100px"
        >
          <el-form-item
            label="产品名称"
            prop="name"
          >
            <el-input
              v-model="editForm.name"
              clearable
              placeholder="请输入产品名称"
            />
          </el-form-item>
          <el-form-item
            label="产品图片"
            prop="images"
          >
            <base-upload
              type="image"
              :is-disabled="false"
              :list="imgList"
              tag="产品图片"
              count="8"
              url="prod-img"
              @get-file="getUploadFile"
            />
          </el-form-item>
          <el-form-item
            label="小品类"
            prop="small_category_id"
          >
            <el-select
              v-model="editForm.small_category_id"
              placeholder="请选择小品类"
            >
              <el-option
                v-for="item in smallCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-divider />
          <div style="text-align: right">
            <el-button
              type="primary"
              @click="submitEditForm"
            >
              保存
            </el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';
import { getDemandDetail } from '../../../utils/demand';

export default {
  data() {
    return {
      chooseForm: {},
      editVisible: false,
      editForm: {
        images: []
      },
      editRules: {
        name: [
          {
            required: true,
            message: '请输入产品名称'
          }
        ],
        images: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        small_category_id: [
          {
            required: true,
            message: '请选择小品类'
          }
        ]
      },
      imgList: [],
      images: [],
      productId: 0,
      productList: [],
      categoryList: [],
      productState: [],
      currentPage: 1,
      pageSize: 10,
      smallCategoryList: []
    };
  },
  mounted() {
    this.getPorductState();
    this.getCategoryList();
    this.getProductList();
  },
  methods: {
    async getPorductState() {
      if (localStorage.getItem('params')) {
        this.productState = JSON.parse(
          localStorage.getItem('params')
        ).product.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getPorductState();
        } catch (err) {
          return;
        }
      }
    },
    async getCategoryList(id) {
      let params = id ? { id } : {};
      try {
        await this.$store.dispatch('demand/getCategoryList', { params });
        let list = this.$store.state.demand.categoryList;
        if (!id) {
          this.categoryList = list;
        } else {
          this.smallCategoryList = list[0].children;
        }
      } catch (err) {
        return;
      }
    },
    toDetail(id) {
      this.productId = id;
      this.$router.push(`/product-list/${id}`);
      this.$store.commit('setEntry', 'detail');
    },
    async showEditForm(id, categoryId) {
      this.productId = id;
      try {
        this.getCategoryList(categoryId);
        await this.$store.dispatch('product/getSingleDetailMsg', {
          params: {
            id
          }
        });
        let { singleProductDetail } = this.$store.state.product;
        this.editForm.name = singleProductDetail.name;
        this.editForm.small_category_id = singleProductDetail.small_category_id;
        this.imgList = singleProductDetail.images;
        this.editVisible = true;
      } catch (err) {
        return;
      }
    },
    async getProductList() {
      this.$store.commit('product/setListLoading', true);
      let params = this.chooseForm;
      params['current_page'] = this.currentPage;
      params['page_size'] = this.pageSize;
      try {
        await this.$store.dispatch('product/getProductList', { params });
        this.productList = this.$store.state.product.productList;
        this.productList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
        });
      } catch (err) {
        this.$store.commit('product/setListLoading', false);
        return;
      }
    },
    async updateProductMsg() {
      let body = this.editForm;
      body.id = this.productId;
      try {
        await this.$store.dispatch('product/updateSingleProductMsg', body);
        this.editVisible = false;
        this.getProductList();
      } catch (err) {
        return;
      }
    },
    submitEditForm() {
      this.editForm.images = [];
      this.imgList.forEach((item) => {
        let { id } = item;
        this.editForm.images.push(id);
      });
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.updateProductMsg();
        }
      });
    },
    toDemand(id) {
      if (this.$store.state.menuData.links.indexOf('/demand-list') > -1) {
        getDemandDetail(id, 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changeCellColor(val) {
      if (val === 30 || val === 90) {
        return 'result-fail';
      } else if (val === 80) {
        return 'result-pass';
      } else {
        return 'result-ing';
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.pageSize = 10;
      this.searchProduct();
    },
    closeViewDialog() {
      this.viewImgDialog = false;
      this.editVisible = true;
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getProductList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getProductList();
    },
    searchProduct() {
      this.currentPage = 1;
      this.getProductList();
    },
    getUploadFile(e) {
      this.imgList = e;
    }
  }
};
</script>
