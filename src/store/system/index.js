import { ElMessage } from 'element-plus';
import axios from '../../utils/axios';

export default {
  namespaced: true,
  state() {
    return {
      organizationList: [],
      organizationLoading: true,
      privilegeList: [],
      privilegeLoading: true,
      adminList: [],
      adminLoading: true,
      systemRoleList: [],
      productRoleList: [],
      systemRoleLoading: true,
      ProductRoleLoading: true,
      adminRole: {},
      systemRole: {},
      productRole: {},
      todoList: [],
      todoLoading: true,
      calculationRuleList: [],
      calculationRuleListLoading: true,
      calculationRuleDetail: {},
      rateList: [],
      rateListLoading: true,
      calculationRuleListLength: 0,
      rateListLength: 0,
      todoListLength: 0,
      adminListLength: 0
    };
  },
  mutations: {
    setOrganizationList(state, payload) {
      state.organizationList = payload;
    },
    setOrganizationLoading(state, payload) {
      state.organizationLoading = payload;
    },
    setPrivilegeList(state, payload) {
      state.privilegeList = payload;
    },
    setPrivilegeLoading(state, payload) {
      state.privilegeLoading = payload;
    },
    setAdminList(state, payload) {
      state.adminList = payload;
    },
    setAdminLoading(state, payload) {
      state.adminLoading = payload;
    },
    setSystemRoleList(state, payload) {
      state.systemRoleList = payload;
    },
    setProductRoleList(state, payload) {
      state.productRoleList = payload;
    },
    setSystemRoleLoading(state, payload) {
      state.systemRoleLoading = payload;
    },
    setProductRoleLoading(state, payload) {
      state.productRoleLoading = payload;
    },
    setAdminRole(state, payload) {
      state.adminRole = payload;
    },
    setSystemRole(state, payload) {
      state.systemRole = payload;
    },
    setProductRole(state, payload) {
      state.productRole = payload;
    },
    setTodoList(state, payload) {
      state.todoList = payload;
    },
    setTodoLoading(state, payload) {
      state.todoLoading = payload;
    },
    setCalculationRuleList(state, payload) {
      state.calculationRuleList = payload;
    },
    setCalculationRuleDetail(state, payload) {
      state.calculationRuleDetail = payload;
    },
    setCalculationRuleListLoading(state, payload) {
      state.calculationRuleListLoading = payload;
    },
    setRateList(state, payload) {
      state.rateList = payload;
    },
    setRateListLoading(state, payload) {
      state.rateListLoading = payload;
    }
  },
  actions: {
    async getOrganizationList(context) {
      await axios.get('/system/department/list').then((res) => {
        if (res.code === 200) {
          context.commit('setOrganizationList', res.data.list);
          context.commit('setOrganizationLoading', false);
        }
      });
    },
    async getPrivilegeList(context, payload) {
      await axios.get('/system/privilege/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPrivilegeList', res.data.list);
          context.commit('setPrivilegeLoading', false);
        }
      });
    },
    async getAdminList(context, payload) {
      await axios.get('/system/admin/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdminList', res.data.list);
          context.commit('setAdminLoading', false);
          context.state.adminListLength = res.data.total;
        }
      });
    },
    async getSystemRoleList(context) {
      await axios.get('/system/role/list').then((res) => {
        if (res.code === 200) {
          context.commit('setSystemRoleList', res.data.list);
          context.commit('setSystemRoleLoading', false);
        }
      });
    },
    async getProductRoleList(context) {
      await axios.get('/system/product-role/list').then((res) => {
        if (res.code === 200) {
          context.commit('setProductRoleList', res.data.list);
          context.commit('setProductRoleLoading', false);
        }
      });
    },
    async getAdminRole(context, payload) {
      await axios.get('/system/admin/role/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdminRole', res.data);
        }
      });
    },
    async updateAdminRole(_, payload) {
      await axios.post('/system/admin/role/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async createRole(_, payload) {
      await axios.post('/system/role/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getSystemRole(context, payload) {
      await axios.get('/system/role/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSystemRole', res.data);
        }
      });
    },
    async getProductRole(context, payload) {
      await axios.get('/system/product-role/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProductRole', res.data);
        }
      });
    },
    async updateSystemRole(_, payload) {
      await axios.post('/system/role/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateProductRole(_, payload) {
      await axios.post('/system/product-role/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteRole(_, payload) {
      await axios.post('/system/role/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getTodoList(context, payload) {
      await axios.get('/system/todo/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTodoList', res.data.list);
          context.commit('setTodoLoading', false);
          context.state.todoListLength = res.data.total;
        }
      });
    },
    async transferTodo(_, payload) {
      await axios.post('/system/todo/transfer', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getCalculationRuleList(context, payload) {
      await axios
        .get('/system/profit-calculation-rule/list', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setCalculationRuleList', res.data.list);
            context.commit('setCalculationRuleListLoading', false);
            context.state.calculationRuleListLength = res.data.total;
          }
        });
    },
    async getCalculationRuleDetail(context, payload) {
      await axios
        .get('/system/profit-calculation-rule/detail/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setCalculationRuleDetail', res.data);
          }
        });
    },
    async updateCalculationRule(_, payload) {
      await axios
        .post('/system/profit-calculation/rule/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getRateList(context, payload) {
      await axios.get('/system/exchange/rate/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setRateList', res.data.list);
          context.commit('setRateListLoading', false);
          context.state.rateListLength = res.data.total;
        }
      });
    },
    async createRate(_, payload) {
      await axios.post('/system/exchange/rate/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteRate(_, payload) {
      await axios.post('/system/exchange/rate/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async blockAdmin(_, payload) {
      await axios.post('/system/admin/block', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async unblockAdmin(_, payload) {
      await axios.post('/system/admin/unblock', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
