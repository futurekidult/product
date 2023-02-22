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
              @keyup.enter.native="searchSample"
              @clear="searchSample"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.product_category"
              placeholder="请选择"
              clearable
              @change="searchSample"
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
              @change="searchSample"
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
      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="sampleList"
      >
        <el-table-column
          fixed
          label="样品ID"
          prop="id"
          width="100"
        />
        <el-table-column
          fixed
          label="关联产品名称"
          prop="product_name"
          min-width="150"
        />
        <el-table-column
          fixed
          label="关联产品ID"
          width="110"
        >
          <template #default="scope">
            <text-btn @handle-click="toRelatedProduct(scope.row.product_id)">
              {{ scope.row.product_id }}
            </text-btn>
          </template>
        </el-table-column>
        <el-table-column
          label="关联定价ID"
          prop="pricing_id"
          width="110"
        />
        <el-table-column
          label="计划完成时间"
          prop="estimated_finish_time"
          width="200"
        />
        <el-table-column
          label="实际完成时间"
          prop="actual_finish_time"
          width="200"
        />
        <el-table-column
          label="采购员"
          prop="purchase_specialist"
          min-width="100"
        />
        <el-table-column
          label="状态"
          min-width="150"
        >
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="测试结果"
          min-width="100"
        >
          <template #default="scope">
            <div :class="changeCellColor(scope.row.test_result)">
              {{ scope.row.test_result_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
        >
          <template #default="scope">
            <text-btn @handle-click="toDetail(scope.row.id)">
              查看详情
            </text-btn>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="$store.state.sample.sampleListLength"
        :current-page="currentPage"
        :page-num="pageSize"
        @change-size="changePageSize"
        @change-page="changeCurrentPage"
      />
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
      currentPage: 1,
      pageSize: 10
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
      params['current_page'] = this.currentPage;
      params['page_size'] = this.pageSize;
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
      this.pageSize = 10;
      this.searchSample();
    },
    toDetail(id) {
      this.$router.push(`/sample-list/${id}`);
      this.$store.commit('setEntry', 'detail');
    },
    changeCellColor(val) {
      if (val === 30 || val === 1) {
        return 'result-pass';
      } else if (val === 20 || val === 10) {
        return 'result-ing';
      } else {
        return 'result-fail';
      }
    },
    toRelatedProduct(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getSampleList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getSampleList();
    },
    searchSample() {
      this.currentPage = 1;
      this.getSampleList();
    }
  }
};
</script>
