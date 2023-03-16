<template>
  <el-dialog
    v-model="visible"
    title="查看内容"
    width="30%"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <base-table
      :table-column="purchaseFormTableColumn"
      :table-data="priceList"
      :pagination-visible="false"
      :operation-visible="false"
    />
  </el-dialog>
</template>

<script>
export default {
  props: [
    'dialogVisible',
    'type',
    'market',
    'productId',
    'quotationId',
    'name'
  ],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      priceList: [],
      purchaseFormTableColumn: [
        {
          prop: 'platform_desc',
          label: '平台名称',
          min_width: 150
        },
        {
          label: `对应采购${this.name}价`,
          prop: `${this.type}_price`,
          min_width: 150
        }
      ]
    };
  },
  mounted() {
    if (this.type === 'reference') {
      this.getReferencePrice();
    } else {
      this.getTargetPrice();
    }
  },
  methods: {
    async getReferencePrice() {
      let params = {
        product_id: this.productId,
        market: this.market
      };
      try {
        await this.$store.dispatch('price/getReferencePrice', { params });
        this.priceList = this.$store.state.price.referencePrice;
        this.priceList.forEach((item) => {
          item.reference_price = `￥${item.reference_price}`;
        });
      } catch (err) {
        return;
      }
    },
    async getTargetPrice() {
      try {
        await this.$store.dispatch('price/getTargetPrice', {
          params: {
            quote_id: this.quotationId
          }
        });
        this.priceList = this.$store.state.price.targetPrice;
        this.priceList.forEach((item) => {
          item.target_price = `￥${item.target_price}`;
        });
        this.loading = this.$store.state.price.targetLoading;
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    }
  }
};
</script>
