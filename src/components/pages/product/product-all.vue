<template>
  <div v-loading="$store.state.product.listLoading">
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 筛选条件
      </div>
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
          />
        </el-form-item>
        <el-form-item label="品类">
          <el-select
            v-model="chooseForm.type"
            placeholder="请选择"
            clearable
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
            v-model="chooseForm.status"
            clearable
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in productState"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button
              type="primary"
              @click="getProductList()"
            >
              查询
            </el-button>
            <el-button class="close-btn">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 新品列表
      </div>
      <el-table
        border
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="productList"
      >
        <el-table-column
          label="产品ID"
          prop="id"
        />
        <el-table-column
          label="产品名称"
          prop="name"
        />
        <el-table-column label="关联需求ID">
          <template #default="scope">
            <el-button
              type="text"
              @click="toDemand(scope.row.demand_id)"
            >
              {{ scope.row.demand_id }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="品类"
          prop="category_desc"
        />
        <el-table-column
          label="产品定位"
          prop="positioning_desc"
        />
        <el-table-column
          label="项目管理员"
          prop="project_administrator"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
        />
        <el-table-column
          label="状态"
          prop="state_desc"
        >
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="text"
              @click="showEditForm(scope.row.id)"
            >
              编辑
            </el-button>
            <span class="table-btn">|</span>
            <el-button
              type="text"
              @click="toDetail(scope.row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="productList.length"
        :get-list="getProductList"
      />

      <el-dialog
        v-model="editVisible"
        title="编辑"
        width="30%"
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
            <el-upload
              action=""
              :show-file-list="false"
              :on-success="handleFileSuccess"
            >
              <el-button type="primary">
                点击上传
              </el-button>
            </el-upload>
            <div class="attachment">
              请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
            </div>
          </el-form-item>
          <el-form-item>
            <div
              v-for="img in imgList"
              :key="img.id"
              class="attachment-list"
            >
              <div>
                {{ img.name }}
              </div>
              <el-button
                type="text"
                @click="deleteImg(img.id)"
              >
                删除
              </el-button>
            </div>
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
export default {
  data() {
    return {
      chooseForm: {
        name: '',
        type: '',
        status: ''
      },
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
        ]
      },
      imgList: [],
      images: [],
      productId: 0,
      productList: [],
      categoryList: [],
      productState: []
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
        await this.$store.dispatch('getSystemParameters');
        this.getPorductState();
      }
    },
    async getCategoryList() {
      await this.$store.dispatch('demand/getCategoryList');
      this.categoryList = this.$store.state.demand.categoryList;
    },
    toDetail(id) {
      this.productId = id;
      this.$router.push(`/product-list/${id}`);
    },
    async showEditForm(id) {
      this.productId = id;
      await this.$store.dispatch('product/getSingleDetailMsg', {
        params: {
          id
        }
      });
      this.editForm.name = this.$store.state.product.singleProductDetail.name;
      this.imgList = this.$store.state.product.singleProductDetail.images;
      this.editVisible = true;
    },
    handleFileSuccess(file, fileList) {
      this.imgList.push({
        id: file.id,
        name: fileList.name
      });
    },
    async getProductList(currentPage = 1, pageSize = 10) {
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
      await this.$store.dispatch('product/getProductList', { params });
      this.productList = this.$store.state.product.productList;
    },
    async updateProductMsg() {
      await this.$store.dispatch('product/updateSingleProductMsg', {
        id: this.productId,
        name: this.editForm.name,
        images: this.editForm.images
      });
      this.editVisible = false;
      this.getProductList();
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
    deleteImg(id) {
      this.imgList.splice(
        this.imgList.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
    },
    toDemand(id) {
      this.$router.push(`/demand-list/${id}`);
    },
    changeCellColor(val) {
      if (val === 30 || val === 90) {
        return 'result-fail';
      } else if (val === 80) {
        return 'result-pass';
      } else {
        return 'result-ing';
      }
    }
  }
};
</script>
