<template>
  <div class="order-title">
    大货样确认进度表
  </div>

  <el-descriptions
    border
    :column="8"
    direction="vertical"
  >
    <el-descriptions-item label="任务负责人" />
    <el-descriptions-item label="计划到货时间" />
    <el-descriptions-item label="大货样套数" />
    <el-descriptions-item label="实际到货时间" />
    <el-descriptions-item label="实际完成时间" />
    <el-descriptions-item label="快递单号" />
    <el-descriptions-item label="状态" />
    <el-descriptions-item label="操作">
      <div style="display: flex">
        <el-button
          class="pre-product_btn"
          @click="showFolloeupSheet"
        >
          大货样跟进单
        </el-button>
        <el-button
          type="primary"
          class="pre-product_btn"
          @click="showCourierNumber"
        >
          大货样收货
        </el-button>
      </div>
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
        prop="estimatedArrivalTime"
      >
        <el-date-picker
          v-model="followupForm.estimatedArrivalTime"
          type="datetime"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item
        label="大货样套数"
        prop="productionSampleQuantity"
      >
        <el-input
          v-model="followupForm.productionSampleQuantity"
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
        prop="courierNumber"
      >
        <el-input
          v-model="courierNumberForm.courierNumber"
          placeholder="请输入快递单号"
        />
      </el-form-item>
      <el-form-item
        label="实际到货时间"
        prop="actualArrivalTime"
      >
        <el-date-picker
          v-model="courierNumberForm.actualArrivalTime"
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
</template>

<script>
export default {
  data() {
    return {
      followupSheetDialog: false,
      courierNumberDialog: false,
      followupForm: {},
      followupRules: {
        estimatedArrivalTime: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        productionSampleQuantity: [
          {
            required: true,
            message: '请输入大货样套数'
          }
        ]
      },
      courierNumberForm: {},
      courierNumberRules: {
        actualArrivalTime: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        courierNumber: [
          {
            required: true,
            message: '请输入快递单号'
          }
        ]
      }
    };
  },
  methods: {
    showFolloeupSheet() {
      this.followupSheetDialog = true;
    },
    closeFollowupSheet() {
      this.followupSheetDialog = false;
    },
    submitFollowupForm() {
      this.$refs.followupForm.validate((valid) => {
        if (!valid) {
          console.log('error');
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
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>

<style scoped>
.pre-product_desc {
  font-size: 10px;
}
</style>
