<template>
  <el-dialog
    v-model="visible"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="roleForm"
      :model="roleForm"
      label-width="100px"
    >
      <el-form-item
        label="角色名称"
        prop="name"
        :rules="{
          required: true,
          message: '请输入角色名称'
        }"
      >
        <el-input
          v-model="roleForm.name"
          placeholder="请输入角色名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="权限"
        prop="privileges"
        :rules="[
          {
            required: true,
            message: '请选择权限'
          }
        ]"
      >
        <el-tree-select
          v-model="roleForm.privileges"
          :data="privilegeList"
          multiple
          show-checkbox
          clearable
          :props="defaultProps"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
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
  props: ['type', 'dialogVisible', 'id', 'getList'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleForm: {
        name: '',
        privileges: []
      },
      privilegeList:[]
    };
  },
  mounted() {
    this.getPrivilegeList();
    if (this.type === 'edit') {
      this.getRole();
    }
  },
  methods: {
    async getPrivilegeList() {
      this.$store.commit('system/setPrivilegeLoading', true);
      try {
        await this.$store.dispatch('system/getPrivilegeList');
        this.privilegeList = this.$store.state.system.privilegeList;
      } catch (err) {
        return;
      }
    },
    async createRole(body) {
      try {
        await this.$store.dispatch('system/createRole', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async updateRole(val) {
      let body = val;
      body['id'] = this.id;
      try {
        await this.$store.dispatch('system/updateRole', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async getRole() {
      try {
        await this.$store.dispatch('system/getRole', {
          params: {
            id: this.id
          }
        });
        this.roleForm = this.$store.state.system.role;
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitRoleForm() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.createRole(this.roleForm);
          } else {
            this.updateRole(this.roleForm);
          }
        }
      });
    }
  }
};
</script>
