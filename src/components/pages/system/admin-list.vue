<template>
  <base-breadcrumb />

  <div class="border">
    <div class="nav-title">
      <span class="line">|</span> 用户列表
    </div>

    <div v-loading="$store.state.system.adminLoading">
      <el-table
        :data="adminList"
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          label="姓名"
          prop="name"
        />
        <el-table-column
          label="所属部门"
          prop="department"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button :type="scope.row.state === 1 ? 'danger' : 'primary'">
              {{ scope.row.state === 1 ? '封禁账号' : '解除封禁' }}
            </el-button>
            <el-button
              type="warning"
              @click="showRoleForm(scope.row.id)"
            >
              配置角色
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog
    v-model="roleVisible"
    title="配置用户角色"
    width="30%"
  >
    <el-form
      ref="roleForm"
      :model="roleForm"
      label-width="120px"
    >
      <el-form-item
        label="用户角色组"
        prop="role_ids"
        :rules="[{ required: true, message: '请选择' }]"
      >
        <el-checkbox-group
          v-model="roleForm.role_ids"
          clearable
        >
          <el-checkbox
            v-for="(item, index) in roleList"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <div class="bg">
          角色组定义了用户可访问的功能模块和可执行操作, 可多选
        </div>
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeRoleForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitRoleForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      roleVisible: false,
      roleForm: {},
      adminId: 0,
      organizationList: [],
      adminList: [],
      roleList: []
    };
  },
  mounted() {
    this.getAdminList();
    this.getOrganizationList();
    this.getRoleList();
  },
  methods: {
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      await this.$store.dispatch('system/getOrganizationList');
      this.organizationList = this.$store.state.system.organizationList;
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
    async showRoleForm(id) {
      await this.$store.dispatch('system/getAdminRole', { params: { id } });
      this.roleForm = this.$store.state.system.adminRole;
      this.roleVisible = true;
    },
    async updateAdminRole(body) {
      await this.$store.dispatch('system/updateAdminRole', body);
      this.roleVisible = false;
      this.getAdminList();
    },
    closeRoleForm() {
      this.roleVisible = false;
    },
    submitRoleForm() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.updateAdminRole(this.roleForm);
        }
      });
    }
  }
};
</script>

<style scoped>
.bg {
  background: #e9f0f2;
  padding: 5px 10px;
  color: #999999;
  font-size: 13px;
}

.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}
.el-tree {
  color: #999999 !important;
  font-weight: 500;
}
</style>
