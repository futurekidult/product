<template>
  <div
    v-loading="
      type === 'contract'
        ? $store.state.product.patent.contractLoading
        : $store.state.product.patent.reportLoading
    "
  >
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
            v-if="
              data.state === 10 && JSON.stringify(data.result_file) === '{}'
            "
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
            v-if="
              data.state === 10 && JSON.stringify(data.result_file) !== '{}'
            "
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
        <div :class="changeColor(data.state)">
          {{ data.state_desc }}
        </div>
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
  </div>
</template>

<script>
export default {
  inject: ['getContract'],
  props: ['data', 'type', 'getReport'],
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
    uploadAttachment() {
      if (this.type === 'contract') {
        this.upload('comtract', 'Contract');
        this.getContract();
      } else {
        this.upload('report', 'Report');
        this.getReport();
      }
    },
    changeColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    }
  }
};
</script>
