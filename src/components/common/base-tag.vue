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
  border-radius: 10px;
}
</style>
