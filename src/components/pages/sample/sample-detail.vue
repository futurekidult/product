<template>
  <div class="border">
    <el-descriptions
      title="一款非常有潜力的太阳能灯新品"
      :column="4"
    >
      <el-descriptions-item>
        <template #label>
          关联产品
        </template>
        <el-button type="text">
          查看
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item label="采购负责人">
        张三
      </el-descriptions-item>
      <el-descriptions-item label="采购员">
        李四
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          供应商
        </template>
        <el-button type="text">
          查看
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>

  <div class="border">
    <sample-process />
  </div>
</template>

<script>
import SampleProcess from './process/sample-process.vue';

export default {
  components: {
    SampleProcess
  },
  props: ['id']
};
</script>
