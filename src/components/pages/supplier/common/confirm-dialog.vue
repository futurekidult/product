<template>
  <el-dialog
    v-model="visible"
    title="提示"
    width="20%"
  >
    <div class="result-content">
      确定将该供应商{{ type === 'black' ? '加入黑名单' : '移除黑名单' }}
    </div>
    <div style="text-align: center">
      <el-button
        class="close-btn"
        @click="cancel"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="setSupplier"
      >
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'type', 'id', 'getList'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible
    };
  },
  methods: {
    async setBlackSupplier() {
      try {
        await this.$store.dispatch('supplier/setBlackSupplier', {
          id: this.id
        });
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async setWhiteSupplier() {
      try {
        await this.$store.dispatch('supplier/setWhiteSupplier', {
          params: {
            id: this.id
          }
        });
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async setSupplier() {
      if (this.type === 'black') {
        this.setBlackSupplier();
      } else {
        this.setWhiteSupplier();
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    }
  }
};
</script>
