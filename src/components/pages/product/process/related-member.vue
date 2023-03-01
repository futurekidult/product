<template>
  <div v-loading="$store.state.product.memberLoading">
    <div class="member-item">
      <div class="select-title">
        <span class="line">|</span> 项目成员
      </div>
      <el-button
        type="primary"
        @click="showAddForm"
      >
        新增成员
      </el-button>
    </div>
    <base-table
      :table-data="projectMember"
      :pagination="pagination"
      :length="$store.state.product.memberListLength"
      :table-column="tableColumn"
      @change-pagination="changePagination"
    >
      <template #default="slotProps">
        <text-btn
          @handle-click="
            showEditForm(
              slotProps.row.id,
              slotProps.row.user_id,
              slotProps.row.role_id
            )
          "
        >
          修改
        </text-btn>
        <span class="table-btn">|</span>
        <text-btn @handle-click="showDeleteDialog(slotProps.row.id)">
          删除
        </text-btn>
      </template>
    </base-table>

    <member-form
      v-if="addDialog"
      :dialog-visible="addDialog"
      title="新增成员"
      type="create"
      :close-on-click-modal="false"
      @hide-dialog="closeAddForm"
    />

    <member-form
      v-if="editDialog"
      :id="editId"
      :dialog-visible="editDialog"
      title="修改"
      type="edit"
      :user="userMsg"
      :close-on-click-modal="false"
      @hide-dialog="closeEditForm"
    />

    <el-dialog
      v-model="deleteDialog"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        确认要删除该成员吗
      </div>
      <div style="text-align: center">
        <el-button
          class="member-btn"
          @click="closeDeleteDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="member-btn"
          @click="submitDeleteResult"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MemberForm from '../common/member-form.vue';

export default {
  components: {
    MemberForm
  },
  inject: ['getMember'],
  props: ['projectMember', 'memberPagination'],
  emits: ['change-page'],
  data() {
    return {
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      userMsg: {},
      editId: 0,
      deleteId: 0,
      pagination: this.memberPagination,
      tableColumn: [
        { prop: 'id', label: '成员ID', width: 100, fixed: 'left' },
        {
          prop: 'name',
          label: '成员名称'
        },
        { prop: 'role', label: '成员角色' },
        { prop: 'create_time', label: '创建时间', width: 200 }
      ]
    };
  },
  watch: {
    memberPagination(val) {
      this.pagination = val;
    }
  },
  methods: {
    async deleteProjectMember() {
      let body = {
        id: this.deleteId
      };
      try {
        await this.$store.dispatch('product/deleteProjectMember', body);
        this.deleteDialog = false;
        this.getMember();
      } catch (err) {
        return;
      }
    },
    showAddForm() {
      this.addDialog = true;
    },
    closeAddForm() {
      this.addDialog = false;
    },
    showEditForm(id, userId, roleId) {
      this.editDialog = true;
      this.editId = id;
      this.userMsg = {
        user_id: userId,
        role_id: roleId
      };
    },
    closeEditForm() {
      this.editDialog = false;
    },
    showDeleteDialog(id) {
      this.deleteDialog = true;
      this.deleteId = id;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
    submitDeleteResult() {
      this.deleteProjectMember();
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.$emit('change-page', this.pagination);
    }
  }
};
</script>
