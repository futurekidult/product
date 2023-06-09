import axios from '../../utils/axios.js';
import { ElMessage } from 'element-plus';
import QualityTest from './quality-test/index.js';
import AgencyTest from './agency-test/index.js';
import UserTest from './user-test/index.js';
import { formatterTime } from '../../utils/index';

export default {
  modules: {
    quality: QualityTest,
    agency: AgencyTest,
    user: UserTest
  },
  namespaced: true,
  state() {
    return {
      sampleList: [],
      sampleDetail: {},
      detailLoading: true,
      proofingProgress: {},
      proofingId: 0,
      proofingSheet: {},
      testLoading: true,
      testProgress: {},
      sampleMarketList: {},
      applyLoading: true,
      sampleTestApply: {},
      reviewLoading: true,
      qualitySpecialist: {},
      sampleBase: {},
      baseLoading: true,
      proofingLoading: true,
      listLoading: true,
      sampleListLength: 0,
      supply: {},
      supplyItem: {}
    };
  },
  mutations: {
    setSampleList(state, payload) {
      state.sampleList = payload;
    },
    setListLoading(state, payload) {
      state.listLoading = payload;
    },
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
    },
    setSampleBase(state, payload) {
      state.sampleBase = payload;
    },
    setBaseLoading(state, payload) {
      state.baseLoading = payload;
    },
    setDetailLoading(state, payload) {
      state.detailLoading = payload;
    },
    setProofingLoading(state, payload) {
      state.proofingLoading = payload;
    },
    setTestLoading(state, payload) {
      state.testLoading = payload;
    },
    setSupply(state, payload) {
      state.supply = payload;
    },
    setSupplyItem(state, payload) {
      state.supplyItem = payload;
    }
  },
  actions: {
    async getSampleList(context, payload) {
      await axios.get('/sample/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleList', res.data.list);
          context.commit('setListLoading', false);
          context.state.sampleListLength = res.data.total;
        }
      });
    },
    async getSampleBase(context, payload) {
      await axios.get('/sample/base/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleBase', res.data);
          context.commit('setBaseLoading', false);
        }
      });
    },
    async getSampleDetail(context, payload) {
      await axios.get('/sample/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleDetail', res.data);
          context.commit('setDetailLoading', false);
        }
      });
    },
    async confirmTestResult(_, payload) {
      await axios.post('/sample/result/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getProofingProgress(context, payload) {
      await axios
        .get('/sample/proofing-sheet/schedule', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setProofingProgress', res.data);
            context.commit('setProofingLoading', false);
            context.state.proofingId = res.data.id;
          }
        });
    },
    async createProofingSheet(_, payload) {
      await axios.post('/sample/proofing-sheet/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getProofingSheet(context, payload) {
      await axios.get('/sample/proofing-sheet/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProofingSheet', res.data);
        }
      });
    },
    async approvalProofingSheet(_, payload) {
      await axios
        .post('/sample/proofing-sheet/approval', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateProofingSheet(_, payload) {
      await axios.post('/sample/proofing-sheet/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getTestProgress(context, payload) {
      await axios.get('/sample/test-apply/schedule', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTestProgresss', res.data);
          context.commit('setTestLoading', false);
        }
      });
    },
    async getSampleMarketList(context, payload) {
      await axios.get('/option/sample/market/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSamplemarketList', res.data);
        }
      });
    },
    async createTestApply(_, payload) {
      await axios.post('/sample/test-apply/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getSampleTestApply(context, payload) {
      await axios.get('/sample/test-apply/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleTestApply', res.data);
        }
      });
    },
    async reviewTestApply(_, payload) {
      await axios.post('/sample/test-apply/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getQualitySpecialist(context, payload) {
      await axios.get('/sample/quality-specialist/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQualitySpecialist', res.data);
        }
      });
    },
    async updateQualitySpecialist(_, payload) {
      await axios
        .post('/sample/quality-specialist/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getTestSupply(context, payload) {
      await axios.get('/sample/supplement/schedule', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.submit_time = formatterTime(item.submit_time);
            item.review_finish_time = formatterTime(item.review_finish_time);
          });
          context.commit('setSupply', res.data);
        }
      });
    },
    async getSupplyItem(context, payload) {
      await axios.get('/sample/supplement/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSupplyItem', res.data);
        }
      });
    },
    async createSupply(_, payload) {
      await axios.post('/sample/supplement/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async reviewSupply(_, payload) {
      await axios.post('/sample/supplement/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
