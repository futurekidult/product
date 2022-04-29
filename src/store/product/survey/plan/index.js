export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      planForm: {}
    };
  },
  mutations: {
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setPlanformData(state, payload) {
      state.planForm = payload;
    }
  },
  actions: {
    getPlanData(context) {
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
          usage_scenario: ['场景1', '场景2'],
          pain_spot: '用户痛点',
          user_demand_analysis: '用户需求分析',
          pointcut: '产品切入点',
          competitive_product: [
            {
              images: [
                {
                  id: 1,
                  type: 1,
                  name: '图片名'
                },
                {
                  id: 2,
                  type: 1,
                  name: '图片名'
                }
              ],
              link: '竞品链接',
              parameter: '竞品参数',
              reason: '对标理由'
            },
            {
              images: [
                {
                  id: 1,
                  type: 1,
                  name: '图片名'
                },
                {
                  id: 2,
                  type: 1,
                  name: '图片名'
                }
              ],
              link: '竞品链接',
              parameter: '竞品参数',
              reason: '对标理由'
            }
          ],
          inner_box_dimension_l: '内箱尺寸长',
          inner_box_dimension_w: '内箱尺寸宽',
          inner_box_dimension_h: '内箱尺寸高',
          outer_box_dimension_l: '外箱尺寸长',
          outer_box_dimension_w: '外箱尺寸宽',
          outer_box_dimension_h: '外箱尺寸高',
          inner_box_weight: 1,
          outer_box_weight: 1,
          head_cost_currency: 1,
          head_cost: 1,
          head_cost_rmb: 1,
          tail_cost_currency: 1,
          tail_cost: 1,
          tail_cost_rmb: 1,
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
