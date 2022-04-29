export default {
  namespaced: true,
  state() {
    return {
      buttonState: {},
      progress: {},
      surveyApply: [],
      planList: []
    };
  },
  mutations: {
    setButtonState(state, payload) {
      state.buttonState = payload;
    },
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setSurveyApply(state, payload) {
      state.surveyApply = payload;
    },
    setPlanList(state, payload) {
      state.planList = payload;
    }
  },
  actions: {
    getUserSurveyData(context) {
      let data = {
        button_state: {
          apply: 0,
          plan: 1,
          review: 0
        },
        progress: {
          id: 1,
          principal_id: 1,
          principal_desc: '张三',
          state: 1,
          state_desc: '待完成',
          actual_start_time: 1649658153,
          estimated_finish_time: 1649658153,
          actual_finish_time: 1649658153
        },
        survey_apply: [
          {
            id: 1,
            state: 10,
            state_desc: '待评审',
            applicant_id: 1,
            applicant_desc: '张三',
            create_time: 1649658153,
            review_finish_time: 1649658153
          },
          {
            id: 1,
            state: 20,
            state_desc: '评审不通过',
            applicant_id: 1,
            applicant_desc: '张三',
            create_time: 1649658153,
            review_finish_time: 1649658153
          },
          {
            id: 1,
            state: 30,
            state_desc: '评审通过',
            applicant_id: 1,
            applicant_desc: '张三',
            create_time: 1649658153,
            review_finish_time: 1649658153
          }
        ],
        plan_list: [
          {
            id: 1,
            proceeding: 1,
            detail: 1,
            state: 1,
            state_desc: '待完成',
            operator_desc: '张三',
            estimated_finish_time: 1649658153,
            actual_finish_time: 1649658153,
            attachment: 1,
            has_approval_process: '是'
          },
          {
            id: 1,
            proceeding: 1,
            detail: 1,
            state: 2,
            state_desc: '已完成',
            operator_desc: '张三',
            estimated_finish_time: 1649658153,
            actual_finish_time: 1649658153,
            attachment: 1,
            has_approval_process: '否'
          }
        ]
      };
      context.commit('setButtonState', data.button_state);
      context.commit('setProgressData', data.progress);
      context.commit('setSurveyApply', data.survey_apply);
      context.commit('setPlanList', data.plan_list);
    }
  }
};
