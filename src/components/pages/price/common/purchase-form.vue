<template>
  <el-dialog
    v-model="visible"
    title="查看内容"
    width="30%"
    @close="cancel"
  >
    <el-table
      v-loading="loading"
      :data="priceList"
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        label="平台名称"
        prop="platform_desc"
      />
      <el-table-column
        :label="`对应采购${name}价`"
        :prop="`${type}_price`"
      />
    </el-table>
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
      loading: true
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
      await this.$store.dispatch('price/getReferencePrice', { params });
      this.priceList = this.$store.state.price.referencePrice;
      this.priceList.forEach((item) => {
        item.reference_price = `￥${item.reference_price}`;
      });
      this.loading = this.$store.state.price.referenceLoading;
    },
    async getTargetPrice() {
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
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    }
  }
};
</script>
