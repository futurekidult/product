<template>
  <div v-loading="$store.state.product.sampleLoading">
    <div class="select-title">
      <span class="line">|</span> 样品信息
    </div>

    <base-table
      :table-data="sampleList"
      :pagination="pagination"
      :length="$store.state.product.sampleListLength"
      :table-column="$global.sampleMessageTableColumn"
      @change-pagination="changePagination"
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
  inject: ['getSample'],
  props: ['sampleList', 'samplePagination'],
  data() {
    return {
      pagination: this.samplePagination
    };
  },
  watch: {
    samplePagination(val) {
      this.pagination = val;
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
    changePagination(pagination) {
      this.pagination = pagination;
      this.$emit('change-page', this.pagination);
    }
  }
};
</script>
