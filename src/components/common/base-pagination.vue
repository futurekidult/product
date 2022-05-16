<template>
  <el-pagination
    v-model:currentPage="page"
    v-model:page-size="pageSize"
    layout="total,sizes,prev,pager,next,jumper"
    :total="length"
    :page-sizes="[10, 20, 30, 50]"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  inject: ['getList'],
  props: ['length'],
  data() {
    return {
      page: 1,
      pageSize: 10
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    }
  }
};
</script>
