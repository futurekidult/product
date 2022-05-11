import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      userTest: {},
      applyDetail: {},
      viewApplyDetail: {},
      reviewLoading: true,
      viewLoading: true,
      specialist: 0,
      editLoading: true,
      templateFile: {},
      userList: [],
      simpleUserDetail: {},
      testQuestion: {}
    };
  },
  mutations: {
    setUserTest(state, payload) {
      state.userTest = payload;
    },
    setApplyDetail(state, payload) {
      state.applyDetail = payload;
    },
    setViewApplyDetail(state, payload) {
      state.viewApplyDetail = payload;
    },
    setSpecialist(state, payload) {
      state.specialist = payload;
    },
    setTemplateFile(state, payload) {
      state.templateFile = payload;
    },
    setUserList(state, payload) {
      state.userList = payload;
    },
    setSimpleUserDetail(state, payload) {
      state.simpleUserDetail = payload;
    },
    setTestQuestions(state, payload) {
      state.testQuestion = payload;
    }
  },
  actions: {
    async createTestApply(_, payload) {
      await axios
        .post('/sample/user-test/apply/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getUserTest(context, payload) {
      await axios.get('/sample/user-test/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setUserTest', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmTestResult(_, payload) {
      await axios
        .post('/sample/user-test/result/confirm/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getUserTestApply(context, payload) {
      await axios
        .get('/sample/user-test/apply/review/get/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setApplyDetail', res.data);
            context.state.reviewLoading = false;
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async viewUserTestApply(context, payload) {
      await axios.get('/sample/user-test/apply/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setViewApplyDetail', res.data);
          context.state.viewLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async reviewTestApply(_, payload) {
      await axios
        .post('/sample/user-test/apply/review/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getSpecialist(context, payload) {
      await axios
        .get('/sample/user-survey-specialist/get/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setSpecialist', res.data);
            context.state.editLoading = false;
          } else {
            ElMessage.success(res.message);
          }
        });
    },
    async updateSpecialist(_, payload) {
      await axios
        .post('/sample/user-survey-specialist/update/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getTemplate(context, payload) {
      await axios
        .get('/sample/user-test/apply/template/get/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setTemplateFile', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createTemplate(_, payload) {
      await axios
        .post('/sample/user-test/apply/template/submit/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createUserTest(_, payload) {
      await axios
        .post('/sample/user-test/user/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getUserList(context, payload) {
      await axios.get('/sample/user-test/user/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setUserList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async deliverSample(_, payload) {
      await axios
        .post('/sample/user-test/is-delivered/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async uploadFile(_, payload) {
      await axios
        .post('/sample/user-test/user/result/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getSimpleUserDetail(context, payload) {
      await axios.get('/sample/user-test/user/get/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSimpleUserDetail', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getTestQuestion(context, payload) {
      await axios
        .get('/sample/user-test/problem/list/', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setTestQuestions', res.data);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async createTestQuestion(_, payload) {
      await axios
        .post('/sample/user-test/problem/create/', payload)
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
        .post('/sample/user-test/problem/update/', payload)
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
        .post('/sample/user-test/result/submit/', payload)
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
