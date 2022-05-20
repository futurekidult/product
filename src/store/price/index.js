import { ElMessage } from 'element-plus';
import axios from '../../utils/axios.js';

export default {
  namespaced: true,
  state() {
    return {
      priceList: [],
      priceLoading: true,
      quotationList: {},
      quotationLoading: true,
      referencePrice: [],
      referenceLoading: true,
      targetPrice: [],
      targetLoading: true,
      hasAdd: 0,
      hasHigh: 0,
      quotation: {},
      viewLoading: true
    };
  },
  mutations: {
    setPriceList(state, payload) {
      state.priceList = payload;
    },
    setQuotationList(state, payload) {
      state.quotationList = payload;
    },
    setReferencePrice(state, payload) {
      state.referencePrice = payload;
    },
    setTargetPrice(state, payload) {
      state.targetPrice = payload;
    },
    setHasAdd(state, payload) {
      state.hasAdd = payload;
    },
    setHasHigh(state, payload) {
      state.hasHigh = payload;
    },
    setQuotation(state, payload) {
      state.quotation = payload;
    }
  },
  actions: {
    async getPriceList(context, payload) {
      await axios.get('/pricing/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPriceList', res.data.list);
          context.state.priceLoading = false;
        } else {
          ElMessage.success(res.message);
        }
      });
    },
    async getQuotationList(context, payload) {
      await axios.get('/pricing/quote/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQuotationList', res.data);
          context.state.quotationLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getReferencePrice(context, payload) {
      await axios.get('/pricing/reference-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setReferencePrice', res.data.list);
          context.state.referenceLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getTargetPrice(context, payload) {
      await axios.get('/pricing/target-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTargetPrice', res.data.list);
          context.state.targetLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async terminateQuotation(_, payload) {
      await axios.post('/pricing/quote/terminate', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmQuotation(_, payload) {
      await axios.post('/pricing/quote/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async deleteQuote(_, payload) {
      await axios.post('/pricing/quote/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async updatePurchaseSpecialist(_, payload) {
      await axios
        .post('/pricing/purchase-specialist/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async applyAdjustment(_, payload) {
      await axios.post('/pricing/adjustment/apply', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getAddReason(context, payload) {
      await axios.get('/pricing/appended-reason/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setHasAdd', res.data.has_same_supplier);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getHighReason(context, payload) {
      await axios
        .get('/pricing/beyond-reference-reason/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setHasHigh', res.data.beyond_reference);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createQuotation(_, payload) {
      await axios.post('/pricing/quote/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getQuotation(context, payload) {
      await axios.get('/pricing/quote/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQuotation', res.data);
          context.state.viewLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitQuotation(_, payload) {
      await axios.post('/pricing/quote/submit', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
