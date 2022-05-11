<template>
  <div class="border">
    <el-descriptions
      :title="sampleBase.product_name"
      :column="4"
    >
      <el-descriptions-item>
        <template #label>
          关联产品
        </template>
        <el-button type="text">
          查看
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item label="采购负责人">
        {{ sampleBase.purchase_principal }}
      </el-descriptions-item>
      <el-descriptions-item label="采购员">
        {{ sampleBase.purchase_specialist }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          供应商
        </template>
        <el-button type="text">
          查看
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>

  <div class="border">
    <sample-process />
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
      await this.$store.dispatch('sample/getSampleBase', {
        params: {
          id: +this.$route.params.id
        }
      });
      this.sampleBase = this.$store.state.sample.sampleBase;
    }
  }
};
</script>
