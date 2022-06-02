<template>
  <div
    v-loading="$store.state.product.order.orderLoading"
    class="border"
  >
    <div class="select-title">
      <span class="line">|</span> 下单信息
    </div>

    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="orderList"
    >
      >
      <el-table-column
        label="序号"
        type="index"
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
      />
      <el-table-column
        label="实际完成时间"
        prop="actual_finish_time"
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
      :length="orderList.length"
      :get-list="getOrder"
    />
  </div>
</template>

<script>
export default {
  inject: ['getOrder'],
  props: ['orderList'],
  methods: {
    async getSkuForm() {
      await this.$store.dispatch('product/order/getSku');
    },
    async getOrderProgress() {
      await this.$store.dispatch('product/order/getProgress', {
        params: { id: this.$route.params.productId }
      });
    },
    toDetail(id) {
      this.$router.push(`/product-list/${this.$route.params.productId}/${id}`);
      this.getOrderProgress();
      this.getSkuForm();
    },
    changeCellColor(val) {
      if (val <= 30) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    }
  }
};
</script>
