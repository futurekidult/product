import { ElMessage } from 'element-plus';
import axios from '../../utils/axios';

export default {
  namespaced: true,
  state() {
    return {
      demandList: [],
      demandLoading: true,
      reasonText: '',
      categoryList: [],
      isSuccess: false,
      demandDetail: {},
      demandDetailLoading: true,
      optionLoading: true
    };
  },
  mutations: {
    setList(state, payload) {
      state.demandList = payload;
    },
    setDemandLoading(state, payload) {
      state.demandLoading = payload;
    },
    setReasonText(state, payload) {
      state.reasonText = payload;
    },
    setCategoryList(state, payload) {
      state.categoryList = payload;
    },
    setDemandDetail(state, payload) {
      state.demandDetail = payload;
    },
    setDemandDetailLoading(state, payload) {
      state.demandDetailLoading = payload;
    }
  },
  actions: {
    async getDemandList(context, payload) {
      await axios.get('/demand/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setList', res.data.list);
          context.commit('setDemandLoading', false);
        }
      });
    },
    async getReasonText(context, payload) {
      await axios.get('/reason/text/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setReasonText', res.data.content);
        }
      });
    },
    async getCategoryList(context, payload) {
      await axios.get('/option/category/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setCategoryList', res.data.list);
          context.state.optionLoading = false;
        }
      });
    },
    async createDemandForm(context, payload) {
      await axios.post('/demand/detail/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          context.state.isSuccess = true;
        } else {
          context.state.isSuccess = false;
        }
      });
    },
    async getDemandDetail(context, payload) {
      await axios.get('/demand/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setDemandDetail', res.data);
          context.commit('setDemandDetailLoading', false);
        }
      });
    },
    async reviewDemandForm(context, payload) {
      await axios.post('/demand/entry/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
