<template>
  <div class="handbook">
    <a
      class="handbook-link"
      target="_blank"
      href="https://alidocs.dingtalk.com/i/nodes/EGd6jK4Nvk3Jl9mOG0pl8ZOP0LawMmQq"
    >
      <el-icon
        class="handbook-icon"
        :size="20"
      > <Reading /> </el-icon>操作手册</a>
  </div>
</template>

<script>
import { Reading } from '@element-plus/icons-vue';
export default {
  components: {
    Reading
  }
};
</script>

<style scoped>
.handbook {
  display: flex;
  margin-right: 40px;
  justify-content: center;
}

.handbook-icon {
  height: 24px !important;
  vertical-align: middle;
  margin-right: 5px;
  align-items: unset !important;
}

.handbook-link {
  color: #fff;
  text-decoration: none;
}

.handbook-link:hover,
.handbook-link:focus {
  color: #f8ba2b;
}
</style>
