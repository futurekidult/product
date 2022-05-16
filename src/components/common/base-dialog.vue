<template>
  <teleport to="body">
    <div
      class="backdrop"
      @click="tryClose"
    />
    <transition name="dialog">
      <dialog open>
        <slot />
      </dialog>
    </transition>
  </teleport>
</template>

<script>
export default {
  emits: ['close'],
  methods: {
    tryClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
dialog {
  position: fixed;
  top: 8vh;
  left: 10%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}
</style>
