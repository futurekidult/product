<template>
  <el-dialog
    v-model="visible"
    title="提示"
    width="25%"
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
  props: [
    'dialogContent',
    'dialogVisible',
    'type',
    'id',
    'getList',
    'surveyType',
    'ids'
  ],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible
    };
  },
  methods: {
    closeConfirmDialog() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async submitConfirm() {
      try {
        switch (this.type) {
          case 'product finish':
            await this.$store.dispatch('product/confirmProductResult', {
              product_id: +this.$route.params.productId
            });
            break;
          case 'draft delete':
            await this.$store.dispatch('demand/deleteDraftItem', {
              demand_id: this.id
            });
            break;
          case 'black enter':
            await this.$store.dispatch('supplier/setBlackSupplier', {
              id: this.id
            });
            break;
          case 'black delete':
            await this.$store.dispatch('supplier/setWhiteSupplier', {
              id: this.id
            });
            break;
          case 'suggestion delete':
            await this.$store.dispatch(
              'product/survey/deleteSurveySuggestion',
              {
                id: this.id,
                survey_schedule_id: this.ids.survey_schedule_id,
                type: this.surveyType
              }
            );
            break;
          default:
        }
        this.visible = false;
        this.$emit('hide-dialog', this.visible);
        this.getList();
      } catch (err) {
        return;
      }
    }
  }
};
</script>
