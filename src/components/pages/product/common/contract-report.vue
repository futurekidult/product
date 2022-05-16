<template>
  <el-descriptions
    border
    :column="5"
    direction="vertical"
  >
    <el-descriptions-item label="任务负责人">
      {{ data.principal }}
    </el-descriptions-item>
    <el-descriptions-item label="实际完成时间">
      {{ data.actual_finish_time }}
    </el-descriptions-item>
    <el-descriptions-item label="结果附件">
      <div v-if="JSON.stringify(data) === '{}' ? false : true">
        <el-button
          v-if="data.state === 10 && JSON.stringify(data.result_file) === '{}'"
          type="text"
        >
          点击上传
        </el-button>
        <div v-if="data.state === 40">
          <el-button type="text">
            下载
          </el-button>
          <span class="table-btn">|</span>
          <el-button type="text">
            预览
          </el-button>
        </div>
        <div
          v-if="data.state === 10 && JSON.stringify(data.result_file) !== '{}'"
        >
          <el-button type="text">
            预览
          </el-button>
          <span class="table-btn">|</span>
          <el-button type="text">
            删除
          </el-button>
        </div>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="状态">
      {{ data.state_desc }}
    </el-descriptions-item>
    <el-descriptions-item label="操作">
      <el-button
        v-if="JSON.stringify(data) !== '{}'"
        :disabled="data.state !== 10"
        @click="uploadAttachment"
      >
        完成
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  props: ['data', 'type'],
  data() {
    return {
      id: 0
    };
  },
  methods: {
    async upload(val, url) {
      let type = val;
      let params = {
        product_id: +this.$route.params.productId,
        [type]: this.id
      };
      await this.$store.dispatch(`product/patent/upload${url}`, params);
    },
    async getPatentContract() {
      let params = {
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getContract', { params });
    },
    async getPatentReport() {
      let params = {
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getReport', { params });
    },
    uploadAttachment() {
      if (this.type === 'contract') {
        this.upload('comtract', 'Contract');
        this.getPatentContract();
      } else {
        this.upload('report', 'Report');
        this.getPatentReport();
      }
    }
  }
};
</script>
