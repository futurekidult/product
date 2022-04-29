export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      platformForm: {}
    };
  },
  mutations: {
    setProcessData(state, payload) {
      state.progress = payload;
    },
    setFormData(state, payload) {
      state.platformForm = payload;
    }
  },
  actions: {
    getProcessData(context) {
      let process = {
        id: 1,
        principal_id: 1,
        principal_desc: '张三',
        is_multi_platform: '是',
        platform_desc: '平台名称',
        state: 1,
        state_desc: '待完成',
        estimated_finish_time: 1649658153,
        actual_finish_time: 1649658153
      };
      context.commit('setProcessData', process);
    },
    getPlatformData(context) {
      let data = {
        images: [
          {
            id: 1,
            type: 1,
            name: '图片.jpg'
          },
          {
            id: 1,
            type: 1,
            name: '图片.jpg'
          }
        ],
        product_link: '产品链接',
        specification_parameter: '规格参数',
        product_function: '产品功能',
        demand_analysis: '需求分析',
        annual_sales: 1,
        growth_rate: '销售额同比增长率',
        peak_season_start: 1,
        peak_season_end: 12,
        competitive_degree: 1,
        is_nosedive_category: 1,
        precise_price_range: 1,
        flow_richness: 1,
        is_nosedive_keyword: 1,
        keyword_bidding_degree: 1,
        is_benchmarking: 1,
        attachment: {
          id: 1,
          type: 1,
          name: '附件.doc'
        }
      };
      context.commit('setFormData', data);
    }
  }
};
