<template>
  <el-table :data="getTableList">
    <el-table-column
      prop="id"
      label="序号"
    />
    <el-table-column
      prop="name"
      label="待办名称"
    />
    <el-table-column
      prop="time"
      label="接收时间"
    />
    <el-table-column
      prop="finish"
      label="完成时间"
    />
    <el-table-column
      prop="status"
      label="状态"
    />
    <el-table-column label="操作">
      <el-button type="text">
        查看详情
      </el-button>
    </el-table-column>
  </el-table>

  <base-pagination :length="getLength" />
</template>

<script>
export default {
  prop: ['getList'],
  computed: {
    getTableList() {
      return this.$store.getters['workbench/getData'];
    },
    getLength() {
      return this.$store.getters['workbench/getLength'];
    }
  }
};
</script>
