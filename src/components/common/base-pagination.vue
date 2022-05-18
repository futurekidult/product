<template>
  <div class="pagination">
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
  props: ['length', 'getList'],
  data() {
    return {
      page: 1,
      pageSize: 10
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList(this.page, this.pageSize);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList(this.page, this.pageSize);
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
