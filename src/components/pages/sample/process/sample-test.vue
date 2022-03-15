<template>
  <section class="progress-table">
    <div class="progress-title">
      样品测试申请进度表
    </div>
    <div>
      <el-button type="primary">
        申请样品测试
      </el-button>
    </div>
    <el-table
      border
      empty-text="无数据"
    >
      <el-table-column label="序号" />
      <el-table-column label="创建人" />
      <el-table-column label="提交时间" />
      <el-table-column label="评审完成时间" />
      <el-table-column label="评审结果" />
      <el-table-column label="状态" />
      <el-table-column label="操作">
        <el-button>样品测试申请单评审</el-button>
      </el-table-column>
    </el-table>
  </section>

  <el-tabs
    v-model="activeName"
    type="card"
  >
    <el-tab-pane
      label="品质测试"
      name="quality"
    >
      <quality-test>'</quality-test>
    </el-tab-pane>
    <el-tab-pane
      label="机构测试"
      name="agency"
    >
      <agency-test />
    </el-tab-pane>
    <el-tab-pane
      label="用户测试"
      name="user"
    >
      <user-test />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import QualityTest from './test/quality-test.vue';
import AgencyTest from './test/agency-test.vue';
import UserTest from './test/user-test.vue';
export default {
  components: {
    QualityTest,
    AgencyTest,
    UserTest
  },
  data() {
    return {
      activeName: 'quality'
    };
  }
};
</script>
