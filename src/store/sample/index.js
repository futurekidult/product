import axios from '../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      sampleDetail: {},
      basicLoading: true,
      proofingLoading: true,
      proofingProgress: {},
      proofingSheet: {},
      testLoading: true,
      testProgress: {},
      sampleMarketList: {},
      applyLoading: true,
      sampleTestApply: {},
      reviewLoading: true,
      qualitySpecialist: {}
    };
  },
  mutations: {
    setSampleDetail(state, payload) {
      state.sampleDetail = payload;
    },
    setProofingProgress(state, payload) {
      state.proofingProgress = payload;
    },
    setProofingSheet(state, payload) {
      state.proofingSheet = payload;
    },
    setTestProgresss(state, payload) {
      state.testProgress = payload;
    },
    setSamplemarketList(state, payload) {
      state.sampleMarketList = payload;
    },
    setSampleTestApply(state, payload) {
      state.sampleTestApply = payload;
    },
    setQualitySpecialist(state, payload) {
      state.qualitySpecialist = payload;
    }
  },
  actions: {
    async getSampleDetail(context, payload) {
      await axios.get('/sample/detail/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleDetail', res.data);
          context.state.basicLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmTestResult(_, payload) {
      await axios.post('/sample/result/confirm/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getProofingProgress(context, payload) {
      await axios
        .get('/sample/proofing-sheet/schedule/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setProofingProgress', res.data);
            context.state.proofingLoading = false;
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createProofingSheet(_, payload) {
      await axios
        .post('/sample/proofing-sheet/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getProofingSheet(context, payload) {
      await axios.get('/sample/proofing-sheet/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProofingSheet', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async approvalProofingSheet(_, payload) {
      await axios
        .post('/sample/proofing-sheet/approval/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async updateProofingSheet(_, payload) {
      await axios
        .post('/sample/proofing-sheet/update/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getTestProgress(context, payload) {
      await axios.get('/sample/test-apply/schedule', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTestProgresss', res.data);
          context.state.testLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSampleMarketList(context, payload) {
      await axios.get('/option/sample/market/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSamplemarketList', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createTestApply(_, payload) {
      await axios.post('/sample/test-apply/create/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSampleTestApply(context, payload) {
      await axios.get('/sample/test-apply/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleTestApply', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async reviewTestApply(_, payload) {
      await axios.post('/sample/test-apply/review/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getQualitySpecialist(context, payload) {
      await axios
        .get('/sample/quality-specialist/get/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setQualitySpecialist', res.data);
          }
        });
    },
    async updateQualitySpecialist(_, payload) {
      await axios
        .post('/sample/quality-specialist/update/', payload)
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
