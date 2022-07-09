import { createRouter, createWebHistory } from 'vue-router';
import Manage from './components/layout/manage.vue';
import WorkBench from './components/pages/workbench/workbench-list.vue';
import DemandList from './components/pages/demand/demand-list.vue';
import DemandCreate from './components/pages/demand/demand-create.vue';
import DemandEdit from './components/pages/demand/demand-edit.vue';
import DemandDetail from './components/pages/demand/demand-detail/demand-detail.vue';
import SupplyList from './components/pages/supplier/supply-list.vue';
import SupplierCreate from './components/pages/supplier/supplier-create.vue';
import SupplierDetail from './components/pages/supplier/supplier-detail.vue';
import BlackList from './components/pages/supplier/black-list.vue';
import SupplierUpdate from './components/pages/supplier/supplier-update.vue';
import PriceList from './components/pages/price/price-list.vue';
import QuotationList from './components/pages/price/quotation-list.vue';
import MouldList from './components/pages/mould/mould-list.vue';
import MouldDetail from './components/pages/mould/mould-detail.vue';
import SampleList from './components/pages/sample/sample-list.vue';
import SampleDetail from './components/pages/sample/sample-detail.vue';
import ProductList from './components/pages/product/product-list.vue';
import ProductDetail from './components/pages/product/product-detail.vue';
import OrderDetail from './components/pages/product/process/order-detail.vue';
import NotFound from './components/pages/not-found.vue';
import OrganziationList from './components/pages/system/organization-list.vue';
import AdminList from './components/pages/system/admin-list.vue';
import RoleList from './components/pages/system/role-list.vue';
import PrivilegeList from './components/pages/system/privilege-list.vue';
import CalculationRule from './components/pages/system/calculation-rule.vue';
import RateList from './components/pages/system/rate-list.vue';
import TodoList from './components/pages/system/todo-list.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Manage,
      redirect: '/work-bench',
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
            },
            {
              path: '/demand-list/edit/:id',
              component: DemandEdit,
              name: 'demand edit',
              meta: {
                title: '编辑需求'
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
            },
            {
              path: '/supplist-list/supplier-update/:id',
              name: 'supplier update',
              component: SupplierUpdate,
              meta: {
                title: '编辑供应商'
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
          path: '/black-list',
          name: 'black list',
          component: BlackList,
          meta: {
            title: '黑名单'
          }
        },
        {
          path: '/price-list',
          name: 'price',
          component: PriceList,
          meta: {
            title: '定价列表'
          },
          children: [
            {
              path: ':id',
              component: QuotationList,
              name: 'price detail',
              meta: {
                title: '报价列表'
              },
              props: true
            }
          ]
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
        },
        {
          path: '/system-list/organization-list',
          name: 'organization',
          component: OrganziationList,
          meta: {
            title: '组织管理'
          }
        },
        {
          path: '/system-list/admin-list',
          name: 'admin',
          component: AdminList,
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/system-list/role-list',
          name: 'role',
          component: RoleList,
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/system-list/privilege-list',
          name: 'privilege',
          component: PrivilegeList,
          meta: {
            title: '权限管理'
          }
        },
        {
          path: '/system-list/basic-data/profit-calculation/rule',
          name: 'rule',
          component: CalculationRule,
          meta: {
            title: '核算利润规则'
          }
        },
        {
          path: '/system-list/basic-data/rate-list',
          name: 'rate',
          component: RateList,
          meta: {
            title: '汇率表'
          }
        },
        {
          path: '/system-list/todo-list',
          name: 'todo list',
          component: TodoList,
          meta: {
            title: '待办转移'
          }
        }
      ]
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    }
  ]
});

export default router;