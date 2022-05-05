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
      adjustmentList: []
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
    }
  },
  actions: {
    async getProject(context, payload) {
      await axios.get('/project/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProject', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getProfit(context, payload) {
      await axios
        .get('/project/profit-calculation/list', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setProfit', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getSchedule(context, payload) {
      await axios.get('/project/schedule/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSchedule', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async updateEstimatedTime(_, payload) {
      await axios
        .post('/project/schedule/estimated/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async updateActualTime(_, payload) {
      await axios
        .post('/project/schedule/actual/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async setStageTime(_, payload) {
      await axios.post('/project/schedule/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createProfit(_, payload) {
      await axios
        .post('/project/profit-calculation/create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getOperationsSpecialist(context, payload) {
      await axios
        .get('/project/operations-specialist/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setSpecialist', res.data.list);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async updateOperationsSpecialist(_, payload) {
      await axios
        .post('/project/operations-specialist/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getProfitCalculation(context, payload) {
      await axios
        .get('/project/profit-calculation/get', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setProfitCalculation', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getAdjustment(context, payload) {
      await axios.get('/adjustment/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdjustment', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getAdjustmentList(context, payload) {
      await axios.get('/pricing/adjustment/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdjustmentList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async applyPricing(_, payload) {
      await axios
        .post('/pricing/adjust-application/approve', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async approvalPricing(_, payload) {
      await axios.post('/pricing/adjustment/approve', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitPricingAdjustment(_, payload) {
      await axios.post('/pricing/adjust', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async deleteProfitItem(_, payload) {
      await axios
        .post('/project/profit-calculation/delete', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    }
  }
};
