<template>
  <div class="border">
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
  </div>

  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 模具详情
    </div>
    <mould-process />
  </div>
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
