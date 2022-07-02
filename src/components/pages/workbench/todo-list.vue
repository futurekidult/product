<template>
  <div v-loading="$store.state.workbench.todoListLoading">
    <el-table
      :data="todoList"
      border
      stripe
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60px"
      />
      <el-table-column
        label="待办名称"
        width="600px"
      >
        <template #default="scope">
          {{ scope.row.name }}
          <span
            v-if="scope.row.is_overdue !== 0"
            :class="scope.row.is_overdue !== 0 ? 'overdue' : ''"
          >【{{ scope.row.overdue_desc }}】</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="接收时间"
      />
      <el-table-column
        prop="finish_time"
        label="完成时间"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            @click="toDetail(scope.row.task_id, scope.row.related_id)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="$store.state.workbench.todoListLength"
      :get-list="getList"
    />
  </div>
</template>

<script>
import { getTask } from '../../../utils/index';

export default {
  props: ['todoList', 'getList'],
  methods: {
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 30) {
        return 'result-fail';
      } else {
        return 'result-pass';
      }
    },
    toDetail(taskId, id) {
      let taskArr = getTask(taskId);
      if (taskArr.length === 1) {
        this.$router.push(`/${taskArr[0]}-list/${id}`);
      } else {
        this.$router.push(`/${taskArr[0]}-list/${id}`);
        this.$store.commit('setActiveTab', taskArr[1]);
        this.$store.commit('setEntry', 'workbench');
      }
    }
  }
};
</script>
