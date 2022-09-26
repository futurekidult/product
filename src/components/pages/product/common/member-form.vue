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
          filterable
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
import { getOrganizationList } from '../../../../utils/index';

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
        label: 'name',
        disabled: 'disabled'
      }
    };
  },
  mounted() {
    this.getRole();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
    if (this.type === 'edit') {
      this.memberForm = this.user;
    }
  },
  methods: {
    async getRole() {
      if (localStorage.getItem('params')) {
        this.role = JSON.parse(localStorage.getItem('params')).product.role;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getRole();
        } catch (err) {
          return;
        }
      }
    },
    async createProjectMember(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/createProjectMember', body);
        this.visible = false;
        this.getMember();
      } catch (err) {
        return;
      }
    },
    async updateProjectMember(val) {
      let body = val;
      body.id = this.id;
      try {
        await this.$store.dispatch('product/updateProjectMember', body);
        this.visible = false;
        this.getMember();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitMemberForm() {
      this.$refs.memberForm.validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
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
