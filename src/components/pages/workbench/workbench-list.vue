<template>
  <div>
    <div class="border">
      <el-badge
        :value="count"
        size="mini"
        class="item"
      />
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="待办事项"
          name="todo-list"
        >
          <div>
            <div class="select-title todo-title">
              <div><span class="line">|</span> 待办列表</div>
              <div style="display: flex">
                <el-input
                  v-model="chooseForm.keyword"
                  placeholder="待办名称搜索"
                  clearable
                  @clear="searchTodo"
                >
                  <template #append>
                    <el-icon @click="searchTodo">
                      <Search />
                    </el-icon>
                  </template>
                </el-input>
                <el-select
                  v-model="chooseForm.state"
                  placeholder="请选择任务状态"
                  style="margin-left: 15px"
                  clearable
                  @clear="searchTodo"
                  @change="searchTodo"
                >
                  <el-option
                    v-for="item in workbenchState"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </div>
            </div>
            <base-table
              v-loading="$store.state.workbench.todoListLoading"
              :table-column="todoTableColumn"
              :table-data="todoList"
              :pagination="todoPagination"
              :length="$store.state.workbench.todoListLength"
              @change-pagination="changeTodoPagination"
            >
              <template #default="slotProps">
                <text-btn
                  @handle-click="
                    toDetail(
                      slotProps.row.task_id,
                      slotProps.row.related_id,
                      slotProps.row.state
                    )
                  "
                >
                  查看详情
                </text-btn>
              </template>
            </base-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="通知"
          name="inform"
        >
          <base-table
            v-loading="$store.state.workbench.notificationListLoading"
            :table-column="notificationTableColumn"
            :table-data="notificationList"
            :pagination="notificationPagination"
            :length="$store.state.workbench.notificationListLength"
            @change-pagination="changeNotificationPagination"
          >
            <template #default="slotProps">
              <text-btn
                :disabled="setDisabled(slotProps.row.state)"
                @handle-click="isRead(slotProps.row.id)"
              >
                已读
              </text-btn>
            </template>
          </base-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { getDemandDetail } from '../../../utils/demand';
import {
  getTask,
  formatterTime,
  resetPagination,
  setTaskStateColor
} from '../../../utils';

export default {
  components: {
    Search
  },
  data() {
    return {
      activeName: 'todo-list',
      todoList: [],
      notificationList: [],
      chooseForm: {},
      workbenchState: [],
      count: 0,
      todoTableColumn: [
        { prop: 'id', label: '待办ID', width: 80, fixed: 'left' },
        {
          prop: 'name',
          label: '待办名称',
          overdue: true,
          fixed: 'left'
        },
        { prop: 'create_time', label: '创建时间', width: 200 },
        { prop: 'finish_time', label: '完成时间', width: 200 },
        {
          prop: 'state',
          label: '状态',
          width: 150,
          formatter: (row) => {
            return setTaskStateColor(row.state);
          },
          getSpecialProp: (row) => {
            return row.state_desc;
          }
        }
      ],
      todoPagination: {
        current_page: 1,
        page_size: 10
      },
      notificationTableColumn: [
        { prop: 'id', label: '通知ID', width: 80, fixed: 'left' },
        {
          prop: 'content',
          label: '标题',
          fixed: 'left',
          formatter: (row) => {
            return this.setContentColor(row.state);
          },
          getSpecialProp: (row) => {
            return row.content;
          }
        },
        { prop: 'create_time', label: '创建时间', width: 200 }
      ],
      notificationPagination: {
        current_page: 1,
        page_size: 10
      }
    };
  },
  mounted() {
    this.getTodoCount();
    this.getParams();
    this.getTodoList(this.todoPagination);
  },
  methods: {
    async getTodoCount() {
      try {
        await this.$store.dispatch('workbench/getTodoCount');
        this.count = this.$store.state.workbench.count;
      } catch (err) {
        return;
      }
    },
    async getParams() {
      if (localStorage.getItem('params')) {
        this.workbenchState = JSON.parse(
          localStorage.getItem('params')
        ).workbench.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getTodoList(pagination) {
      this.$store.commit('workbench/setTodoListLoading', true);
      let params = this.chooseForm;
      params['current_page'] = pagination.current_page;
      params['page_size'] = pagination.page_size;
      try {
        await this.$store.dispatch('workbench/getTodoList', { params });
        this.todoList = this.$store.state.workbench.todoList;
        this.todoList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.finish_time = formatterTime(item.finish_time);
        });
      } catch (err) {
        this.$store.commit('workbench/setTodoListLoading', false);
        return;
      }
    },
    async getNotificationList(pagination) {
      this.$store.commit('workbench/setNotificationListLoading', true);
      let params = pagination;
      try {
        await this.$store.dispatch('workbench/getNotificationList', { params });
        this.notificationList = this.$store.state.workbench.notificationList;
        this.notificationList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
        });
      } catch (err) {
        this.$store.commit('workbench/setNotificationListLoading', false);
        return;
      }
    },
    handleClick(tab) {
      if (tab.props.name === 'todo-list') {
        resetPagination(this.todoPagination, 1, 10);
        this.getTodoCount();
        this.getTodoList(this.todoPagination);
      } else {
        resetPagination(this.notificationPagination, 1, 10);
        this.getNotificationList();
      }
    },
    searchTodo() {
      this.todoPagination.current_page = 1;
      this.getTodoList(this.todoPagination);
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
    },
    changeTodoPagination(pagination) {
      this.todoPagination = pagination;
      this.getTodoList(this.todoPagination);
    },
    changeNotificationPagination(pagination) {
      this.notificationPagination = pagination;
      this.getNotificationList(this.notificationPagination);
    },
    setDisabled(state) {
      return state === 1;
    },
    async isRead(id) {
      try {
        await this.$store.dispatch('workbench/notificationRead', {
          id
        });
        this.getNotificationList(this.pagination);
      } catch (err) {
        return;
      }
    },
    setContentColor(state) {
      return state === 0 ? 'is-read' : '';
    }
  }
};
</script>

<style scoped>
.el-badge {
  position: absolute;
  left: 75px;
  top: 60px;
}
</style>
