<template>
  <base-breadcrumb />
  <div class="border">
    <div class="nav-title">
      <span class="line">|</span> 搜索条件
    </div>

    <div class="select-item">
      <el-form
        label-width="60px"
        style="display: flex"
        :model="chooseForm"
      >
        <el-form-item label="姓名">
          <el-input
            v-model="chooseForm.name"
            placeholder="请输入姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-tree-select
            v-model="chooseForm.dept_ids"
            :data="$store.state.system.organizationList"
            clearable
            multiple
            :props="defaultProps"
            show-checkbox
            @focus="getOrganizationList"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="chooseForm.state"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in state"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          type="primary"
          @click="getAdminList"
        >
          查询
        </el-button>
        <el-button
          class="reset-btn"
          @click="resetForm"
        >
          重置
        </el-button>
      </div>
    </div>
  </div>

  <div class="border">
    <div class="nav-title">
      <span class="line">|</span> 用户列表
    </div>

    <div v-loading="$store.state.system.adminLoading">
      <el-table
        stripe
        border
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
            <el-button
              :type="scope.row.state === 1 ? 'danger' : 'primary'"
              @click="scope.row.state === 1 ? blockAdmin(scope.row.id) : unblockAdmin(scope.row.id)"
            >
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

      <div 
        class="pagination" 
      >
        <el-pagination
          v-model:currentPage="page"
          v-model:page-size="pageSize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="$store.state.system.adminListLength"
          :page-sizes="[10, 20, 30, 50]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
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
      adminList: [],
      roleList: [],
      chooseForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      page: 1,
      pageSize: 10,
      state: [
        {
          label: '启用状态',
          value: 1
        }, 
        {
          label: '禁用状态',
          value: 2
        }
      ]
    };
  },
  mounted() {
    this.getAdminList();
  },
  methods: {
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      try {
        await this.$store.dispatch('system/getOrganizationList');
      } catch (err) {
        return;
      }
    },
    async getAdminList() {
       let params = {
        current_page:  this.page,
        page_size: this.pageSize,
        name: this.chooseForm.name,
        dept_ids: this.chooseForm.dept_ids.join(','),
        state: this.chooseForm.state
      }
      try {
        this.$store.commit('system/setAdminLoading', true);
        await this.$store.dispatch('system/getAdminList', {params});
        this.adminList = this.$store.state.system.adminList;
      } catch (err) {
        this.$store.commit('system/setAdminLoading', false);
        return;
      }
    },
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
    async showRoleForm(id) {
      try {
        this.getRoleList();
        await this.$store.dispatch('system/getAdminRole', { params: { id } });
        this.roleForm = this.$store.state.system.adminRole;
        this.roleVisible = true;
      } catch (err) {
        return;
      }
    },
    async updateAdminRole(body) {
      try {
        await this.$store.dispatch('system/updateAdminRole', body);
        this.roleVisible = false;
        this.getAdminList();
      } catch (err) {
        return;
      }
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
    },
    async blockAdmin(id) {
      try {
        await this.$store.dispatch('system/blockAdmin', { id });
        this.getAdminList();
      } catch (err) {
        return;
      }
    },
    async unblockAdmin(id) {
      try {
        await this.$store.dispatch('system/unblockAdmin', { id });
        this.getAdminList();
      } catch (err) {
        return;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAdminList(this.page, this.pageSize, this.chooseForm.name, this.chooseForm.dept_ids, this.chooseForm.state);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAdminList(this.page, this.pageSize, this.chooseForm.name, this.chooseForm.dept_ids, this.chooseForm.state);
    },
    resetForm() {
      this.chooseForm = {};
      this.getAdminList(this.page, this.pageSize, this.chooseForm.name, this.chooseForm.dept_ids, this.chooseForm.state);
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
.pagination {
  display: flex;
  justify-content: right;
}
</style>
