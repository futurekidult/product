<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 下单信息
    </div>

    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      >
      <el-table-column label="序号" />
      <el-table-column label="关联定价ID" />
      <el-table-column label="最终定价" />
      <el-table-column label="供应商ID" />
      <el-table-column label="计划完成时间" />
      <el-table-column label="实际完成时间" />
      <el-table-column label="大货样套数" />
      <el-table-column label="状态" />
      <el-table-column label="操作" />
    </el-table>

    <el-button @click="toDetail">
      下单详情
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    toDetail() {
      this.$router.push('/product-list/1/1');
    }
  }
};
</script>
