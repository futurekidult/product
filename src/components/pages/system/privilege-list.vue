<template>
  <div class="nav-title">
    <span class="line">|</span> 菜单权限列表
  </div>

  <el-tree
    v-loading="$store.state.system.privilegeLoading"
    :data="privilegeList"
    :props="defaultProps"
  />
</template>

<script>
export default {
  props: ['privilegeList'],
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
