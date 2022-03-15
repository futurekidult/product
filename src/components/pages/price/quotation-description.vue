<template>
  <el-descriptions
    title="一款非常有潜力的太阳能灯新品"
    :column="5"
  >
    <el-descriptions-item label="关联产品">
      XP2022000001
    </el-descriptions-item>
    <el-descriptions-item label="定价ID">
      001
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        采购参考价
      </template>
      <el-button
        type="text"
        @click="checkRefence"
      >
        查看内容
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item label="项目管理员">
      张三
    </el-descriptions-item>
    <el-descriptions-item label="采购负责人">
      李四
    </el-descriptions-item>
  </el-descriptions>

  <el-dialog
    v-model="referenceDialog"
    title="查看内容"
    width="400px"
  >
    <el-table>
      <el-table-column label="平台名称" />
      <el-table-column label="对应采购参考价" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: ['status'],
  data() {
    return {
      referenceDialog: false
    };
  },
  methods: {
    checkRefence() {
      this.referenceDialog = true;
    }
  }
};
</script>
