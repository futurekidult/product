import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      project: {},
      profit: {},
      schedule: {},
      specialist: [],
      profitCalculation: {},
      adjustment: {},
      adjustmentList: [],
      projectLoading: true,
      profitLoading: true,
      marketList: [],
      referencePrice: {},
      rate: '',
      profitParams: {},
      currencyList: []
    };
  },
  mutations: {
    setProject(state, payload) {
      state.project = payload;
    },
    setProfit(state, payload) {
      state.profit = payload;
    },
    setSchedule(state, payload) {
      state.schedule = payload;
    },
    setSpecialist(state, payload) {
      state.specialist = payload;
    },
    setProfitCalculation(state, payload) {
      state.profitCalculation = payload;
    },
    setAdjustment(state, payload) {
      state.adjustment = payload;
    },
    setAdjustmentList(state, payload) {
      state.adjustmentList = payload;
    },
    setProjectLoading(state, payload) {
      state.projectLoading = payload;
    },
    setProfitLoading(state, payload) {
      state.profitLoading = payload;
    },
    setMarketList(state, payload) {
      state.marketList = payload;
    },
    setReferencePrice(state, payload) {
      state.referencePrice = payload;
    },
    setRate(state, payload) {
      state.rate = payload;
    },
    setProfitParams(state, payload) {
      state.profitParams = payload;
    },
    setCurrencyList(state, payload) {
      state.currencyList = payload;
    }
  },
  actions: {
    async getProject(context, payload) {
      await axios.get('/project/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProject', res.data);
          context.commit('setProjectLoading', false);
        }
      });
    },
    async getProfit(context, payload) {
      await axios
        .get('/project/profit-calculation/list', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setProfit', res.data);
          }
        });
    },
    async getSchedule(context, payload) {
      await axios.get('/project/schedule/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSchedule', res.data);
        }
      });
    },
    async updateEstimatedTime(_, payload) {
      await axios
        .post('/project/schedule/estimated/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateActualTime(_, payload) {
      await axios
        .post('/project/schedule/actual/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async setStageTime(_, payload) {
      await axios.post('/project/schedule/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async createProfit(_, payload) {
      await axios
        .post('/project/profit-calculation/create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateProfit(_, payload) {
      await axios
        .post('/project/profit-calculation/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getOperationsSpecialist(context, payload) {
      await axios
        .get('/project/operations-specialist/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setSpecialist', res.data.list);
          }
        });
    },
    async updateOperationsSpecialist(_, payload) {
      await axios
        .post('/project/operations-specialist/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getProfitCalculation(context, payload) {
      await axios
        .get('/project/profit-calculation/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setProfitCalculation', res.data);
            context.commit('setProfitLoading', false);
          }
        });
    },
    async getAdjustment(context, payload) {
      await axios.get('/pricing/adjustment/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdjustment', res.data);
        }
      });
    },
    async getAdjustmentList(context, payload) {
      await axios.get('/pricing/adjustment/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdjustmentList', res.data.list);
        }
      });
    },
    async applyPricing(_, payload) {
      await axios
        .post('/pricing/adjust-application/approve', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async approvalPricing(_, payload) {
      await axios.post('/pricing/adjustment/approve', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async submitPricingAdjustment(_, payload) {
      await axios.post('/pricing/selling/adjust', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteProfitItem(_, payload) {
      await axios
        .post('/project/profit-calculation/delete', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getMarketList(context, payload) {
      await axios.get('/option/product-market/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMarketList', res.data.list);
        }
      });
    },
    async reviewProject(_, payload) {
      await axios.post('/project/entry/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getReferencePrice(context, payload) {
      await axios
        .get('/pricing/reference-price/calculate', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setReferencePrice', res.data);
          }
        });
    },
    async getRate(context, payload) {
      await axios.get('/pricing/latest-rate/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setRate', res.data.rate);
        }
      });
    },
    async getProfitParams(context, payload) {
      await axios.get('/project/profit-calculation-rule/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProfitParams', res.data);
        }
      });
    },
    async updateProfitCalculationCoefficient(_, payload) {
      await axios
        .post('/project/profit-calculation/coefficient/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.configmessage);
          }
        });
    },
    async approvalProject(_, payload) {
      await axios.post('/project/entry/approve', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getCurrencyList(context, payload) {
      await axios.get('/option/currency/list', payload).then((res) => {
        if(res.code === 200) {
          context.commit('setCurrencyList', res.data.list);
        }
      })
    }
  }
};
