<template>
  <el-tag
    :type="mode"
    :class="type"
  >
    <slot />
  </el-tag>
</template>

<script>
export default {
  props: ['mode', 'type']
};
</script>

<style scoped>
.tag {
  position: absolute;
  left: 275px;
  border-radius: 10px;
}
</style>
