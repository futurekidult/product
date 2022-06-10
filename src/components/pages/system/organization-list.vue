<template>
  <div class="nav-title">
    <span class="line">|</span> 部门列表
  </div>

  <el-tree
    v-loading="$store.state.system.organizationLoading"
    :data="organizationList"
    :props="defaultProps"
  />
</template>

<script>
export default {
  props: ['organizationList'],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  }
};
</script>
