<template>
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
        />
      </el-form-item>
      <el-form-item label="品类">
        <el-select
          v-model="chooseForm.type"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="chooseForm.status" />
      </el-form-item>
      <div>
        <el-form-item>
          <el-button type="primary">
            查询
          </el-button>
          <el-button> 重置 </el-button>
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
      <el-table-column
        label="关联需求ID"
        prop="demand_id"
      />
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
      />
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

    <el-dialog
      v-model="editVisible"
      title="编辑"
      width="30%"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editRules"
      >
        <el-form-item
          label="产品名称"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          label="产品图片"
          prop="images"
        >
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
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
              {{ file.name }}
            </div>
            <el-button type="text">
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
      editForm: {},
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
      productList: []
    };
  },
  mounted() {
    // this.getProductList();
  },
  methods: {
    toDetail(id) {
      this.productId = id;
      this.$router.push(`/product-list/${id}`);
    },
    async showEditForm(id) {
      this.productId = id;
      this.editVisible = true;
      await this.$store.dispatch('product/getSingleDetailMsg', {
        params: {
          id
        }
      });
      this.editForm = this.$store.state.product.singleProductDetail;
      this.imgList = this.editForm.images;
      for (const item of this.editForm.images) {
        let { id } = item;
        this.images.push(id);
      }
    },
    handleFileSuccess(file, fileList) {
      console.log(file, fileList);
    },
    async getProductList() {
      let params = {
        current_page: 1,
        page_size: 10
      };
      await this.$store.dispatch('product/getProductList', { params });
      this.productList = this.$store.state.product.productList;
    },
    async updateProductMsg() {
      await this.$store.dispatch('product/updateSingleProductMsg', {
        id: this.productId,
        name: this.editForm.name,
        images: this.images
      });
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.updateProductMsg();
        }
      });
    }
  }
};
</script>
