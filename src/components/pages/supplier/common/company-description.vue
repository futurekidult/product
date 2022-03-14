<template>
  <el-descriptions
    title="xxxx有限公司"
    :column="3"
  >
    <el-descriptions-item label="营业执照注册号">
      7263407029347617
    </el-descriptions-item>
    <el-descriptions-item label="创建人">
      张三
    </el-descriptions-item>
    <el-descriptions-item label="创建时间">
      2022-01-06 14:00:00
    </el-descriptions-item>
  </el-descriptions>
  <section>
    <el-button>不通过</el-button>
    <el-button type="success">
      通过
    </el-button>
  </section>
</template>

<script>
export default {
  props: ['status']
};
</script>
