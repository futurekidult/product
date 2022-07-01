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
      hasAdd: 0,
      hasHigh: 0,
      quotation: {}
    };
  },
  mutations: {
    setPriceList(state, payload) {
      state.priceList = payload;
    },
    setPriceLoading(state, payload) {
      state.priceLoading = payload;
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
    },
    setQuotationLoading(state, payload) {
      state.quotationLoading = payload;
    }
  },
  actions: {
    async getPriceList(context, payload) {
      await axios.get('/pricing/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPriceList', res.data.list);
          context.commit('setPriceLoading', false);
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
        }
      });
    },
    async getReferencePrice(context, payload) {
      await axios.get('/pricing/reference-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setReferencePrice', res.data.list);
          context.state.referenceLoading = false;
        }
      });
    },
    async getTargetPrice(context, payload) {
      await axios.get('/pricing/target-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTargetPrice', res.data.list);
        }
      });
    },
    async terminateQuotation(_, payload) {
      await axios.post('/pricing/quote/terminate', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async confirmQuotation(_, payload) {
      await axios.post('/pricing/quote/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteQuote(_, payload) {
      await axios.post('/pricing/quote/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updatePurchaseSpecialist(_, payload) {
      await axios
        .post('/pricing/purchase-specialist/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async applyAdjustment(_, payload) {
      await axios.post('/pricing/adjustment/apply', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getAddReason(context, payload) {
      await axios.get('/pricing/appended-reason/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setHasAdd', res.data.has_same_supplier);
        }
      });
    },
    async getHighReason(context, payload) {
      await axios
        .get('/pricing/beyond-reference-reason/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setHasHigh', res.data.beyond_reference);
          }
        });
    },
    async createQuotation(_, payload) {
      await axios.post('/pricing/quote/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getQuotation(context, payload) {
      await axios.get('/pricing/quote/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQuotation', res.data);
        }
      });
    },
    async submitQuotation(_, payload) {
      await axios.post('/pricing/quote/submit', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
