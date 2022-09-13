<template>
  <div>
    <base-breadcrumb />
    <div class="border">
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
        :get-list="getRoleList"
        @hide-dialog="closeCreateDialog"
      />

      <role-form
        v-if="editVisible"
        :id="roleId"
        title="编辑角色"
        type="edit"
        :dialog-visible="editVisible"
        :get-list="getRoleList"
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
            class="close-btn"
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
      createVisible: false,
      editVisible: false,
      confirmDialog: false,
      roleId: 0,
      deleteId: 0,
      roleList: [],
      privilegeList: []
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      this.$store.commit('system/setRoleLoading', true);
      try {
        await this.$store.dispatch('system/getRoleList');
        this.roleList = this.$store.state.system.roleList;
      } catch (err) {
        this.$store.commit('system/setRoleLoading', false);
        return;
      }
    },
    async deleteRole() {
      try {
        await this.$store.dispatch('system/deleteRole', {
          id: this.deleteId
        });
        this.confirmDialog = false;
        this.getRoleList();
      } catch (err) {
        return;
      }
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
