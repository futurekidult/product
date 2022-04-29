import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      enum: {},
      patent: {},
      progress: {},
      contract: {},
      report: {},
      singlePatent: {}
    };
  },
  mutations: {
    setEnum(state, payload) {
      state.enum = payload;
    },
    setPatent(state, payload) {
      state.patent = payload;
    },
    setProgress(state, payload) {
      state.progress = payload;
    },
    setContract(state, payload) {
      state.contract = payload;
    },
    setReport(state, payload) {
      state.report = payload;
    },
    setSinglePatent(state, payload) {
      state.singlePatent = payload;
    }
  },
  actions: {
    getEnum(context) {
      let params = {
        type: [
          {
            key: 10,
            value: '外观专利'
          },
          {
            key: 20,
            value: '发明专利'
          },
          {
            key: 30,
            value: '实用新型'
          }
        ],
        countries: [
          {
            key: 10,
            value: '美国'
          },
          {
            key: 20,
            value: '英国'
          },
          {
            key: 30,
            value: '欧盟'
          },
          {
            key: 40,
            value: '日本'
          },
          {
            key: 50,
            value: '中国'
          }
        ]
      };
      context.commit('setEnum', params);
    },
    async getPatent(context) {
      // await axios.get('/patent/list', payload).then((res) => {
      //   if (res.code === 200) {
      //     context.commit('setPatent', res.data);
      //   } else {
      //     ElMessage.error(res.message);
      //   }
      // });
      let data = {
        product_name_cn: '一款有潜力的太阳能灯',
        button_state: 1,
        patent_list: [
          {
            id: 1,
            applicant: '小王',
            submit_time: 1639980000,
            review_time: 1640980000,
            patent_types: '外观专利，发明专利',
            review_state: 20,
            review_state_desc: '评审不通过'
          },
          {
            id: 2,
            applicant: '小王',
            submit_time: 1639980000,
            review_time: 1640980000,
            patent_types: '外观专利，发明专利',
            review_state: 10,
            review_state_desc: '评审通过'
          }
        ],
        competitive_product: [
          {
            images: [
              {
                id: 1,
                name: 'img_1.jpg',
                type: 3
              },
              {
                id: 2,
                name: 'img_2.jpg',
                type: 3
              }
            ],
            link: 'www.amazon.com/123456',
            parameter: 'xxxxx',
            reason: ' xxxxxx'
          },
          {
            images: [
              {
                id: 4,
                name: 'img_4.jpg',
                type: 3
              }
            ],
            link: 'www.amazon.com/123478',
            parameter: 'xxxxx',
            reason: ' xxxxxx'
          }
        ]
      };
      context.commit('setPatent', data);
    },
    async getProgress(context) {
      let data = {
        principal: '小刘',
        estimated_finish_time: 1645980000,
        actual_finish_time: 0,
        state: 10,
        state_desc: '待完成'
      };
      context.commit('setProgress', data);
    },
    async getContract(context) {
      let data = {
        principal: '小刘',
        actual_finish_time: 1645980000,
        result_file: {
          id: 1,
          name: 'contract.pdf',
          type: 2
        },
        state: 10,
        state_desc: '已完成'
      };
      context.commit('setContract', data);
    },
    async getReport(context) {
      let data = {
        principal: '小刘',
        actual_finish_time: 1645980000,
        result_file: {
          id: 1,
          name: 'contract.pdf',
          type: 2
        },
        state: 40,
        state_desc: '已完成'
      };
      context.commit('setReport', data);
    },
    async patentApply(_, payload) {
      await axios.post('/patent/apply', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async viewPatentReview(context) {
      let data = {
        review_result: 1,
        patent: {
          patent_types: [10, 20],
          product_name_cn: '一款有潜力的太阳能灯',
          product_name_en: 'a potencial light',
          coutries: [10, 20],
          sale_link: 'www.amazon.com'
        }
      };
      context.commit('setSinglePatent', data);

      // await axios.get('/patent/application/get', payload).then((res) => {
      //   if (res.code === 200) {
      //     context.commit('setSinglePatent', res.data);
      //   }
      // });
    },
    async patentReview(_, payload) {
      await axios.post('patent/review', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmPatent(_, payload) {
      await axios.post('/patent/confirm', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async uploadContract(_, payload) {
      await axios.post('/patent/contract/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async uploadReport(_, payload) {
      await axios.post('/patent/report/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
