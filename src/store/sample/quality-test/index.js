import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      qualityDetail: {},
      testQuestion: {}
    };
  },
  mutations: {
    setQualityDetail(state, payload) {
      state.qualityDetail = payload;
    },
    setTestQuestion(state, payload) {
      state.testQuestion = payload;
    }
  },
  actions: {
    async getQualityDetail(context, payload) {
      await axios.get('/sample/quality-test/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQualityDetail', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getTestQuestion(context, payload) {
      await axios
        .get('sample/quality-test/problem/list/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setTestQuestion', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async confirmTestResult(_, payload) {
      await axios
        .post('/sample/quality-test/result/confirm/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createTestQuestion(_, payload) {
      await axios
        .post('/sample/quality-test/problem/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async updateTestQuestion(_, payload) {
      await axios
        .post('/sample/quality-test/problem/update/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async submitTestResult(_, payload) {
      await axios
        .post('/sample/quality-test/result/submit/', payload)
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
