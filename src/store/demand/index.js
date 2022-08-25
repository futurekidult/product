import { ElMessage } from 'element-plus';
import axios from '../../utils/axios';
import { formatterTime } from '../../utils/index'

export default {
  namespaced: true,
  state() {
    return {
      demandList: [],
      demandLoading: true,
      reasonText: '',
      categoryList: [],
      demandDetail: {},
      demandReviewDetail: {},
      demandDetailLoading: true,
      demandReviewDetailLoading: true,
      optionLoading: true,
      demandListLength: 0,
      draftList: [],
      draftListLength: 0
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
    setDemandReviewDetail(state, payload) {
      state.demandReviewDetail = payload;
    },
    setDemandDetailLoading(state, payload) {
      state.demandDetailLoading = payload;
    },
    setDemandReviewDetailLoading(state, payload) {
      state.demandReviewDetailLoading = payload;
    },
    setDraftList(state, payload) {
      state.draftList = payload;
    },
    setDraftListLength(state, payload) {
      state.draftListLength = payload;
    }
  },
  actions: {
    async getDemandList(context, payload) {
      await axios.get('/demand/all/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setList', res.data.list);
          context.commit('setDemandLoading', false);
          context.state.demandListLength = res.data.total;
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
        }
      });
    },
    async getDemandDetail(context, payload) {
      await axios.get('/demand/detail/get', payload).then((res) => {
        if (res.code === 200) {
          res.data.create_time = formatterTime(res.data.create_time);
          context.commit('setDemandDetail', res.data);
          context.commit('setDemandDetailLoading', false);
        }
      });
    },
    async getDemandReviewDetail(context, payload) {
      await axios.get('/demand/review/detail/get', payload).then((res) => {
        if (res.code === 200) {
          res.data.create_time = formatterTime(res.data.create_time);
          context.commit('setDemandReviewDetail', res.data);
          context.commit('setDemandReviewDetailLoading', false);
        }
      });
    },
    async reviewDemandForm(_, payload) {
      await axios.post('/demand/entry/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateDemandForm(_, payload) {
      await axios.post('/demand/review/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getDraftList(context, payload) {
      await axios.get('/demand/draft/list', payload).then((res) => {
        if(res.code === 200) {
          context.commit('setDraftList', res.data.list);
          context.commit('setDraftListLength', res.data.total);
        }
      });
    },
    async deleteDraftItem(_, payload) {
      await axios.post('/demand/draft/delete', payload).then((res) => {
        if(res.code === 200) {
          ElMessage.success(res.message);
        }
      })
    }
  }
};
