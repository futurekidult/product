<template>
  <div>
    <div class="border">
      <div class="system-item">
        <div class="nav-title">
          <span class="line">|</span> 角色列表
        </div>
      </div>
      <base-table
        v-loading="$store.state.system.productRoleLoading"
        :table-data="roleList"
        :pagination-visible="false"
        :table-column="[{ label: '角色名称', prop: 'name' }]"
      >
        <template #default="slotProps">
          <el-button
            type="primary"
            @click="showEditDialog(slotProps.row.id)"
          >
            编辑角色
          </el-button>
        </template>
      </base-table>
      <role-form
        v-if="editVisible"
        :id="roleId"
        title="编辑角色"
        type="product edit"
        :dialog-visible="editVisible"
        :get-list="getRoleList"
        :close-on-click-modal="false"
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
