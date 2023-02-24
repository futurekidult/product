<template>
  <div v-loading="$store.state.product.pricingLoading">
    <div class="select-title">
      <span class="line">|</span> 定价信息
    </div>
    <base-table
      :table-data="pricingList"
      :pagination-visible="false"
      :table-column="$global.pricingTableColumn"
    >
      <template #default="slotProps">
        <text-btn @handle-click="toDetail(slotProps.row.id)">
          查看详情
        </text-btn>
      </template>
    </base-table>
  </div>
</template>

<script>
export default {
  inject: ['getPricing'],
  props: ['pricingList'],
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
