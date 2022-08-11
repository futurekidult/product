<template>
  <base-breadcrumb />

  <div class="border">
    <div class="nav-title">
      <span class="line">|</span> 部门列表
    </div>

    <el-tree
      v-loading="$store.state.system.organizationLoading"
      :data="organizationList"
      :props="defaultProps"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      organizationList: []
    };
  },
  mounted() {
    this.getOrganizationList();
  },
  methods: {
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      try {
        await this.$store.dispatch('system/getOrganizationList');
        this.organizationList = this.$store.state.system.organizationList;
      } catch (err) {
        this.$store.commit('system/setOrganizationLoading', false);
        return;
      }
    }
  }
};
</script>
