import { ElMessage } from 'element-plus';
import axios from '../../utils/axios';

export default {
  namespaced: true,
  state() {
    return {
      todoList: [],
      todoListLoading: true,
      notificationList: [],
      notificationListLoading: true,
      todoListLength: 0,
      notificationListLength: 0,
      count: 0
    };
  },
  mutations: {
    setTodoList(state, payload) {
      state.todoList = payload;
    },
    setTodoListLoading(state, payload) {
      state.todoListLoading = payload;
    },
    setNotificationList(state, payload) {
      state.notificationList = payload;
    },
    setNotificationListLoading(state, payload) {
      state.notificationListLoading = payload;
    },
    setCount(state, payload) {
      state.count = payload;
    }
  },
  actions: {
    async getTodoList(context, payload) {
      await axios.get('/workbench/todo/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTodoList', res.data.list);
          context.commit('setTodoListLoading', false);
          context.state.todoListLength = res.data.total;
        }
      });
    },
    async getNotificationList(context, payload) {
      await axios.get('workbench/notification/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setNotificationList', res.data.list);
          context.commit('setNotificationListLoading', false);
          context.state.notificationListLength = res.data.total;
        }
      });
    },
    async notificationRead(_, payload) {
      await axios.post('/workbench/notification/read', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getTodoCount(context) {
      await axios.get('/workbench/unfinished/count').then((res) => {
        if (res.code === 200) {
          context.commit('setCount', res.data.unfinished);
        }
      });
    }
  }
};
