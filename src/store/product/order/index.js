import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      orderList: [],
      progress: {},
      sku: {},
      contract: {},
      preProductSample: {},
      orderLoading: true
    };
  },
  mutations: {
    setOrderList(state, payload) {
      state.orderList = payload;
    },
    setProgress(state, payload) {
      state.progress = payload;
    },
    setSku(state, payload) {
      state.sku = payload;
    },
    setContract(state, payload) {
      state.contract = payload;
    },
    setPreProduct(state, payload) {
      state.preProductSample = payload;
    },
    setOrderLoading(state, payload) {
      state.orderLoading = payload;
    }
  },
  actions: {
    async getOrderList(context, payload) {
      await axios.get('/order/part/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setOrderList', res.data.list);
          context.commit('setOrderLoading', false);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getProgress(context, payload) {
      await axios.get('/order/detail/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProgress', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSkuForm(context, payload) {
      await axios.get('/order/sku/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSku', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getContract(context, payload) {
      await axios.get('/order/contract/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setContract', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmExportContract(_, payload) {
      await axios
        .post('/order/export-contract/confirm', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async confirmPurchaseContract(_, payload) {
      await axios
        .post('/order/purchase-contract/confirm/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getPreProduct(context, payload) {
      await axios
        .get('/order/pre-production-sample/get/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setPreProduct', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async followupSheet(_, payload) {
      await axios
        .post('/order/follow-up-sheet/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async receiptSheet(_, payload) {
      await axios.post('/order/goods-receipt/create/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmPreProduct(_, payload) {
      await axios
        .post('/order/pre-production-sample/confirm/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async completeSkuEntry(_, payload) {
      await axios.post('/order/sku/entry/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitSkuname(_, payload) {
      await axios.post('/order/sku/name/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
