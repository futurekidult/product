<template>
  <div class="system-item">
    <div class="nav-title">
      <span class="line">|</span> 角色列表
    </div>
    <el-button
      type="primary"
      @click="showCreateDialog"
    >
      新增角色
    </el-button>
  </div>

  <div v-loading="$store.state.system.roleLoading">
    <el-table
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
            type="danger"
            class="close-btn"
            @click="showDeleteRole(scope.row.id)"
          >
            删除
          </el-button>
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
    v-if="createVisible"
    title="新增角色"
    type="create"
    :dialog-visible="createVisible"
    :auth-list="privilegeList"
    @hide-dialog="closeCreateDialog"
  />

  <role-form
    v-if="editVisible"
    :id="roleId"
    title="编辑角色"
    type="edit"
    :dialog-visible="editVisible"
    :auth-list="privilegeList"
    @hide-dialog="closeEditDialog"
  />

  <el-dialog
    v-model="confirmDialog"
    title="提示"
    width="20%"
  >
    <div class="prompt-literal">
      确定要删除该角色吗
    </div>
    <div class="prompt-operate">
      <el-button
        class="cancel-btn"
        @click="closeConfirmDialog"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="deleteRole"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import RoleForm from './common/role-form.vue';

export default {
  components: {
    RoleForm
  },
  inject: ['getRoleList'],
  props: ['roleList', 'privilegeList'],
  data() {
    return {
      createVisible: false,
      editVisible: false,
      confirmDialog: false,
      roleId: 0,
      deleteId: 0
    };
  },
  methods: {
    async deleteRole() {
      await this.$store.dispatch('system/deleteRole', {
        id: this.deleteId
      });
      this.confirmDialog = false;
      this.getRoleList();
    },
    showCreateDialog() {
      this.createVisible = true;
    },
    closeCreateDialog() {
      this.createVisible = false;
    },
    showEditDialog(id) {
      this.editVisible = true;
      this.roleId = id;
    },
    closeEditDialog() {
      this.editVisible = false;
    },
    async showDeleteRole(id) {
      this.confirmDialog = true;
      this.deleteId = id;
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
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
