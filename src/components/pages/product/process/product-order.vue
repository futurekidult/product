<template>
  <div v-loading="$store.state.product.order.orderLoading">
    <div class="select-title">
      <span class="line">|</span> 下单信息
    </div>

    <el-table
      border
      stripe
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="orderList"
    >
      >
      <el-table-column
        label="序号"
        type="index"
        width="60px"
      />
      <el-table-column
        label="关联定价ID"
        prop="pricing_id"
      />
      <el-table-column
        label="最终定价"
        prop="final_price"
      />
      <el-table-column
        label="供应商ID"
        prop="supplier_id"
      />
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
        width="200px"
      />
      <el-table-column
        label="实际完成时间"
        prop="actual_finish_time"
        width="200px"
      />
      <el-table-column
        label="大货样套数"
        prop="pre_production_sample_quantity"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="toDetail(scope.row.id)">
            下单详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="$store.state.product.order.orderListLength"
      :current-page="page"
      :page-num="pageNum"
      @change-size="changePageSize"
      @change-page="changeCurrentPage"
    />
  </div>
</template>

<script>
export default {
  inject: ['getOrder'],
  props: ['orderList', 'currentPage', 'pageSize'],
  emits: ['change-page', 'change-size'],
  data() {
    return {
      page: this.currentPage,
      pageNum: this.pageSize
    }
  },
  watch: {
    currentPage(val) {
      this.page = val;
    },
    pageSize(val) {
      this.pageNum = val;
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push(`/product-list/${this.$route.params.productId}/${id}`);
      this.$store.commit('setEntry', 'detail');
    },
    changeCellColor(val) {
      if (val <= 30) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    changeCurrentPage(val) {
      this.page = val;
      this.$emit('change-page', this.page);
    },
    changePageSize(val) {
      this.pageNum = val;
      this.$emit('change-size', this.pageNum);
    } 
  }
};
</script>
