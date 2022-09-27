<template>
  <div>
    <base-breadcrumb />
    <div class="border">
      <div class="system-item">
        <div class="nav-title">
          <span class="line">|</span> 角色列表
        </div>
      </div>

      <div v-loading="$store.state.system.productRoleLoading">
        <el-table
          stripe
          border
          :data="roleList"
          empty-text="无数据"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column
            label="角色名称"
            prop="name"
          />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                @click="showEditDialog(scope.row.id)"
              >
                编辑角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <role-form
        v-if="editVisible"
        :id="roleId"
        title="编辑角色"
        type="product edit"
        :dialog-visible="editVisible"
        :get-list="getRoleList"
        @hide-dialog="closeEditDialog"
      />
    </div>
  </div>
</template>

<script>
import RoleForm from './common/role-form.vue';

export default {
  components: {
    RoleForm
  },
  data() {
    return {
      editVisible: false,
      roleId: 0,
      roleList: []
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      this.$store.commit('system/setProductRoleLoading', true);
      try {
        await this.$store.dispatch('system/getProductRoleList');
        this.roleList = this.$store.state.system.productRoleList;
      } catch (err) {
        this.$store.commit('system/setProductRoleLoading', false);
        return;
      }
    },
    showEditDialog(id) {
      this.editVisible = true;
      this.roleId = id;
    },
    closeEditDialog() {
      this.editVisible = false;
    }
  }
};
</script>

<style scoped>
.prompt-literal {
  margin-bottom: 30px;
  text-align: center;
}

.prompt-operate {
  text-align: center;
}
</style>
