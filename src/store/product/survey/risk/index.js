export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      riskForm: {}
    };
  },
  mutations: {
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setPlanformData(state, payload) {
      state.riskForm = payload;
    }
  },
  actions: {
    getRiskData(context) {
      let data = {
        progress: {
          id: 1,
          principal_id: 1,
          principal_desc: '张三',
          state: 1,
          state_desc: '待完成',
          estimated_finish_time: 1649658153,
          actual_finish_time: 1649658153
        },
        report: {
          inventive_patent: 1,
          need_verify: 1,
          design_patent: '外观专利',
          legal_regulation: '法律法规',
          other_risk: '其他风险',
          attachment: {
            id: 1,
            type: 1,
            name: '附件.doc'
          }
        }
      };
      context.commit('setProgressData', data.progress);
      context.commit('setPlanformData', data.report);
    }
  }
};
