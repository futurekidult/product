<template>
  <el-button
    link
    :disabled="disabled"
    type="primary"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['handle-click'],
  methods: {
    handleClick() {
      this.$emit('handle-click');
    }
  }
};
</script>
