<template>
  <el-dialog
    v-model="visible"
    title="新增测试用户"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="userForm"
      :model="userForm"
      label-width="100px"
    >
      <el-form-item label="用户姓名">
        <el-input
          v-model="userForm.username"
          placeholder="请输入用户姓名"
        />
      </el-form-item>
      <el-form-item label="用户地址">
        <el-input
          v-model="userForm.address"
          placeholder="请输入用户地址"
        />
      </el-form-item>
      <el-form-item label="邮编">
        <el-input
          v-model="userForm.postcode"
          placeholder="请输入邮编"
        />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input
          v-model="userForm.tel"
          placeholder="请输入联系方式"
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="userForm.email"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item />
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['id', 'dialogVisible'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      userForm: {}
    };
  },
  mounted() {
    this.getSimpleUserDetail();
  },
  methods: {
    async getSimpleUserDetail() {
      await this.$store.dispatch('sample/user/getSimpleUserDetail', {
        params: {
          id: this.id
        }
      });
      this.userForm = this.$store.state.sample.user.simpleUserDetail;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    }
  }
};
</script>
