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
        <div class="border">
          <div class="select-title todo-title">
            <div><span class="line">|</span> 待办列表</div>
            <div style="display: flex">
              <el-input
                v-model="chooseForm.keyword"
                placeholder="输入要搜索的内容"
                style="width: 50%"
                clearable
                @clear="getTodoList()"
              >
                <template #append>
                  <el-button
                    type="primary"
                    @click="getTodoList()"
                  >
                    搜索
                  </el-button>
                </template>
              </el-input>
              <el-select
                v-model="chooseForm.state"
                placeholder="请选择"
                style="margin-left: 15px; width: 50%"
                clearable
                @clear="getTodoList()"
                @change="getTodoList()"
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
      notificationList: [],
      chooseForm: {},
      workbenchState: []
    };
  },
  mounted() {
    this.getParams();
    this.getTodoList();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        this.workbenchState = JSON.parse(
          localStorage.getItem('params')
        ).workbench.state;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    async getTodoList(currentPage = 1, pageSize = 10) {
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
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

.todo-title {
  display: flex;
  justify-content: space-between;
}
</style>
