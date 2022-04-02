<template>
  <el-breadcrumb
    separator="/"
    class="border"
  >
    <el-breadcrumb-item
      v-for="(item, index) in breadList"
      :key="index"
      :to="{ path: item.path }"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      breadList: []
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    isHome(route) {
      return route.name === 'workbench';
    },
    getBreadcrumb() {
      let { matched } = this.$route;
      let prefix = [{ path: '/work-bench', meta: { title: '首页' } }];
      if (!this.isHome(matched[1])) {
        switch (matched[1].name) {
          case 'demand':
          case 'demand create':
            prefix = prefix.concat({
              path: '/demand-list',
              meta: { title: '需求管理' }
            });
            break;
          case 'supplier':
          case 'supplier create':
            prefix = prefix.concat({
              path: '/supplier-list',
              meta: { title: '供应商管理' }
            });
            break;
          case 'price':
          case 'quotation':
            prefix = prefix.concat({
              path: '/price-list',
              meta: { title: '定价管理' }
            });
            break;
          case 'mould':
            prefix = prefix.concat({
              path: '/mould-list',
              meta: { title: '模具管理' }
            });
            break;
          case 'sample':
            prefix = prefix.concat({
              path: '/sample-list',
              meta: { title: '样品管理' }
            });
            break;
          case 'product':
            prefix = prefix.concat({
              path: '/product-list',
              meta: { title: '新品管理' }
            });
            break;
          default:
        }
        matched = prefix.concat(matched[matched.length - 1]);
      } else {
        matched = prefix;
      }
      this.breadList = matched;
    }
  }
};
</script>
