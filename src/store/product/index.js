import axios from '../../utils/axios';
import { ElMessage } from 'element-plus';
import Survey from './survey/index.js';
import Patent from './patent/index.js';
import Order from './order/index.js';
import Project from './project/index.js';

export default {
  namespaced: true,
  modules: {
    survey: Survey,
    patent: Patent,
    order: Order,
    project: Project
  },
  state() {
    return {
      productList: [],
      total: 0,
      singleProductDetail: {},
      systemParameter: {},
      productBase: {},
      projectMember: [],
      pricingList: [],
      mouldList: [],
      sampleList: [],
      questionList: [],
      content: {},
      packageList: [],
      productDetail: {},
      baseLoading: true,
      detailLoading: true,
      memberLoading: true
    };
  },
  mutations: {
    setProduct(state, payload) {
      state.productList = payload;
    },
    setProductBase(state, payload) {
      state.productBase = payload;
    },
    setLength(state, payload) {
      state.total = payload;
    },
    setSingleProductDetail(state, payload) {
      state.singleProductDetail = payload;
    },
    setProjectMember(state, payload) {
      state.projectMember = payload;
    },
    setPricingList(state, payload) {
      state.pricingList = payload;
    },
    setMouldList(state, payload) {
      state.mouldList = payload;
    },
    setSampleList(state, payload) {
      state.sampleList = payload;
    },
    setQuestionList(state, payload) {
      state.questionList = payload;
    },
    setContent(state, payload) {
      state.content = payload;
    },
    setPackageList(state, payload) {
      state.packageList = payload;
    },
    setProductDetail(state, payload) {
      state.productDetail = payload;
    }
  },
  actions: {
    async getProductList(context, payload) {
      await axios.get('/product/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProduct', res.data.list);
          context.commit('setLength', res.data.total);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getProductBase(context, payload) {
      await axios.get('/product/base/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProductBase', res.data);
          context.state.baseLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getProductDetail(context, payload) {
      await axios.get('/product/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProductDetail', res.data);
          context.state.detailLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSingleDetailMsg(context, payload) {
      await axios.get('/product/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSingleProductDetail', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async updateSingleProductMsg(_, payload) {
      await axios.post('/product/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    },
    async getProjectMember(context, payload) {
      await axios.get('/product/member/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProjectMember', res.data.list);
          context.state.memberLoading = false;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createProjectMember(_, payload) {
      await axios.post('/product/member/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async updateProjectMember(_, payload) {
      await axios.post('/product/member/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async deleteProjectMember(_, payload) {
      await axios.post('/product/member/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getPricingList(context, payload) {
      await axios.get('/pricing/product/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPricingList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getMouldList(context, payload) {
      await axios.get('/product/mould/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMouldList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createMould(_, payload) {
      await axios
        .post('/product/mould/relation/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async deleteMould(_, payload) {
      await axios
        .post('/product/mould/relation/delete/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getSampleList(context, payload) {
      await axios.get('/sample/part/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getQuestionList(context, payload) {
      await axios.get('/test-problem/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQuestionList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitQuestionResult(_, payload) {
      await axios.post('/test-problem/result/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getContent(context, payload) {
      await axios.get('/reason/text/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setContent', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getPackageList(context, payload) {
      await axios.get('/package/part/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPackageList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmPackageResult(_, payload) {
      await axios.post('/package/result/confirm/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createPackageResult(_, payload) {
      await axios.post('/package/result/create/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
