<template>
  <div>
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
      <base-table
        v-loading="$store.state.system.systemRoleLoading"
        :operation-width="340"
        :table-data="roleList"
        :pagination-visible="false"
        :table-column="[{ label: '角色名称', prop: 'name' }]"
      >
        <template #default="slotProps">
          <el-button
            type="danger"
            class="close-btn"
            @click="showDeleteRole(slotProps.row.id)"
          >
            删除
          </el-button>
          <el-button @click="showViewDialog(slotProps.row.id, true)">
            查看成员
          </el-button>
          <el-button
            type="primary"
            @click="showEditDialog(slotProps.row.id)"
          >
            编辑角色
          </el-button>
        </template>
      </base-table>
      <!-- 新增角色弹窗 -->
      <role-form
        v-if="createVisible"
        title="新增角色"
        type="create"
        :dialog-visible="createVisible"
        :get-list="getRoleList"
        :close-on-click-modal="false"
        @hide-dialog="closeCreateDialog"
      />
      <!-- 编辑角色弹窗 -->
      <role-form
        v-if="editVisible"
        :id="roleId"
        title="编辑角色"
        type="system edit"
        :dialog-visible="editVisible"
        :get-list="getRoleList"
        :close-on-click-modal="false"
        @hide-dialog="closeEditDialog"
      />
      <!-- 删除角色弹窗 -->
      <el-dialog
        v-model="confirmDialog"
        title="提示"
        width="20%"
        :close-on-click-modal="false"
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
    <!-- 查看成员弹窗 -->
    <el-dialog
      v-model="viewMemberDialogVisible"
      title="查看成员"
      width="45%"
      :close-on-click-modal="false"
      @close="closeViewDialog"
    >
      <base-table
        :operation-visible="false"
        :table-data="memberList"
        :pagination="pagination"
        :length="$store.state.system.roleRelatedMemberListLength"
        :table-column="tableColumn"
        @change-pagination="changePagination"
      >
        <template #default="slotProps">
          <text-btn @handle-click="getDetail(slotProps.row.id)">
            编辑
          </text-btn>
        </template>
      </base-table>
    </el-dialog>
  </div>
</template>

<script>
import RoleForm from './common/role-form.vue';
import { setStateColor, resetPagination } from '../../../utils/index.js';

export default {
  components: {
    RoleForm
  },
  data() {
    return {
      createVisible: false,
      editVisible: false,
      confirmDialog: false,
      viewMemberDialogVisible: false,
      roleId: 0,
      deleteId: 0,
      roleList: [],
      memberList: [],
      pagination: this.$global.pagination,
      tableColumn: [
        {
          label: '姓名',
          prop: 'name',
          width: 100
        },
        {
          label: '所属部门',
          prop: 'department'
        },
        {
          label: '状态',
          prop: 'state',
          fixed: 'right',
          width: 100,
          formatter: (row) => {
            return setStateColor(row.state);
          },
          getSpecialProp: (row) => {
            return row.state_desc;
          }
        }
      ]
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      this.$store.commit('system/setSystemRoleLoading', true);
      try {
        await this.$store.dispatch('system/getSystemRoleList');
        this.roleList = this.$store.state.system.systemRoleList;
      } catch (err) {
        this.$store.commit('system/setSystemRoleLoading', false);
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
    showDeleteRole(id) {
      this.confirmDialog = true;
      this.deleteId = id;
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
    },
    async getRoleRelatedMemberList(id, showDialog) {
      try {
        let params = {
          role_id: id,
          current_page: this.pagination.current_page,
          page_size: this.pagination.page_size
        };
        await this.$store.dispatch('system/getRoleRelatedMemberList', {
          params
        });
        this.memberList = this.$store.state.system.roleRelatedMemberList;
        if (showDialog) {
          this.viewMemberDialogVisible = true;
        }
      } catch (err) {
        return;
      }
    },
    showViewDialog(id, showDialog) {
      this.roleId = id;
      resetPagination(this.pagination, 1, 10);
      this.getRoleRelatedMemberList(id, showDialog);
    },
    closeViewDialog() {
      this.viewMemberDialogVisible = false;
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getRoleRelatedMemberList(this.roleId, false);
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
