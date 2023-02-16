<template>
  <div v-loading="$store.state.product.sampleLoading">
    <div class="select-title">
      <span class="line">|</span> 样品信息
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
        label="关联定价ID"
        prop="pricing_id"
        width="110"
      />
      <el-table-column
        label="平台"
        prop="platform"
        min-width="100"
      />
      <el-table-column
        label="需求数量"
        prop="demand_quantity"
        min-width="100"
      />
      <el-table-column
        label="需求日期"
        prop="demand_time"
        width="200"
      />
      <el-table-column
        label="有无认证"
        prop="has_verify"
        min-width="100"
      />
      <el-table-column
        label="供应商ID"
        prop="supplier_id"
        width="100"
      />
      <el-table-column
        label="采购员"
        prop="purchase_specialist"
        min-width="100"
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
        label="状态"
        min-width="150"
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
        width="100"
      >
        <template #default="scope">
          <text-btn @handle-click="toDetail(scope.row.id)">
            查看详情
          </text-btn>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="$store.state.product.sampleListLength"
      :current-page="page"
      :page-num="pageNum"
      @change-size="changePageSize"
      @change-page="changeCurrentPage"
    />
  </div>
</template>

<script>
export default {
  inject: ['getSample'],
  props: ['sampleList', 'currentPage', 'pageSize'],
  emits: ['change-page', 'change-size'],
  data() {
    return {
      page: this.currentPage,
      pageNum: this.pageSize
    };
  },
  watch: {
    currentPage(val) {
      this.page = val;
    },
    pageSize(val) {
      this.pageNum = val;
      this.page = 1;
    }
  },
  methods: {
    toDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/sample-list') > -1) {
        this.$router.push(`/sample-list/${id}`);
        this.$store.commit('setActiveTab', 'base');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 30) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    changeCurrentPage(val) {
      this.page = val;
      this.$emit('change-page', this.page);
    },
    changePageSize(val) {
      this.pageNum = val;
      this.page = 1;
      this.$emit('change-size', this.pageNum);
    }
  }
};
</script>
