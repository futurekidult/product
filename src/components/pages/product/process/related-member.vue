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
    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="projectMember"
    >
      <el-table-column
        label="序号"
        type="index"
        width="80px"
      />
      <el-table-column
        label="成员名称"
        prop="name"
      />
      <el-table-column
        label="成员角色"
        prop="role"
      />
      <el-table-column
        label="创建时间"
        prop="create_time"
      />
      <el-table-column
        label="操作"
        width="150px"
      >
        <template #default="scope">
          <el-button
            type="text"
            @click="
              showEditForm(scope.row.id, scope.row.user_id, scope.row.role_id)
            "
          >
            修改
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            type="text"
            @click="showDeleteDialog(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      :length="projectMember.length"
      :get-list="getMember"
    />
  </div>

  <member-form
    v-if="addDialog"
    :dialog-visible="addDialog"
    title="新增成员"
    type="create"
    @hide-dialog="closeAddForm"
  />

  <member-form
    v-if="editDialog"
    :id="editId"
    :dialog-visible="editDialog"
    title="修改"
    type="edit"
    :user="userMsg"
    @hide-dialog="closeEditForm"
  />

  <el-dialog
    v-model="deleteDialog"
    title="提示"
    width="20%"
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
        @click="submitDeteleResult"
      >
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import MemberForm from '../common/member-form.vue';
import BasePagination from '../../../common/base-pagination.vue';

export default {
  components: {
    MemberForm,
    BasePagination
  },
  inject: ['getMember'],
  props: ['projectMember'],
  data() {
    return {
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      userMsg: {},
      editId: 0,
      deleteId: 0
    };
  },
  mounted() {
    // this.getProjectMember();
  },
  methods: {
    async deleteProjectMember() {
      let body = {
        id: this.deleteId
      };
      await this.$store.dispatch('product/deleteProjectMember', body);
      this.deleteDialog = false;
      this.getMember();
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
    submitDeteleResult() {
      this.deleteProjectMember();
    }
  }
};
</script>
