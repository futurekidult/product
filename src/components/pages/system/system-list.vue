<template>
  <base-breadcrumb />
  <div class="border">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="组织管理"
        name="organization"
      >
        <organization-list :organization-list="organizationList" />
      </el-tab-pane>
      <el-tab-pane
        label="用户管理"
        name="user"
      >
        <admin-list
          :admin-list="adminList"
          :role-list="roleList"
          :organization-list="organizationList"
        />
      </el-tab-pane>
      <el-tab-pane
        label="角色管理"
        name="role"
      >
        <role-list
          :role-list="roleList"
          :privilege-list="privilegeList"
        />
      </el-tab-pane>
      <el-tab-pane
        label="权限管理"
        name="authority"
      >
        <privilege-list :privilege-list="privilegeList" />
      </el-tab-pane>
      <el-tab-pane
        label="基础数据"
        name="basic"
      >
        <basic-data />
      </el-tab-pane>
      <el-tab-pane
        label="待办转移"
        name="todo"
      >
        <todo-management />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OrganizationList from './organization-list.vue';
import AdminList from './admin-list.vue';
import RoleList from './role-list.vue';
import PrivilegeList from './privilege-list.vue';
import BasicData from './basic-data.vue';
import TodoManagement from './todo-management.vue';

export default {
  components: {
    OrganizationList,
    AdminList,
    RoleList,
    PrivilegeList,
    BasicData,
    TodoManagement
  },
  provide() {
    return {
      getAdminList: this.getAdminList,
      getRoleList: this.getRoleList
    };
  },
  data() {
    return {
      activeName: 'organization',
      organizationList: [],
      roleList: [],
      adminList: [],
      privilegeList: []
    };
  },
  mounted() {
    this.getOrganizationList();
    this.getRoleList();
  },
  methods: {
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      await this.$store.dispatch('system/getOrganizationList');
      this.organizationList = this.$store.state.system.organizationList;
    },
    async getPrivilegeList() {
      this.$store.commit('system/setPrivilegeLoading', true);
      await this.$store.dispatch('system/getPrivilegeList');
      this.privilegeList = this.$store.state.system.privilegeList;
    },
    async getAdminList() {
      this.$store.commit('system/setAdminLoading', true);
      await this.$store.dispatch('system/getAdminList');
      this.adminList = this.$store.state.system.adminList;
    },
    async getRoleList() {
      this.$store.commit('system/setRoleLoading', true);
      await this.$store.dispatch('system/getRoleList');
      this.roleList = this.$store.state.system.roleList;
    },
    handleClick(tab) {
      switch (tab.props.name) {
        case 'organization':
          this.getOrganizationList();
          break;
        case 'privilege':
          this.getPrivilegeList();
          break;
        case 'admin':
          this.getAdminList();
          break;
        case 'role':
          this.getRoleList();
          break;
        default:
      }
    }
  }
};
</script>
