<template>
  <div>
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 筛选条件
      </div>
      <div class="select-item">
        <el-form
          label-position="right"
          label-width="80px"
          style="display: flex"
          :model="chooseForm"
        >
          <el-form-item label="产品名称">
            <el-input
              v-model="chooseForm.product_name"
              placeholder="请输入内容"
              clearable
              @clear="searchSample"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.product_category"
              placeholder="请选择"
              clearable
              @clear="searchSample"
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
              placeholder="请选择"
              clearable
              @clear="searchSample"
            >
              <el-option
                v-for="item in sampleState"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            type="primary"
            @click="searchSample"
          >
            查询
          </el-button>
          <el-button
            class="reset-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div
      v-loading="$store.state.sample.listLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 样品列表
      </div>
      <base-table
        :table-column="$global.sampleAllTableColumn"
        :table-data="sampleList"
        :operation-width="100"
        :pagination="pagination"
        :length="$store.state.sample.sampleListLength"
        @change-pagination="changeSupplierPagination"
      >
        <template #operation="slotProps">
          <text-btn @handle-click="toRelatedProduct(slotProps.row.product_id)">
            {{ slotProps.row.product_id }}
          </text-btn>
        </template>
        <template #default="slotProps">
          <text-btn @handle-click="toDetail(slotProps.row.id)">
            查看详情
          </text-btn>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';
export default {
  data() {
    return {
      chooseForm: {},
      sampleList: [],
      categoryList: [],
      sampleState: [],
      pagination: JSON.parse(JSON.stringify(this.$global.pagination))
    };
  },
  mounted() {
    this.getCategoryList();
    this.getSampleList();
    this.getSampleState();
  },
  methods: {
    async getSampleState() {
      if (localStorage.getItem('params')) {
        this.sampleState = JSON.parse(
          localStorage.getItem('params')
        ).sample.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getSampleState();
        } catch (err) {
          return;
        }
      }
    },
    async getCategoryList() {
      try {
        await this.$store.dispatch('demand/getCategoryList');
        this.categoryList = this.$store.state.demand.categoryList;
      } catch (err) {
        return;
      }
    },
    async getSampleList() {
      this.$store.commit('sample/setListLoading', true);
      let params = this.chooseForm;
      params['current_page'] = this.pagination.current_page;
      params['page_size'] = this.pagination.page_size;
      try {
        await this.$store.dispatch('sample/getSampleList', { params });
        this.sampleList = this.$store.state.sample.sampleList;
        this.sampleList.forEach((item) => {
          item.estimated_finish_time = formatterTime(
            item.estimated_finish_time
          );
          item.actual_finish_time = formatterTime(item.actual_finish_time);
        });
      } catch (err) {
        this.$store.commit('sample/setListLoading', false);
        return;
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.pagination.page_size = 10;
      this.searchSample();
    },
    toDetail(id) {
      this.$router.push(`/sample-list/${id}`);
      this.$store.commit('setEntry', 'detail');
    },
    toRelatedProduct(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changeSupplierPagination(pagination) {
      this.pagination = pagination;
      this.getSampleList();
    },
    searchSample() {
      this.pagination.current_page = 1;
      this.getSampleList();
    }
  }
};
</script>
