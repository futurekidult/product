import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      patent: {},
      progress: {},
      contract: {},
      report: {},
      singlePatent: {},
      patentLoading: true,
      contractLoading: true,
      reportLoading: true
    };
  },
  mutations: {
    setPatent(state, payload) {
      state.patent = payload;
    },
    setProgress(state, payload) {
      state.progress = payload;
    },
    setContract(state, payload) {
      state.contract = payload;
    },
    setReport(state, payload) {
      state.report = payload;
    },
    setSinglePatent(state, payload) {
      state.singlePatent = payload;
    },
    setPatentLoading(state, payload) {
      state.patentLoading = payload;
    },
    setContractLoading(state, payload) {
      state.contractLoading = payload;
    },
    setReportLoading(state, payload) {
      state.reportLoading = payload;
    }
  },
  actions: {
    async getPatent(context, payload) {
      await axios.get('/patent/application/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPatent', res.data);
          context.commit('setPatentLoading', false);
        }
      });
    },
    async getProgress(context, payload) {
      await axios.get('/patent/schedule/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProgress', res.data);
        }
      });
    },
    async getContract(context, payload) {
      await axios.get('/patent/contract/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setContract', res.data);
          context.commit('setContractLoading', false);
        }
      });
    },
    async getReport(context, payload) {
      await axios.get('/patent/report/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setReport', res.data);
          context.commit('setReportLoading', false);
        }
      });
    },
    async patentApply(_, payload) {
      await axios.post('/patent/application/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async viewPatentReview(context, payload) {
      await axios.get('/patent/application/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSinglePatent', res.data);
        }
      });
    },
    async patentReview(_, payload) {
      await axios.post('/patent/application/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async confirmPatent(_, payload) {
      await axios.post('/patent/application/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async uploadContract(_, payload) {
      await axios.post('/patent/contract/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async uploadReport(_, payload) {
      await axios.post('/patent/report/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async confirmContract(_, payload) {
      await axios.post('/patent/contract/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async confirmReport(_, payload) {
      await axios.post('/patent/report/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
