<template>
  <div v-loading="$store.state.product.pricingLoading">
    <div class="select-title">
      <span class="line">|</span> 定价信息
    </div>

    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="pricingList"
    >
      <el-table-column
        label="定价ID"
        prop="id"
      />
      <el-table-column
        label="市场"
        prop="market_desc"
      />
      <el-table-column
        label="平台"
        prop="platform"
      />
      <el-table-column
        label="最终确认定价"
        prop="final_confirmed_price"
      />
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
      />
      <el-table-column
        label="首次提交报价时间"
        prop="first_submit_time"
      />
      <el-table-column
        label="最终确认定价时间"
        prop="confirm_time"
      />
      <el-table-column
        label="关联样品流程数"
        prop="related_sample_count"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
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
      :length="pricingList.length"
      :get-list="getPricing"
    />
  </div>
</template>

<script>
export default {
  inject: ['getPricing'],
  props: ['changeColor', 'pricingList'],
  methods: {
    toDetail(id) {
      this.$router.push(`/price-list/${id}`);
    }
  }
};
</script>
