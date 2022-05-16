<template>
  <el-tabs v-model="activeName">
    <el-tab-pane
      label="基本信息"
      name="basic"
    >
      <sample-basic />
    </el-tab-pane>
    <el-tab-pane
      label="打样单"
      name="list"
    >
      <proofing-list />
    </el-tab-pane>
    <el-tab-pane
      label="样品测试"
      name="test"
    >
      <sample-test />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import SampleBasic from './samplie-basic.vue';
import ProofingList from './proofing-list.vue';
import SampleTest from './sample-test.vue';

export default {
  components: {
    SampleBasic,
    ProofingList,
    SampleTest
  },
  data() {
    return {
      activeName: 'basic'
    };
  }
};
</script>
