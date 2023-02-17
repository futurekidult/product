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
          name="todolist"
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
            <todo-list
              :todo-list="todoList"
              :get-list="getTodoList"
            />
            <base-pagination
              :length="$store.state.workbench.todoListLength"
              :current-page="currentPage"
              :page-num="pageSize"
              @change-size="changePageSize"
              @change-page="changeCurrentPage"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="通知"
          name="inform"
        >
          <inform-list
            :notification-list="notificationList"
            :get-list="getNotificationList"
          />
          <base-pagination
            :length="$store.state.workbench.notificationListLength"
            :current-page="informCurrentPage"
            :page-num="informPageSize"
            @change-size="changeInformPageSize"
            @change-page="changeInformCurrentPage"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TodoList from './todo-list.vue';
import InformList from './inform-list.vue';
import { formatterTime } from '../../../utils';
import { Search } from '@element-plus/icons-vue';

export default {
  components: {
    TodoList,
    InformList,
    Search
  },
  data() {
    return {
      activeName: 'todolist',
      todoList: [],
      notificationList: [],
      chooseForm: {},
      workbenchState: [],
      count: 0,
      currentPage: 1,
      pageSize: 10,
      informCurrentPage: 1,
      informPageSize: 10
    };
  },
  mounted() {
    this.getTodoCount();
    this.getParams();
    this.getTodoList();
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
    async getTodoList() {
      this.$store.commit('workbench/setTodoListLoading', true);
      let params = this.chooseForm;
      params['current_page'] = this.currentPage;
      params['page_size'] = this.pageSize;
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
    async getNotificationList() {
      this.$store.commit('workbench/setNotificationListLoading', true);
      let params = {
        current_page: this.informCurrentPage,
        page_size: this.informPageSize
      };
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
      if (tab.props.name === 'todolist') {
        this.currentPage = 1;
        this.pageSize = 10;
        this.getTodoCount();
        this.getTodoList();
      } else {
        this.informCurrentPage = 1;
        this.informPageSize = 10;
        this.getNotificationList();
      }
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getTodoList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTodoList();
    },
    searchTodo() {
      this.currentPage = 1;
      this.getTodoList();
    },
    changeInformPageSize(val) {
      this.informPageSize = val;
      this.informCurrentPage = 1;
      this.getNotificationList();
    },
    changeInformCurrentPage(val) {
      this.informCurrentPage = val;
      this.getNotificationList();
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
