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
            @click="toDetail(scope.row.task_id, scope.row.related_id, scope.row.state)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
      } else if (val === 30 || val === 50) {
        return 'result-fail';
      } else {
        return 'result-pass';
      }
    },
    async getCategoryList() {
      try {
        await this.$store.dispatch('demand/getCategoryList');
      } catch (err) {
        return;
      }
    },
    async getDemandDetail(id, str) {
      this.getCategoryList();
      let funcName = '';
      let url = '';
      if(str === 'review') {
        funcName = 'demand/getDemandReviewDetail';
        url = `/demand-list/review/${id}`;
      } else {
        funcName = 'demand/getDemandDetail';
        url = `/demand-list/${id}`;
      }
      try {
        await this.$store.dispatch(funcName, {
          params: {
            demand_id:  id
          }
        });
        this.$router.push(url);
      } catch (err) {
        return;
      }
    },
    toDetail(taskId, id, state) {
      let taskArr = getTask(taskId);
      if (taskArr.length === 1) {
        if(taskId === 760) {
          this.$store.commit('supplier/setActionType', 'approval');
        } 
        if(this.$store.state.menuData.links.indexOf(`/${taskArr[0]}-list`) > -1) {
          if(taskId === 10 && state === 10) {
            this.getDemandDetail(id, 'review');
          } else if(taskId === 10 && state === 40){
            this.getDemandDetail(id, 'detail');
          } else {
            this.$router.push(`/${taskArr[0]}-list/${id}`);
          }
        } else {
          this.$message.error('无权限访问');
        }
      } else {
         if(this.$store.state.menuData.links.indexOf(`/${taskArr[0]}-list`) > -1) {
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
