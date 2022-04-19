<template>
  <el-form :model="form">
    <el-form-item label="成员名称">
      <el-input
        v-model="form.member"
        placeholder="请输入成员名称"
      />
    </el-form-item>
    <el-form-item label="成员角色">
      <el-select
        v-model="form.role"
        placeholder="请输入成员角色"
      />
    </el-form-item>
    <el-button class="close-btn">
      取消
    </el-button>
    <el-button type="primary">
      提交
    </el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        member: '',
        role: ''
      }
    };
  }
};
</script>
