<template>
  <el-descriptions
    title="xxxx模具"
    :column="2"
  >
    <el-descriptions-item label="创建人">
      张三
    </el-descriptions-item>
    <el-descriptions-item label="开模工厂">
      xxxx有限公司
    </el-descriptions-item>
  </el-descriptions>

  <mould-process />
</template>

<script>
import MouldProcess from './process/mould-process.vue';

export default {
  components: {
    MouldProcess
  },
  props: ['id']
};
</script>
