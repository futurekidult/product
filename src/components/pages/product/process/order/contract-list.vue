<template>
  <div v-loading="$store.state.product.order.contractLoading">
    <div class="order-title">
      合同确认进度表
    </div>

    <el-descriptions
      border
      :column="4"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ exportContract.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="【香港→宁波】的合同确认">
        <div :class="changeColor(exportContract.state)">
          {{ exportContract.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ exportContract.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          type="primary"
          :disabled="exportContract.state !== 10"
          @click="confirmExportContract(exportContract.id)"
        >
          已完成
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      border
      :column="6"
      direction="vertical"
      style="margin-top: 20px"
    >
      <el-descriptions-item label="任务负责人">
        {{ purchaseContract.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="【宁波→工厂】的合同确认">
        <div :class="changeColor(purchaseContract.state)">
          {{ purchaseContract.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ purchaseContract.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="产品说明书">
        <el-button type="text">
          上传
        </el-button>
        <span class="table-btn">|</span>
        <el-button type="text">
          预览
        </el-button>
        <span class="table-btn">|</span>
        <el-button type="text">
          下载
        </el-button>
        <span class="table-btn">|</span>
        <el-button type="text">
          删除
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item label="刀模附件">
        <el-button type="text">
          上传
        </el-button>
        <span class="table-btn">|</span>
        <el-button type="text">
          预览
        </el-button>
        <span class="table-btn">|</span>
        <el-button type="text">
          下载
        </el-button>
        <span class="table-btn">|</span>
        <el-button type="text">
          删除
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          type="primary"
          :disabled="purchaseContract.state !== 10"
          @click="confirmPurchaseContract"
        >
          提交
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  inject: ['getContract', 'changeColor'],
  props: ['contract', 'exportContract', 'purchaseContract'],
  methods: {
    async confirmExportContract(id) {
      await this.$store.dispatch('product/order/confirmExportContract', {
        id
      });
      this.getContract();
    },
    async confirmPurchaseContract(id) {
      await this.$store.dispatch('product/order/confirmPurchaseContract', {
        id,
        product_manual_file: 12,
        diecuts_file: 10
      });
      this.getContract();
    }
  }
};
</script>
