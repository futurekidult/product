import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      project: {},
      profit: {},
      schedule: {},
      specialist: [],
      profitCalculation: {},
      adjustment: {}
    };
  },
  mutations: {
    setProject(state, payload) {
      state.project = payload;
    },
    setProfit(state, payload) {
      state.profit = payload;
    },
    setSchedule(state, payload) {
      state.schedule = payload;
    },
    setSpecialist(state, payload) {
      state.specialist = payload;
    },
    setProfitCalculation(state, payload) {
      state.profitCalculation = payload;
    },
    serAdjustment(state, payload) {
      state.adjustment = payload;
    }
  },
  actions: {
    getProject(context) {
      let data = {
        schedule: {
          project_administrator: '小刘',
          actual_finish_time: 0,
          review_state: 10,
          review_state_desc: '待评审',
          state: 40,
          state_desc: '待完成'
        },
        form: {
          review_result: 1,
          unapproved_reason: 'xxxxxxx',
          sale_plan: {
            id: 2,
            name: '销售计划表.doc',
            type: 1
          }
        }
      };
      context.commit('setProject', data);
    },
    getProfit(context) {
      let data = {
        review_state: 40,
        review_state_desc: '待评审',
        list: [
          {
            market: 1,
            market_desc: '美国',
            platform: 'Amazon、Wayfair',
            is_mould_making: '是'
          },
          {
            market: 2,
            market_desc: '英国',
            platform: 'Amazon',
            is_mould_making: '是'
          }
        ]
      };
      context.commit('setProfit', data);
    },
    getSchedule(context) {
      let data = {
        review_state: 10,
        review_state_desc: '待评审',
        list: [
          {
            id: 2,
            stage: 10,
            stage_desc: '定价阶段',
            estimated_finish_time: 1634856400,
            actual_finish_time: 1635856400,
            state: 30,
            state_desc: '逾期完成'
          },
          {
            id: 3,
            stage: 20,
            stage_desc: '专利阶段',
            estimated_finish_time: 1634856400,
            actual_finish_time: 1633856400,
            state: 20,
            state_desc: '正常完成'
          },
          {
            id: 4,
            stage: 30,
            stage_desc: '样品阶段',
            estimated_finish_time: 1634856400,
            actual_finish_time: 1635856400,
            state: 30,
            state_desc: '逾期完成'
          },
          {
            id: 5,
            stage: 40,
            stage_desc: '下单阶段',
            estimated_finish_time: 1634856400,
            actual_finish_time: 1634856400,
            state: 20,
            state_desc: '正常完成'
          },
          {
            id: 6,
            stage: 50,
            stage_desc: '包材阶段',
            estimated_finish_time: 1634856400,
            actual_finish_time: 1635856400,
            state: 30,
            state_desc: '逾期完成'
          },
          {
            id: 7,
            stage: 60,
            stage_desc: '出货时间',
            estimated_finish_time: 1634856400,
            actual_finish_time: 1635856400,
            state: 0,
            state_desc: ''
          },
          {
            id: 8,
            stage: 70,
            stage_desc: '开卖时间',
            estimated_finish_time: 1634856400,
            actual_finish_time: 0,
            state: 0,
            state_desc: ''
          }
        ]
      };
      context.commit('setSchedule', data);
    },
    async updateEstimatedTime(_, payload) {
      await axios
        .post('/project/schedule/estimated/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async updateActualTime(_, payload) {
      await axios
        .post('/project/schedule/actual/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async setStageTime(_, payload) {
      await axios.post('/project/schedule/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createProfit(_, payload) {
      await axios
        .post('/project/profit-calculation/create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getOperationsSpecialist(context) {
      let data = [
        {
          platform: 10,
          platform_desc: 'Amazon',
          operations_specialist_id: 13
        },
        {
          platform: 20,
          platform_desc: 'Wayfair',
          operations_specialist_id: 15
        }
      ];
      context.commit('setSpecialist', data);
    },
    async updateOperationsSpecialist(_, payload) {
      await axios
        .post('/project/operations-specialist/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getProfitCalculation(context) {
      let data = {
        market: 1,
        is_mould_making: 1,
        list: [
          {
            id: 1,
            platform: 2,
            currency: 2,
            selling_price: '33.99',
            selling_price_rmb: '199.99',
            reference_price: '99.99',
            operations_specialist_id: 14
          },
          {
            id: 2,
            platform: 3,
            currency: 2,
            selling_price: '36.99',
            selling_price_rmb: '209.99',
            reference_price: '109.99',
            operations_specialist_id: 13
          }
        ]
      };
      context.commit('setProfitCalculation', data);
    },
    async getAdjustment(context) {
      let data = {
        price_adjustment_apply_id: 2,
        state: 30,
        state_desc: '调价审批中',
        platform: 'Amazon',
        origin_selling_price: '199.99',
        applied_selling_price: '204.63',
        adjusted_selling_price_rmb: '205.02',
        reason: 'xxxxxxx',
        applicant: '张三',
        submit_time: 1645039900,
        apply_approve_result: '通过',
        apply_approve_time: 1650039900,
        operator: '李四',
        adjust_state: 10,
        adjust_state_desc: '待审批',
        currency: 20,
        adjusted_selling_price: '36.99'
      };
      context.commit('serAdjustment', data);
    }
  }
};
