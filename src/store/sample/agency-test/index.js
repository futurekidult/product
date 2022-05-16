import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      isAgency: 0,
      agencyTest: {},
      testQuestion: {}
    };
  },
  mutations: {
    setAgencyTest(state, payload) {
      state.agencyTest = payload;
    },
    setTestQuestion(state, payload) {
      state.testQuestion = payload;
    }
  },
  actions: {
    async isAgency(_, payload) {
      await axios.post('/sample/agency-test/is-test/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getAgencyTest(context, payload) {
      await axios.get('/sample/agency-test/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAgencyTest', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmTestResult(_, payload) {
      await axios
        .post('/sample/agency-test/result/confirm/', payload)
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
        .post('/sample/agency-test/result/submit/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getTestQuestion(context, payload) {
      await axios
        .get('sample/agency-test/problem/list/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setTestQuestion', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createTestQuestion(_, payload) {
      await axios
        .post('/sample/agency-test/problem/create/', payload)
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
        .post('/sample/agency-test/problem/update/', payload)
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
