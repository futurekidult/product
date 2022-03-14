<template>
  <el-descriptions
    title="一款非常有潜力的太阳能灯新品"
    :column="4"
  >
    <el-descriptions-item
      v-if="status !== 2"
      label="关联产品"
    >
      XP2022000001
    </el-descriptions-item>
    <el-descriptions-item label="创建人">
      张三
    </el-descriptions-item>
    <el-descriptions-item label="创建时间">
      2022-01-06 14:00:00
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  props: ['status']
};
</script>
