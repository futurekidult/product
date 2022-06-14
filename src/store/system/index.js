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
      roleList: [],
      roleLoading: true,
      adminRole: {},
      role: {}
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
    setRoleList(state, payload) {
      state.roleList = payload;
    },
    setRoleLoading(state, payload) {
      state.roleLoading = payload;
    },
    setAdminRole(state, payload) {
      state.adminRole = payload;
    },
    setRole(state, payload) {
      state.role = payload;
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
        }
      });
    },
    async getRoleList(context) {
      await axios.get('/system/role/list').then((res) => {
        if (res.code === 200) {
          context.commit('setRoleList', res.data.list);
          context.commit('setRoleLoading', false);
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
    async getRole(context, payload) {
      await axios.get('/system/role/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setRole', res.data);
        }
      });
    },
    async updateRole(_, payload) {
      await axios.post('/system/role/update', payload).then((res) => {
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
    }
  }
};
