import axios from '../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      mouldList: [],
      mould: {},
      mouldLoading: true,
      listLoading: true,
      designProgress: {},
      designLoading: true,
      protoytpeLoading: true,
      prototypeProgress: {},
      makingMouldProgress: {},
      makingMouldLoading: true,
      testingMouldProgress: {},
      testingMouldLoading: true,
      mouldListLength: 0
    };
  },
  mutations: {
    setMouldList(state, payload) {
      state.mouldList = payload;
    },
    setListLoading(state, payload) {
      state.listLoading = payload;
    },
    setMould(state, payload) {
      state.mould = payload;
    },
    setDesignProgress(state, payload) {
      state.designProgress = payload;
    },
    setDesignLoading(state, payload) {
      state.designLoading = payload;
    },
    setPrototypeProgress(state, payload) {
      state.prototypeProgress = payload;
    },
    setPrototypeLoading(state, payload) {
      state.protoytpeLoading = payload;
    },
    setMakingMould(state, payload) {
      state.makingMouldProgress = payload;
    },
    setMakingMouldLoading(state, payload) {
      state.makingMouldLoading = payload;
    },
    setTestingMould(state, payload) {
      state.testingMouldProgress = payload;
    },
    setTestingMouldLoading(state, payload) {
      state.testingMouldLoading = payload;
    },
    setMouldLoading(state, payload) {
      state.mouldLoading = payload;
    }
  },
  actions: {
    async getMouldList(context, payload) {
      await axios.get('/mould/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMouldList', res.data.list);
          context.commit('setListLoading', false);
          context.state.mouldListLength = res.data.total;
        }
      });
    },
    async createMould(_, payload) {
      await axios.post('/mould/detail/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getMould(context, payload) {
      await axios.get('/mould/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMould', res.data);
          context.commit('setMouldLoading', false);
        }
      });
    },
    async getProductDesign(context, payload) {
      await axios.get('/mould/product-design/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setDesignProgress', res.data);
          context.commit('setDesignLoading', false);
        }
      });
    },
    async createProductDesign(_, payload) {
      await axios.post('/mould/product-design/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getPrototype(context, payload) {
      await axios.get('/mould/prototype/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPrototypeProgress', res.data);
          context.commit('setPrototypeLoading', false);
        }
      });
    },
    async createPrototype(_, payload) {
      await axios.post('/mould/prototype/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async approvalPrototype(_, payload) {
      await axios.post('/mould/prototype/approval', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getMakingMould(context, payload) {
      await axios.get('/mould/making/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMakingMould', res.data);
          context.commit('setMakingMouldLoading', false);
        }
      });
    },
    async createMakingMould(_, payload) {
      await axios.post('/mould/making/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateMakingMould(_, payload) {
      await axios.post('/mould/making/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async approvalMakingMould(_, payload) {
      await axios.post('/mould/making/approval', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getTestingMould(context, payload) {
      await axios.get('/mould/testing/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setTestingMould', res.data);
          context.commit('setTestingMouldLoading', false);
        }
      });
    },
    async approvalTestingMould(_, payload) {
      await axios.post('/mould/testing/approval', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async confirmTestingMould(_, payload) {
      await axios.post('/mould/testing/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
