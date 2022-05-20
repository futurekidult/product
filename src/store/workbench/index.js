import { ElMessage } from 'element-plus';
import axios from '../../utils/axios';

export default {
  namespaced: true,
  state() {
    return {
      todoList: [],
      todoListLoading: true,
      notificationList: [],
      notificationListLoading: true
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
    }
  },
  actions: {
    async getTodoList(context, payload) {
      await axios.get('/workbench/todo/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTodoList', res.data.list);
          context.commit('setTodoListLoading', false);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getNotificationList(context, payload) {
      await axios.get('workbench/notification/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setNotificationList', res.data.list);
          context.commit('setNotificationListLoading', false);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async noticationRead(_, payload) {
      await axios.post('/workbench/notification/read', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
