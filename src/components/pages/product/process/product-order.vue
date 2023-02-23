<template>
  <div v-loading="$store.state.product.order.orderLoading">
    <div class="select-title">
      <span class="line">|</span> 下单信息
    </div>
    <base-table
      :table-data="orderList"
      :pagination="pagination"
      :length="$store.state.product.order.orderListLength"
      :table-column="$global.orderTableColumn"
      @change-pagination="changePagination"
    >
      <template #default="slotProps">
        <text-btn @handle-click="toDetail(slotProps.row.id)">
          下单详情
        </text-btn>
      </template>
    </base-table>
  </div>
</template>

<script>
export default {
  inject: ['getOrder'],
  props: ['orderList', 'orderPagination'],
  data() {
    return {
      pagination: this.orderPagination
    };
  },
  watch: {
    orderPagination(val) {
      this.pagination = val;
    }
  },
  methods: {
    toDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(
          `/product-list/${this.$route.params.productId}/${id}`
        );
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.$emit('change-page', this.pagination);
    }
  }
};
</script>
