<template>
  <div v-loading="$store.state.product.order.preProductLoading">
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
        <div :class="changeColor(preProductSample.state)">
          {{ preProductSample.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="
          preProductSample.state !== 40 && preProductSample.state !== undefined
        "
        label="操作"
      >
        <div style="display: flex">
          <text-btn
            v-if="preProductSample.state === 10"
            class="pre-product_btn"
            @handle-click="showFollowupSheet(preProductSample.id)"
          >
            大货样跟进单
          </text-btn>
          <text-btn
            v-if="preProductSample.state === 20"
            class="pre-product_btn"
            @handle-click="showCourierNumber(preProductSample.id)"
          >
            大货样收货
          </text-btn>
        </div>
        <text-btn
          v-if="preProductSample.state === 30"
          class="pre-product_btn"
          @handle-click="confirmPreProductSample(preProductSample.id)"
        >
          大货样确认
        </text-btn>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog
      v-model="followupSheetDialog"
      title="大货样跟进单"
      width="30%"
      :close-on-click-modal="false"
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
            clearable
            :default-time="$global.defaultTime"
            :disabled-date="setDisabledDate"
          />
        </el-form-item>
        <el-form-item
          label="大货样套数"
          prop="pre_production_sample_quantity"
        >
          <el-input
            v-model.number="followupForm.pre_production_sample_quantity"
            placeholder="请输入大货样套数"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <div class="desc">
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
      width="30%"
      :close-on-click-modal="false"
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
            clearable
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="实际到货时间"
          prop="actual_arrival_time"
        >
          <el-date-picker
            v-model="courierNumberForm.actual_arrival_time"
            type="datetime"
            placeholder="选择日期时间"
            clearable
            :default-time="$global.defaultTime"
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
            @click="submitCourierNumberForm"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      v-model="confirmVisible"
      width="25%"
      title="提示"
      :close-on-click-modal="false"
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
  </div>
</template>

<script>
import { timestamp, setDisabledDate } from '../../../../../utils';
export default {
  inject: ['changeColor', 'getPreProductSample'],
  props: ['preProductSample'],
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
          },
          {
            type: 'number',
            message: '请输入数字'
          }
        ]
      },
      courierNumberForm: {},
      courierNumberRules: {
        actual_arrival_time: [
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
      id: 0
    };
  },
  methods: {
    setDisabledDate,
    showFollowupSheet() {
      this.followupSheetDialog = true;
    },
    closeFollowupSheet() {
      this.followupSheetDialog = false;
    },
    async submitSheet() {
      let form = JSON.parse(JSON.stringify(this.followupForm));
      form.estimated_arrival_time = timestamp(form.estimated_arrival_time);
      let body = {
        ...form,
        id: this.preProductSample.id
      };
      try {
        await this.$store.dispatch('product/order/followupSheet', body);
        this.followupSheetDialog = false;
        this.getPreProductSample();
      } catch (err) {
        return;
      }
    },
    async submitReceipt() {
      let val = {
        courier_number: this.courierNumberForm.courier_number,
        actual_arrival_time: timestamp(
          this.courierNumberForm.actual_arrival_time
        ),
        id: this.preProductSample.id
      };
      try {
        await this.$store.dispatch('product/order/receiptSheet', val);
        this.courierNumberDialog = false;
        this.getPreProductSample();
      } catch (err) {
        return;
      }
    },
    submitFollowupForm() {
      this.$refs.followupForm.validate((valid) => {
        if (valid) {
          this.submitSheet();
        }
      });
    },
    showCourierNumber() {
      this.courierNumberDialog = true;
    },
    closeCourierNumber() {
      this.courierNumberDialog = false;
    },
    submitCourierNumberForm() {
      this.$refs.courierNumberForm.validate((valid) => {
        if (valid) {
          this.submitReceipt();
        }
      });
    },
    confirmPreProductSample(id) {
      this.confirmVisible = true;
      this.id = id;
    },
    async submitConfirm() {
      try {
        await this.$store.dispatch('product/order/confirmPreProduct', {
          id: this.id
        });
        this.confirmVisible = false;
        this.getPreProductSample();
      } catch (err) {
        return;
      }
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
.hide {
  display: none;
}
</style>
