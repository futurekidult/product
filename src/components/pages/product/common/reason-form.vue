<template>
  <el-dialog v-model="visible">
    <el-form>
      <el-form-item>
        <el-input type="textarea" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'title', 'type', 'id'],
  data() {
    return {
      visible: this.dialogVisible
    };
  }
};
</script>
