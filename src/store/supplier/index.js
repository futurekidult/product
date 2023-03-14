import { ElMessage } from 'element-plus';
import axios from '../../utils/axios.js';
import {
  changeQualificationRequestValue,
  handleExceptionData
} from '../../utils/index.js';

const qualificationZeroArr = [
  'cooperation_level',
  'currency',
  'sea_freight_currency',
  'inter_bank',
  'payment_method',
  'payment_terms',
  'tax_eligibility',
  'territory',
  'factory_scale',
  'registered_capital',
  'deposit_ratio'
];

export default {
  namespaced: true,
  state() {
    return {
      supplierList: [],
      supplierLoading: true,
      blackList: [],
      blackLoading: true,
      supplierDetail: {},
      supplierDetailLoading: true,
      cityOption: [],
      supplierListLength: 0,
      blackListLength: 0,
      type: '',
      formWatchCount: 1,
      updateState: false
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
    setSupplierDetail(state, payload) {
      state.supplierDetail = payload;
    },
    setSupplierDetailLoading(state, payload) {
      state.supplierDetailLoading = payload;
    },
    setCityOption(state, payload) {
      state.cityOption = payload;
    },
    setActionType(state, payload) {
      state.type = payload;
    },
    setFormWatchCount(state, payload) {
      if (payload) {
        state.formWatchCount = payload;
      } else {
        state.formWatchCount++;
      }
    },
    setUpdateState(state, payload) {
      state.updateState = payload;
    }
  },
  actions: {
    async getSupplierList(context, payload) {
      await axios.get('/supplier/white/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSupplierList', res.data.list);
          context.commit('setSupplierLoading', false);
          context.state.supplierListLength = res.data.total;
        }
      });
    },
    async getBlackList(context, payload) {
      await axios.get('/supplier/black/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setBlackList', res.data.list);
          context.commit('setBlackLoading', false);
          context.state.blackListLength = res.data.total;
        }
      });
    },
    async deleteSupplier(_, payload) {
      await axios.post('/supplier/detail/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async setBlackSupplier(_, payload) {
      await axios.post('/supplier/black-list/add', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async setWhiteSupplier(_, payload) {
      await axios.post('/supplier/white-list/add', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async createSupplier(context, payload) {
      await axios.post('/supplier/detail/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getSupplierDetail(context, payload) {
      await axios.get('/supplier/detail/get', payload).then((res) => {
        if (res.code === 200) {
          handleExceptionData(qualificationZeroArr, res.data);
          context.commit('setSupplierDetail', res.data);
          context.commit('setSupplierDetailLoading', false);
        }
      });
    },
    async updateSupplier(context, payload) {
      await axios.post('/supplier/detail/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateQualification(_, payload) {
      changeQualificationRequestValue(qualificationZeroArr, payload);
      await axios
        .post('/supplier/qualification/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async approvalSupplier(_, payload) {
      await axios.post('supplier/entry/approve', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getCityOption(context) {
      await axios.get('/option/supplier/city/list').then((res) => {
        if (res.code === 200) {
          context.commit('setCityOption', res.data.list);
        }
      });
    }
  }
};
