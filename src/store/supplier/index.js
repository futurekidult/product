import { ElMessage } from 'element-plus';
import axios from '../../utils/axios.js';

export default {
  namespaced: true,
  state() {
    return {
      supplierList: [],
      supplierLoading: true,
      blackList: [],
      blackLoading: true,
      createPass: false,
      updatePass: false,
      supplierDetail: {},
      supplierDetailLoading: true
    };
  },
  mutations: {
    setSupplierList(state, payload) {
      state.supplierList = payload;
    },
    setBlackList(state, payload) {
      state.blackList = payload;
    },
    setSupplierLoading(state, payload) {
      state.supplierLoading = payload;
    },
    setBlackLoading(state, payload) {
      state.blackLoading = payload;
    },
    setCreateState(state, payload) {
      state.createPass = payload;
    },
    setUpdateState(state, payload) {
      state.updatePass = payload;
    },
    setSupplierDetail(state, payload) {
      state.supplierDetail = payload;
    },
    setSupplierDetailLoading(state, payload) {
      state.supplierDetailLoading = payload;
    }
  },
  actions: {
    async getSupplierList(context, payload) {
      await axios.get('/supplier/white/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSupplierList', res.data.list);
          context.commit('setSupplierLoading', false);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getBlackList(context, payload) {
      await axios.get('/supplier/black/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setBlackList', res.data.list);
          context.commit('setBlackLoading', false);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async deleteSupplier(_, payload) {
      await axios.post('/supplier/detail/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async setBlackSupplier(_, payload) {
      await axios.post('/supplier/black-list/add', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async setWhiteSupplier(_, payload) {
      await axios.post('/supplier/white-list/add', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createSupplier(context, payload) {
      await axios.post('/supplier/detail/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          context.commit('setCreateState', true);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSupplierDetail(context, payload) {
      await axios.get('/supplier/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSupplierDetail', res.data);
          context.commit('setSupplierDetailLoading', false);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async updateSupplier(context, payload) {
      await axios.post('/supplier/detail/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          context.commit('setUpdateState', true);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async approvalSupplier(context, payload) {
      await axios.post('supplier/entry/approve', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
