<template>
  <base-breadcrumb />
  <div class="border">
    <el-badge
      :value="todoList.length"
      size="mini"
      class="item"
    />
    <el-tabs
      v-model="activeName"
      v-loading="$store.state.workbench.todoListLoading"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="待办事项"
        name="todolist"
      >
        <todo-list
          :todo-list="todoList"
          :get-list="getTodoList"
        />
      </el-tab-pane>
      <el-tab-pane
        label="通知"
        name="inform"
      >
        <inform-list
          :notification-list="notificationList"
          :get-list="getNotificationList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TodoList from './todo-list.vue';
import InformList from './inform-list.vue';
import { formatterTime } from '../../../utils';

export default {
  components: {
    TodoList,
    InformList
  },
  data() {
    return {
      activeName: 'todolist',
      todoList: [],
      notificationList: []
    };
  },
  mounted() {
    this.getTodoList();
  },
  methods: {
    async getTodoList(currentPage = 1, pageSize = 10) {
      let params = {
        current_page: currentPage,
        page_size: pageSize
      };
      await this.$store.dispatch('workbench/getTodoList', { params });
      this.todoList = this.$store.state.workbench.todoList;
      this.todoList.forEach((item) => {
        item.create_time = formatterTime(item.create_time);
        item.finish_time = formatterTime(item.finish_time);
      });
    },
    async getNotificationList(currentPage = 1, pageSize = 10) {
      let params = {
        current_page: currentPage,
        page_size: pageSize
      };
      await this.$store.dispatch('workbench/getNotificationList', { params });
      this.notificationList = this.$store.state.workbench.notificationList;
      this.notificationList.forEach((item) => {
        item.create_time = formatterTime(item.create_time);
      });
    },
    handleClick(tab) {
      if (tab.props.name === 'todolist') {
        this.$store.commit('workbench/setTodoListLoading', true);
        this.getTodoList();
      } else {
        this.$store.commit('workbench/setNotificationListLoading', true);
        this.getNotificationList();
      }
    }
  }
};
</script>

<style scoped>
.el-badge {
  position: absolute;
  left: 98px;
  top: 115px;
}
</style>
