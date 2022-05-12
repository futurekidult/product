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
        <el-select
          v-model="memberForm.user_id"
          placeholder="请输入成员名称"
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
          :disabled="type === 'edit' ? true : false"
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
  props: ['title', 'dialogVisible', 'getList', 'id', 'type', 'user'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      memberForm: {
        user_id: '',
        role_id: ''
      }
    };
  },
  mounted() {
    if (this.type === 'edit') {
      this.memberForm = this.user;
    }
  },
  methods: {
    async createProjectMember(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      await this.$store.dispatch('product/createProjectMember', body);
      this.visible = false;
      this.getList();
    },
    async updateProjectMember(val) {
      let body = val;
      body['id'] = this.id;
      await this.$store.dispatch('product/updateProjectMember', body);
      this.visible = false;
      this.getList();
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
