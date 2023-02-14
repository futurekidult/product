<template>
  <div v-loading="$store.state.workbench.todoListLoading">
    <el-table
      border
      stripe
      empty-text="无数据"
      :data="todoList"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        fixed
        label="待办ID"
        prop="id"
        width="100"
      />
      <el-table-column
        fixed
        label="待办名称"
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
        width="200"
      />
      <el-table-column
        prop="finish_time"
        label="完成时间"
        width="200"
      />
      <el-table-column
        label="状态"
        width="100"
        fixed="right"
      >
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="100"
      >
        <template #default="scope">
          <text-btn
            @handle-click="
              toDetail(scope.row.task_id, scope.row.related_id, scope.row.state)
            "
          >
            查看详情
          </text-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTask } from '../../../utils/index';
import { getDemandDetail } from '../../../utils/demand';

export default {
  props: ['todoList', 'getList'],
  methods: {
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 30 || val === 50) {
        return 'result-fail';
      } else {
        return 'result-pass';
      }
    },
    toDetail(taskId, id, state) {
      let taskArr = getTask(taskId);
      if (taskArr.length === 1) {
        if (taskId === 760) {
          this.$store.commit('supplier/setActionType', 'approval');
        }
        if (
          this.$store.state.menuData.links.indexOf(`/${taskArr[0]}-list`) > -1
        ) {
          if (taskId === 10 && state === 10) {
            getDemandDetail(id, 'review');
          } else if (taskId === 10 && state === 40) {
            getDemandDetail(id, 'detail');
          } else {
            this.$router.push(`/${taskArr[0]}-list/${id}`);
          }
        } else {
          this.$message.error('无权限访问');
        }
      } else {
        if (
          this.$store.state.menuData.links.indexOf(`/${taskArr[0]}-list`) > -1
        ) {
          this.$router.push(`/${taskArr[0]}-list/${id}`);
          this.$store.commit('setActiveTab', taskArr[1]);
          this.$store.commit('setEntry', 'workbench');
        } else {
          this.$message.error('无权限访问');
        }
      }
    }
  }
};
</script>
