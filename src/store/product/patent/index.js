import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      enum: {},
      patent: {},
      progress: {},
      contract: {},
      report: {},
      singlePatent: {}
    };
  },
  mutations: {
    setEnum(state, payload) {
      state.enum = payload;
    },
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
    }
  },
  actions: {
    async getEnum(context) {
      await axios.get('/patent/enum/get').then((res) => {
        if (res.code === 200) {
          context.commit('setEnum', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getPatent(context, payload) {
      await axios.get('/patent/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPatent', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getProgress(context, payload) {
      await axios.get('/patent/schedule/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProgress', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getContract(context, payload) {
      await axios.get('/patent/contract/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setContract', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getReport(context, payload) {
      await axios.get('/patent/report/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setReport', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async patentApply(_, payload) {
      await axios.post('/patent/apply', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async viewPatentReview(context, payload) {
      await axios.get('/patent/application/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSinglePatent', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async patentReview(_, payload) {
      await axios.post('patent/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmPatent(_, payload) {
      await axios.post('/patent/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async uploadContract(_, payload) {
      await axios.post('/patent/contract/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async uploadReport(_, payload) {
      await axios.post('/patent/report/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
