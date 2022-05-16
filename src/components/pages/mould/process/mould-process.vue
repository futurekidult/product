<template>
  <div class="progress-title">
    模具流程进度表
  </div>

  <el-table
    border
    empty-text="无数据"
  >
    <el-table-column label="采购员" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <el-tabs v-model="activeName">
    <el-tab-pane
      label="产品结构/外观设计图"
      name="design"
    >
      <mould-design />
    </el-tab-pane>
    <el-tab-pane
      label="手板样"
      name="sample"
    >
      <sample-mould />
    </el-tab-pane>
    <el-tab-pane
      label="开模"
      name="open"
    >
      <mould-open />
    </el-tab-pane>
    <el-tab-pane
      label="试模"
      name="test"
    >
      <mould-test />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import MouldDesign from './model-design.vue';
import SampleMould from './sample.vue';
import MouldOpen from './mould-open.vue';
import MouldTest from './mould-test.vue';

export default {
  components: {
    MouldDesign,
    SampleMould,
    MouldOpen,
    MouldTest
  },
  data() {
    return {
      activeName: 'design'
    };
  }
};
</script>
