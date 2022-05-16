<template>
  <div class="order-title">
    大货样确认进度表
  </div>

  <el-descriptions
    border
    :column="8"
    direction="vertical"
  >
    <el-descriptions-item label="任务负责人">
      {{ preProductSample.principal }}
    </el-descriptions-item>
    <el-descriptions-item label="计划到货时间">
      {{ preProductSample.estimated_arrival_time }}
    </el-descriptions-item>
    <el-descriptions-item label="大货样套数">
      {{ preProductSample.pre_production_sample_quantity }}
    </el-descriptions-item>
    <el-descriptions-item label="实际到货时间">
      {{ preProductSample.actual_arrival_time }}
    </el-descriptions-item>
    <el-descriptions-item label="实际完成时间">
      {{ preProductSample.actual_finish_time }}
    </el-descriptions-item>
    <el-descriptions-item label="快递单号">
      {{ preProductSample.courier_number }}
    </el-descriptions-item>
    <el-descriptions-item label="状态">
      {{ preProductSample.state_desc }}
    </el-descriptions-item>
    <el-descriptions-item label="操作">
      <div style="display: flex">
        <el-button
          v-if="preProductSample.state === 10"
          class="pre-product_btn"
          @click="showFollowupSheet(preProductSample.id)"
        >
          大货样跟进单
        </el-button>
        <el-button
          v-if="preProductSample.state === 20"
          type="primary"
          class="pre-product_btn"
          @click="showCourierNumber(preProductSample.id)"
        >
          大货样收货
        </el-button>
      </div>
      <el-button
        v-if="preProductSample.state === 30"
        type="primary"
        class="pre-product_btn"
        @click="confirmPreProductSample(preProductSample.id)"
      >
        大货样确认
      </el-button>
    </el-descriptions-item>
  </el-descriptions>

  <el-dialog
    v-model="followupSheetDialog"
    title="大货样跟进单"
    width="20%"
  >
    <el-form
      ref="followupForm"
      label-width="110px"
      :model="followupForm"
      :rules="followupRules"
    >
      <el-form-item
        label="计划到货时间"
        prop="estimated_arrival_time"
      >
        <el-date-picker
          v-model="followupForm.estimated_arrival_time"
          type="datetime"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item
        label="大货样套数"
        prop="pre_production_sample_quantity"
      >
        <el-input
          v-model="followupForm.pre_production_sample_quantity"
          placeholder="请输入大货样套数"
        />
      </el-form-item>
      <el-form-item>
        <div class="pre-product_desc">
          大货样套数最好3套以上
        </div>
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeFollowupSheet"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitFollowupForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="courierNumberDialog"
    title="快递单号"
    width="20%"
  >
    <el-form
      ref="courierNumberForm"
      label-width="110px"
      :model="courierNumberForm"
      :rules="courierNumberRules"
    >
      <el-form-item
        label="快递单号"
        prop="courier_number"
      >
        <el-input
          v-model="courierNumberForm.courier_number"
          placeholder="请输入快递单号"
        />
      </el-form-item>
      <el-form-item
        label="实际到货时间"
        prop="actual_finish_time"
      >
        <el-date-picker
          v-model="courierNumberForm.actual_finish_time"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeCourierNumber"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitCourierNumbeForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="confirmVisible"
    width="20%"
    title="提示"
  >
    <div class="result-content">
      是否确认大货样
    </div>
    <div class="pre-product">
      <el-button
        class="pre-product_btn"
        @click="closeConfirm"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        class="pre-product_btn"
        @click="submitConfirm"
      >
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      followupSheetDialog: false,
      courierNumberDialog: false,
      confirmVisible: false,
      followupForm: {},
      followupRules: {
        estimated_arrival_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        pre_production_sample_quantity: [
          {
            required: true,
            message: '请输入大货样套数'
          }
        ]
      },
      courierNumberForm: {},
      courierNumberRules: {
        actual_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        courier_number: [
          {
            required: true,
            message: '请输入快递单号'
          }
        ]
      },
      id: 0,
      preProductSample: {}
    };
  },
  computed: {},
  mounted() {
    this.getPreProductSample();
  },
  methods: {
    async getPreProductSample() {
      await this.$store.dispatch('product/order/getPreProduct', {
        params: {
          order_id: this.$route.params.orderId
        }
      });
      this.preProductSample = this.$store.state.product.order.preProductSample;
    },
    showFollowupSheet() {
      this.followupSheetDialog = true;
    },
    closeFollowupSheet() {
      this.followupSheetDialog = false;
    },
    async submitSheet() {
      this.followupForm['id'] = this.preProductSample.id;
      await this.$store.dispatch(
        'product/order/followupSheet',
        this.followupForm
      );
      this.followupSheetDialog = true;
    },
    async submitReceipt() {
      this.courierNumberForm['id'] = this.preProductSample.id;
      await this.$store.dispatch(
        'product/order/receiptSheet',
        this.courierNumberForm
      );
      this.courierNumberDialog = false;
    },
    submitFollowupForm() {
      this.$refs.followupForm.validate((valid) => {
        if (valid) {
          this.submitSheet();
          this.getPreProductSample();
        }
      });
    },
    showCourierNumber() {
      this.courierNumberDialog = true;
    },
    closeCourierNumber() {
      this.courierNumberDialog = false;
    },
    submitCourierNumbeForm() {
      this.$refs.courierNumberForm.validate((valid) => {
        if (valid) {
          this.submitReceipt();
          this.getPreProductSample();
        }
      });
    },
    confirmPreProductSample(id) {
      this.confirmVisible = true;
      this.id = id;
    },
    async submitConfirm() {
      await this.$store.dispatch('product/order/confirmPreProduct', {
        id: this.id
      });
      this.confirmVisible = false;
      this.getPreProductSample();
    },
    closeConfirm() {
      this.confirmVisible = false;
    }
  }
};
</script>

<style scoped>
.pre-product_desc {
  font-size: 10px;
}

.pre-product {
  text-align: center;
}
</style>
