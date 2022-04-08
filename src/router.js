import { createRouter, createWebHashHistory } from 'vue-router';
import Manage from './components/layout/manage.vue';
import WorkBench from './components/pages/workbench/workbench-list.vue';
import DemandList from './components/pages/demand/demand-list.vue';
import DemandCreate from './components/pages/demand/demand-create.vue';
import DemandDetail from './components/pages/demand/demand-detail/demand-detail.vue';
import SupplyList from './components/pages/supplier/supply-list.vue';
import SupplierCreate from './components/pages/supplier/supplier-create.vue';
import SupplierDetail from './components/pages/supplier/supplier-detail.vue';
import PriceList from './components/pages/price/price-list.vue';
import QuotationList from './components/pages/price/quotation-list.vue';
import MouldList from './components/pages/mould/mould-list.vue';
import MouldDetail from './components/pages/mould/mould-detail.vue';
import SampleList from './components/pages/sample/sample-list.vue';
import SampleDetail from './components/pages/sample/sample-detail.vue';
import ProductList from './components/pages/product/product-list.vue';
import ProductDetail from './components/pages/product/product-detail.vue';
import OrderDetail from './components/pages/product/process/order-detail.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Manage,
      children: [
        {
          path: '/work-bench',
          name: 'workbench',
          component: WorkBench,
          meta: {
            title: '首页'
          }
        },
        {
          path: '/demand-list',
          name: 'demand',
          component: DemandList,
          meta: {
            title: '需求列表'
          },
          children: [
            {
              path: ':id',
              component: DemandDetail,
              name: 'demand detail',
              meta: {
                title: '需求详情'
              },
              props: true
            }
          ]
        },
        {
          path: '/create-demand',
          name: 'demand create',
          component: DemandCreate,
          meta: {
            title: '创建需求'
          }
        },
        {
          path: '/supplier-list',
          name: 'supplier',
          component: SupplyList,
          meta: {
            title: '供应商列表'
          },
          children: [
            {
              path: ':id',
              component: SupplierDetail,
              name: 'supplier detail',
              meta: {
                title: '供应商详情'
              },
              props: true
            }
          ]
        },
        {
          path: '/supplier-create',
          name: 'supplier create',
          component: SupplierCreate,
          meta: {
            title: '创建供应商'
          }
        },
        {
          path: '/price-list',
          name: 'price',
          component: PriceList,
          meta: {
            title: '定价列表'
          }
        },
        {
          path: '/quotation-list',
          component: QuotationList,
          name: 'quotation',
          meta: {
            title: '报价列表'
          }
        },
        {
          path: '/mould-list',
          component: MouldList,
          name: 'mould',
          meta: {
            title: '模具列表'
          },
          children: [
            {
              path: ':id',
              component: MouldDetail,
              name: 'mould detail',
              meta: {
                title: '模具详情'
              },
              props: true
            }
          ]
        },
        {
          path: '/sample-list',
          component: SampleList,
          name: 'sample',
          meta: {
            title: '样品列表'
          },
          children: [
            {
              path: ':id',
              component: SampleDetail,
              name: 'sample detail',
              meta: {
                title: '样品详情'
              },
              props: true
            }
          ]
        },
        {
          path: '/product-list',
          component: ProductList,
          name: 'product',
          meta: {
            title: '新品列表'
          },
          children: [
            {
              path: ':productId',
              component: ProductDetail,
              name: 'product detail',
              meta: {
                title: '新品详情'
              },
              children: [
                {
                  path: ':orderId',
                  component: OrderDetail,
                  name: 'order detail',
                  meta: {
                    title: '下单详情'
                  },
                  props: true
                }
              ],
              props: true
            }
          ]
        }
      ]
    }
  ]
});

export default router;
