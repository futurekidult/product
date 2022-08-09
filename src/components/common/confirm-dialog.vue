<template>
  <el-dialog
    v-model="visible"
    title="提示"
    width="20%"
    @close="closeConfirmDialog"
  >
    <div class="result-content">
      {{ dialogContent }}
    </div>
    <div style="text-align: center">
      <el-button
        class="close-btn"
        @click="closeConfirmDialog"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="submitConfirm"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getBase'],
  props: ['dialogContent', 'dialogVisible', 'type', 'id', 'getList'],
  emits: ['hide-dialog'],
  data() {
    return {
       visible: this.dialogVisible
    }
  },
  methods: {
    closeConfirmDialog() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async submitConfirm() {
      switch(this.type) {
        case 'product finish':
          try {
            await this.$store.dispatch('product/confirmProductResult', { 
              product_id: +this.$route.params.productId
            });
            this.visible = false;
            this.$emit('hide-dialog', this.visible);
            this.getBase();
          } catch (err) {
            return;
          }
          break;
        case 'draft delete': 
          try {
            this.$store.dispatch('demand/deleteDraftItem', {
              demand_id: this.id
            });
            this.visible = false;
            this.$emit('hide-dialog', this.visible);
            this.getList();
          } catch (err) {
            return;
          }
          break;
        default:
      }
    }
  }
}
</script>