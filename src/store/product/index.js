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
      memberLoading: true,
      listLoading: true,
      pricingLoading: true,
      mouldLoading: true,
      sampleLoading: true,
      questionLoading: true,
      packageLoading: true,
      memberListLength: 0,
      productListLength: 0,
      mouldListLength: 0,
      selectedMouldList: [],
      selectedMouldListLength: 0,
      sampleListLength: 0,
      questionListLength: 0,
      packageListLength: 0
    };
  },
  mutations: {
    setProduct(state, payload) {
      state.productList = payload;
    },
    setProductBase(state, payload) {
      state.productBase = payload;
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
    },
    setBaseLoading(state, payload) {
      state.baseLoading = payload;
    },
    setDetailLoading(state, payload) {
      state.detailLoading = payload;
    },
    setMemberLoading(state, payload) {
      state.memberLoading = payload;
    },
    setPricingLoading(state, payload) {
      state.pricingLoading = payload;
    },
    setMouldLoading(state, payload) {
      state.mouldLoading = payload;
    },
    setSampleLoading(state, payload) {
      state.sampleLoading = payload;
    },
    setQuestionLoading(state, payload) {
      state.questionLoading = payload;
    },
    setPackageLoading(state, payload) {
      state.packageLoading = payload;
    },
    setListLoading(state, payload) {
      state.listLoading = payload;
    },
    setSelectedMouldList(state, payload) {
      state.selectedMouldList = payload;
    }
  },
  actions: {
    async getProductList(context, payload) {
      await axios.get('/product/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProduct', res.data.list);
          context.commit('setListLoading', false);
          context.state.productListLength = res.data.total;
        }
      });
    },
    async getProductBase(context, payload) {
      await axios.get('/product/base/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProductBase', res.data);
          context.commit('setBaseLoading', false);
        }
      });
    },
    async getProductDetail(context, payload) {
      await axios.get('/product/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProductDetail', res.data);
          context.commit('setDetailLoading', false);
        }
      });
    },
    async getSingleDetailMsg(context, payload) {
      await axios.get('/product/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSingleProductDetail', res.data);
        }
      });
    },
    async updateSingleProductMsg(_, payload) {
      await axios.post('/product/base/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getProjectMember(context, payload) {
      await axios.get('/product/member/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProjectMember', res.data.list);
          context.commit('setMemberLoading', false);
          context.state.memberListLength = res.data.total;
        }
      });
    },
    async createProjectMember(_, payload) {
      await axios.post('/product/member/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateProjectMember(_, payload) {
      await axios.post('/product/member/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteProjectMember(_, payload) {
      await axios.post('/product/member/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getPricingList(context, payload) {
      await axios.get('/pricing/product/list', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.final_confirmed_price =
              item.final_confirmed_price && `￥${item.final_confirmed_price}`;
          });
          context.commit('setPricingList', res.data.list);
          context.commit('setPricingLoading', false);
        }
      });
    },
    async getMouldList(context, payload) {
      await axios.get('/product/mould/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMouldList', res.data.list);
          context.commit('setMouldLoading', false);
          context.state.mouldListLength = res.data.total;
        }
      });
    },
    async createMould(_, payload) {
      await axios
        .post('/product/mould/relation/create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async deleteMould(_, payload) {
      await axios
        .post('/product/mould/relation/delete', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getSampleList(context, payload) {
      await axios.get('/sample/part/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSampleList', res.data.list);
          context.commit('setSampleLoading', false);
          context.state.sampleListLength = res.data.total;
        }
      });
    },
    async getQuestionList(context, payload) {
      await axios.get('/product/test-problem/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setQuestionList', res.data.list);
          context.commit('setQuestionLoading', false);
          context.state.questionListLength = res.data.total;
        }
      });
    },
    async submitQuestionResult(_, payload) {
      await axios.post('/product/test-problem/result', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getContent(context, payload) {
      await axios.get('/reason/text/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setContent', res.data);
        }
      });
    },
    async getPackageList(context, payload) {
      await axios.get('/package/part/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPackageList', res.data.list);
          context.commit('setPackageLoading', false);
          context.state.packageListLength = res.data.total;
        }
      });
    },
    async createPackageResult(_, payload) {
      await axios.post('/package/result/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async terminateProject(_, payload) {
      await axios.post('/product/single/terminate', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getSelectedMouldList(context, payload) {
      await axios.get('/mould/complete/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSelectedMouldList', res.data.list);
          context.state.selectedMouldListLength = res.data.total;
        }
      });
    },
    async confirmProductResult(_, payload) {
      await axios.post('/product/result/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
