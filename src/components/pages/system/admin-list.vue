<template>
  <section>
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
              @keyup.enter.native="searchAdmin"
              @clear="searchAdmin"
            />
          </el-form-item>
          <el-form-item label="部门">
            <el-tree-select
              ref="tree"
              v-model="chooseForm.dept_ids"
              :data="$store.state.system.organizationList"
              clearable
              multiple
              collapse-tags
              show-checkbox
              :props="defaultProps"
              @clear="clearDeptIds"
              @change="getCheckedNodes"
              @remove-tag="removeTag"
              @check-change="getCheckedNodes"
              @visible-change="handleVisibleChange"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              placeholder="请选择状态"
              clearable
              @change="searchAdmin"
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
        <el-button
          class="reset-btn"
          @click="resetForm"
        >
          重置
        </el-button>
      </div>
    </div>

    <div class="border">
      <div class="nav-title">
        <span class="line">|</span> 用户列表
      </div>
      <base-table
        v-loading="$store.state.system.adminLoading"
        :table-data="adminList"
        :operation-width="230"
        :pagination="pagination"
        :length="$store.state.system.adminListLength"
        :table-column="tableColumn"
        @change-pagination="changePagination"
      >
        <template #default="slotProps">
          <el-button
            :disabled="slotProps.row.state === 3"
            :type="slotProps.row.state === 1 ? 'danger' : 'primary'"
            @click="
              slotProps.row.state === 1
                ? blockAdmin(slotProps.row.id)
                : unblockAdmin(slotProps.row.id)
            "
          >
            {{ slotProps.row.state === 1 ? '封禁账号' : '解除封禁' }}
          </el-button>
          <el-button
            type="warning"
            :disabled="slotProps.row.state !== 1"
            @click="showRoleForm(slotProps.row.id)"
          >
            配置角色
          </el-button>
        </template>
      </base-table>
    </div>
    <el-dialog
      v-model="roleVisible"
      title="配置用户角色"
      width="30%"
      :close-on-click-modal="false"
      @close="closeRoleForm"
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
  </section>
</template>

<script>
import { setStateColor, resetFormFields } from '../../../utils/index.js';

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
        label: 'name',
        disabled: 'disabled'
      },
      state: [
        {
          label: '启用状态',
          value: 1
        },
        {
          label: '禁用状态',
          value: 2
        },
        {
          label: '离职状态',
          value: 3
        }
      ],
      pagination: JSON.parse(JSON.stringify(this.$global.pagination)),
      tableColumn: [
        { prop: 'name', label: '姓名', width: 200 },
        { prop: 'department', label: '所属部门' },
        {
          prop: 'state',
          label: '状态',
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
    this.getAdminList();
    this.getOrganizationList();
  },
  methods: {
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      try {
        await this.$store.dispatch('system/getOrganizationList');
      } catch (err) {
        this.$store.commit('system/setOrganizationLoading', false);
        return;
      }
    },
    async getAdminList() {
      let params = {
        ...this.pagination,
        name: this.chooseForm.name,
        dept_ids: !this.chooseForm.dept_ids
          ? []
          : this.chooseForm.dept_ids.join(','),
        state: this.chooseForm.state
      };
      try {
        this.$store.commit('system/setAdminLoading', true);
        await this.$store.dispatch('system/getAdminList', { params });
        this.adminList = this.$store.state.system.adminList;
      } catch (err) {
        this.$store.commit('system/setAdminLoading', false);
        return;
      }
    },
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
      resetFormFields(this.$refs.roleForm);
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
        this.$store.dispatch('getOrganizationList');
      } catch (err) {
        return;
      }
    },
    async unblockAdmin(id) {
      try {
        await this.$store.dispatch('system/unblockAdmin', { id });
        this.getAdminList();
        this.$store.dispatch('getOrganizationList');
      } catch (err) {
        return;
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.pagination.page_size = 10;
      this.searchAdmin();
    },
    searchAdmin() {
      this.pagination.current_page = 1;
      this.getAdminList();
    },
    getCheckedNodes(nodeData) {
      this.chooseForm.dept_ids = [];
      let checkedArr = this.$refs.tree.getCheckedNodes();
      for (let i in checkedArr) {
        this.chooseForm.dept_ids.push(checkedArr[i].value);
      }
      if (nodeData.id) {
        let node = this.$refs.tree.getNode(nodeData.id);
        this.expandCheckedNotExpandNodes(node);
      }
    },
    expandCheckedNotExpandNodes(node) {
      let { tree } = this.$refs;
      if (node.checked && !node.expanded && !node.isLeaf) {
        node.expand(() => {
          let { childNodes } = node;
          for (let i = 0; i < childNodes.length; i++) {
            let childNode = childNodes[i];
            tree.$emit(
              'check-change',
              childNode.data,
              childNode.checked,
              childNode.indeterminate
            );
          }
        });
      }
    },
    clearDeptIds() {
      this.$refs.tree.setCheckedKeys([]);
      this.chooseForm.dept_ids = [];
      this.getAdminList();
    },
    removeTag(val) {
      this.$refs.tree.setChecked(val, false, true);
    },
    handleVisibleChange(val) {
      if (!val) {
        this.searchAdmin();
      }
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getAdminList();
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
