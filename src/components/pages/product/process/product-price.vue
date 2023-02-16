<template>
  <div v-loading="$store.state.product.pricingLoading">
    <div class="select-title">
      <span class="line">|</span> 定价信息
    </div>

    <el-table
      border
      stripe
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="pricingList"
    >
      <el-table-column
        fixed
        label="定价ID"
        prop="id"
        width="100"
      />
      <el-table-column
        label="市场"
        prop="market_desc"
        min-width="100"
      />
      <el-table-column
        label="平台"
        prop="platform"
        min-width="100"
      />
      <el-table-column
        label="最终确认定价"
        min-width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.final_confirmed_price">￥</span>{{ scope.row.final_confirmed_price }}
        </template>
      </el-table-column>
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
        width="200"
      />
      <el-table-column
        label="首次提交报价时间"
        prop="first_submit_time"
        width="200"
      />
      <el-table-column
        label="最终确认定价时间"
        prop="confirm_time"
        width="200"
      />
      <el-table-column
        label="关联样品流程数"
        prop="related_sample_count"
        min-width="150"
      />
      <el-table-column
        label="状态"
        fixed="right"
      >
        <template #default="scope">
          <div :class="changeColor(scope.row.state)">
            {{ scope.row.state_desc }}
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
  </div>
</template>

<script>
export default {
  inject: ['getPricing'],
  props: ['changeColor', 'pricingList'],
  methods: {
    toDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/price-list') > -1) {
        this.$router.push(`/price-list/${id}`);
      } else {
        this.$message.error('无权限访问');
      }
    }
  }
};
</script>
