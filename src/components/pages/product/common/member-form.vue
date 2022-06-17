<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="20%"
    @close="cancel"
  >
    <el-form
      ref="memberForm"
      :model="memberForm"
    >
      <el-form-item
        label="成员名称"
        prop="user_id"
        :rules="[{ required: true, message: '请选择成员' }]"
      >
        <el-tree-select
          v-model="memberForm.user_id"
          :data="memberList"
          clearable
          :props="defaultProps"
        />
      </el-form-item>
      <el-form-item
        label="成员角色"
        prop="role_id"
        :rules="[{ required: true, message: '请选择成员角色' }]"
      >
        <el-select
          v-model="memberForm.role_id"
          placeholder="请输入成员角色"
          :disabled="type === 'edit'"
          clearable
        >
          <el-option
            v-for="item in role"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
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
          @click="submitMemberForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getMember'],
  props: ['title', 'dialogVisible', 'id', 'type', 'user'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      memberForm: {},
      role: [],
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  mounted() {
    this.getRole();
    this.getOrganizationList();
    if (this.type === 'edit') {
      this.memberForm = this.user;
    }
  },
  methods: {
    async getRole() {
      if (localStorage.getItem('params')) {
        this.role = JSON.parse(localStorage.getItem('params')).product.role;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getRole();
      }
    },
    async createProjectMember(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      await this.$store.dispatch('product/createProjectMember', body);
      this.visible = false;
      this.getMember();
    },
    async updateProjectMember(val) {
      let body = val;
      body.id = this.id;
      await this.$store.dispatch('product/updateProjectMember', body);
      this.visible = false;
      this.getMember();
    },
    async getOrganizationList() {
      await this.$store.dispatch('getOrganizationList');
      this.memberList = this.$store.state.organizationList;
      for (let key in this.memberList) {
        this.childrenFunc(this.memberList[key]);
      }
    },
    childrenFunc(data) {
      if (data.member_list) {
        for (const item of data.member_list) {
          data.children.push(item);
        }
      }
      return data.children;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitMemberForm() {
      this.$refs.memberForm.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.createProjectMember(this.memberForm);
          } else {
            this.updateProjectMember(this.memberForm);
          }
        }
      });
    }
  }
};
</script>
