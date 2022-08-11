<template>
  <div 
    v-if="length > pageSize"
    class="pagination"
  >
    <el-pagination
      v-model:currentPage="page"
      v-model:page-size="pageSize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="length"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: ['length', 'getList', 'currentPage', 'pageNum'],
  emits: ['change-page', 'change-size'],
  data() {
    return {
      page: this.currentPage,
      pageSize: this.pageNum
    };
  },
  watch: {
    currentPage(val) {
      this.page = val;
    },
    pageNum(val) {
      this.pageSize = val;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('change-size', this.pageSize);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.$emit('change-page', this.page);
    }
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: right;
}
</style>
