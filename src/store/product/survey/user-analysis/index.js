export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      analysisForm: {}
    };
  },
  mutations: {
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setFormData(state, payload) {
      state.analysisForm = payload;
    }
  },
  actions: {
    getAnalysisData(context) {
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
          gender: 1,
          age: 1,
          profession: '职业',
          diploma: 1,
          annual_household_income: 1,
          marital_status: 1,
          country: [
            {
              country_id: 1,
              region_id: 1,
              city_id: 1
            },
            {
              country_id: 1,
              region_id: 1,
              city_id: 1
            }
          ],
          usage_scenario: ['场景1', '场景2'],
          remark: '备注',
          attachment: {
            id: 1,
            type: 1,
            name: '附件.doc'
          }
        }
      };
      context.commit('setProgressData', data.progress);
      context.commit('setFormData', data.report);
    }
  }
};
