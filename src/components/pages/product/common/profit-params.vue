<template>
  <table cellspacing="0">
    <tr>
      <td>参数列表</td>
      <td>参数值</td>
    </tr>
    <tr>
      <td>利润率</td>
      <td>{{ profitParams.profit_rate }}</td>
    </tr>
    <tr>
      <td>广告费率</td>
      <td>{{ profitParams.advertising_rate }}</td>
    </tr>
    <tr>
      <td>佣金费率</td>
      <td>{{ profitParams.commission_rate }}</td>
    </tr>
    <tr>
      <td>退货费率</td>
      <td>{{ profitParams.return_fee_rate }}</td>
    </tr>
    <tr>
      <td>仓储费率</td>
      <td>{{ profitParams.storage_rate }}</td>
    </tr>
    <tr>
      <td>促销费率</td>
      <td>{{ profitParams.promotion_rate }}</td>
    </tr>
    <tr>
      <td>关税率</td>
      <td>{{ profitParams.tariff_rate }}</td>
    </tr>
    <tr>
      <td>其他费率</td>
      <td>{{ profitParams.other_rate }}</td>
    </tr>
    <tr>
      <td>清关售价比</td>
      <td>{{ profitParams.customs_clearance_price_ratio }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['market', 'platform'],
  data() {
    return {
      profitParams: {}
    };
  },
  mounted() {
    this.getProfitParams();
  },
  methods: {
    async getProfitParams() {
      let params = {
        market: this.market,
        platform: this.platform,
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/project/getProfitParams', { params });
      this.profitParams = this.$store.state.product.project.profitParams;
    }
  }
};
</script>

<style scoped>
table {
  margin-top: 20px;
  width: 100%;
}
td {
  border: 1px solid #f0f2f5;
  padding: 5px;
  text-align: center;
  color: #606266;
}
</style>
