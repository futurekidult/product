<template>
  <div>
    <div
      v-loading="$store.state.sample.baseLoading"
      class="border"
    >
      <el-descriptions
        :title="sampleBase.product_name"
        :column="4"
        style="width: 80%"
      >
        <el-descriptions-item>
          <template #label>
            关联产品:
          </template>
          <text-btn @handle-click="toProduct(sampleBase.product_id)">
            查看
          </text-btn>
        </el-descriptions-item>
        <el-descriptions-item label="采购负责人:">
          {{ sampleBase.purchase_principal }}
        </el-descriptions-item>
        <el-descriptions-item label="采购员:">
          {{ sampleBase.purchase_specialist }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            供应商:
          </template>
          <text-btn @handle-click="toSupplier(sampleBase.supplier_id)">
            查看
          </text-btn>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="border">
      <sample-process />
    </div>
  </div>
</template>

<script>
import SampleProcess from './process/sample-process.vue';

export default {
  components: {
    SampleProcess
  },
  props: ['id'],
  data() {
    return {
      sampleBase: {}
    };
  },
  mounted() {
    this.getSampleBase();
  },
  methods: {
    async getSampleBase() {
      this.$store.commit('sample/setBaseLoading', true);
      try {
        await this.$store.dispatch('sample/getSampleBase', {
          params: {
            id: +this.$route.params.id
          }
        });
        this.sampleBase = this.$store.state.sample.sampleBase;
      } catch (err) {
        this.$store.commit('sample/setBaseLoading', false);
        return;
      }
    },
    toSupplier(id) {
      if (this.$store.state.menuData.links.indexOf('/supplier-list') > -1) {
        this.$router.push(`/supplier-list/${id}`);
      } else {
        this.$message.error('无权限访问');
      }
    },
    toProduct(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    }
  }
};
</script>
