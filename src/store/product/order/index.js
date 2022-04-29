import axios from '../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      orderList: [],
      length: 0,
      progress: {},
      sku: {},
      contract: {},
      preProductSample: {}
    };
  },
  mutations: {
    setOrderList(state, payload) {
      state.orderList = payload;
    },
    setLength(state, payload) {
      state.length = payload;
    },
    setProgress(state, payload) {
      state.progress = payload;
    },
    setSku(state, payload) {
      state.sku = payload;
    },
    setContract(state, payload) {
      state.contract = payload;
    },
    setPreProduct(state, payload) {
      state.preProductSample = payload;
    }
  },
  actions: {
    async getOrderList(context) {
      let data = {
        total: 2,
        current_page: 1,
        page_size: 2,
        list: [
          {
            id: 1,
            pricing_id: 1,
            final_price: '199.99',
            supplier_id: 1,
            estimated_finish_time: 1648777876,
            actual_finish_time: 1648777876,
            pre_production_sample_quantity: 6,
            state: 10,
            state_desc: 'SKU命名中'
          },
          {
            id: 2,
            pricing_id: 1,
            final_price: '199.99',
            supplier_id: 1,
            estimated_finish_time: 1648777876,
            actual_finish_time: 1648777876,
            pre_production_sample_quantity: 6,
            state: 10,
            state_desc: 'SKU命名中'
          }
        ]
      };
      context.commit('setOrderList', data.list);
      context.commit('setLength', data.total);
      // await axios.get('/order/list/', payload).then((res) => {
      //   if (res.code === 200) {
      //     context.commit('setOrderList', res.data.list);
      //     context.commit('setLength', res.data.total);
      //   } else {
      //     ElMessage.error(res.message);
      //   }
      // });
    },
    async getProgress(context) {
      let data = {
        id: 1,
        product_id: 1,
        pricing_id: 1,
        final_price: '199.99',
        supplier_id: 1,
        estimated_finish_time: 1648777876,
        actual_finish_time: 1648777876,
        state: 10,
        state_desc: 'SKU命名中'
      };
      context.commit('setProgress', data);
      // await axios.get('/order/get/', payload).then((res) => {
      //   if (res.code === 200) {
      //     context.commit('setProgress', res.data);
      //   } else {
      //     ElMessage.error(res.message);
      //   }
      // });
    },
    async getSkuForm(context) {
      // await axios.get('/order/sku/get/', payload).then((res) => {
      //   if (res.code === 200) {
      //     context.commit('setSku', res.data);
      //   } else {
      //     ElMessage.error(res.message);
      //   }
      // });
      let data = {
        id: 1,
        order_id: 1,
        sku_name_schedule: {
          principal: '小张',
          actual_finish_time: 1648782435,
          state: 10,
          state_desc: '已完成'
        },
        sku_info: {
          sku: [
            {
              platform: 10,
              platform_desc: 'Amazon',
              name: 'SKU-AS'
            },
            {
              platform: 20,
              platform_desc: 'Wayfair',
              name: 'SKU-AS'
            }
          ],
          project_plan_file: {
            id: 1,
            name: '项目计划书.pdf',
            type: 1
          }
        },
        sku_entry_schedule: {
          principal: '小刘',
          actual_finish_time: 1648782435,
          state: 10,
          state_desc: '待完成'
        }
      };
      context.commit('setSku', data);
    },
    async getContract(context) {
      let data = {
        export_contract: {
          id: 1,
          principal: '小刘',
          state: 10,
          state_desc: '已完成',
          actual_finish_time: 1648782435
        },
        purchase_contract: {
          id: 2,
          principal: '小张',
          state: 10,
          state_desc: '待完成',
          actual_finish_time: 1648782435,
          product_manual_file: {
            id: 1,
            name: '产品说明附件.pdf',
            type: 1
          },
          diecuts_file: {
            id: 1,
            name: '刀模附件.pdf',
            type: 1
          }
        }
      };
      context.commit('setContract', data);
    },
    async confirmExportContract(_, payload) {
      await axios
        .post('/order/export-contract/confirm', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async confirmPurchaseContract(_, payload) {
      await axios
        .post('/order/purchase-contract/confirm/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async getPreProduct(context) {
      // await axios
      //   .get('/order/pre-production-sample/get/', payload)
      //   .then((res) => {
      //     if (res.code === 200) {
      //       context.commit('setPreProduct', res.data);
      //     }
      //   });
      let data = {
        id: 1,
        principal: 2,
        estimated_arrival_time: 1648782435,
        pre_production_sample_quantity: 6,
        actual_arrival_time: 1648782435,
        actual_finish_time: 1648782435,
        courier_number: 'SF202295121001',
        state: 10,
        state_desc: '已到货'
      };
      context.commit('setPreProduct', data);
    },
    async followupSheet(_, payload) {
      await axios
        .post('/order/follow-up-sheet/create/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async receiptSheet(_, payload) {
      await axios.post('/order/goods-receipt/create/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async confirmPreProduct(_, payload) {
      await axios
        .post('/order/pre-production-sample/confirm/', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async completeSkuEntry(_, payload) {
      await axios.post('/order/sku/entry/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
