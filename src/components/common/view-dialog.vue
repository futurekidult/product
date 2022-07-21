<template>
  <div
    v-if="show"
    class="backdrop"
    @click="close"
  />
  <img
    :src="link"
    alt="无法加载"
  >
</template>

<script>
export default {
  props: ['link', 'visible'],
  emits: ['hide-dialog'],
  data() {
    return {
      show: this.visible
    };
  },
  methods: {
    close() {
      this.show = false;
      this.$emit('hide-dialog', this.show);
    }
  }
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

img {
  position: fixed;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  display: block;
  max-width: 80%;
  max-height: 80%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
