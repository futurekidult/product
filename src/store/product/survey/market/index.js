import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      market: {}
    };
  },
  mutations: {
    setMarketData(state, payload) {
      state.market = payload;
    }
  },
  actions: {
    getMarketData(context) {
      let data = {
        progress: {
          id: 1,
          principal_id: 1,
          principal_desc: '张三',
          is_multi_market: '是',
          market_name: '市场名称',
          state: 10,
          state_desc: '待完成',
          estimated_finish_time: 1649658153,
          actual_finish_time: 1649658153
        },
        report: {
          id: 1,
          type: 1,
          name: '报告名称'
        }
      };
      context.commit('setMarketData', data);
    },
    async submitMarketFile(_, payload) {
      await axios.post('/survey/market/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
