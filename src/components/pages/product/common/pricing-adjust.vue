<template>
  <el-dialog
    v-model="visible"
    title="调价"
    width="30%"
    @close="cancel"
  >
    <div class="adjust-time">
      <el-icon :size="19">
        <clock />
      </el-icon>
      <div>申请提交时间: {{ adjustMsg.submit_time }}</div>
    </div>

    <div class="adjust-result">
      <el-descriptions
        border
        :column="4"
        direction="vertical"
      >
        <el-descriptions-item label="平台名称">
          {{ adjustMsg.platform }}
        </el-descriptions-item>
        <el-descriptions-item label="申请前销售价">
          ￥{{ adjustMsg.origin_selling_price }}
        </el-descriptions-item>
        <el-descriptions-item label="申请调整后销售价">
          ￥{{ adjustMsg.applied_selling_price }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="adjustMsg.state === 30"
          label="实际调整后销售价"
        >
          ￥{{ adjustMsg.adjusted_selling_price_rmb }}
        </el-descriptions-item>
      </el-descriptions>

      <section>申请调价原因: {{ adjustMsg.reason }}</section>
      <section>申请人: {{ adjustMsg.applicant }}</section>
      <section v-if="adjustMsg.state !== 10">
        调价申请审批:
        <span :class="colorApprove(adjustMsg.apply_approve_result)">
          {{ adjustMsg.apply_approve_result }}</span>
      </section>
      <section v-if="adjustMsg.state !== 10">
        审批完成时间: {{ adjustMsg.apply_approve_time }}
      </section>
      <section v-if="adjustMsg.state === 30">
        调价人: {{ adjustMsg.operator }}
      </section>
      <section v-if="adjustMsg.state === 30">
        调价状态:
        <span :class="colorStage(adjustMsg.adjust_state)">{{
          adjustMsg.adjust_state_desc
        }}</span>
      </section>
      <el-divider />
    </div>

    <el-form
      v-if="adjustMsg.state !== 10"
      ref="adjustForm"
      :model="adjustForm"
      :rules="adjustRules"
      class="adjust-result"
    >
      <el-form-item
        label="销售价"
        required
      >
        <div style="display: flex">
          <el-form-item prop="currency">
            <el-select
              v-model="adjustForm.currency"
              class="analy-form_mar"
              placeholder="请选择货币"
              :disabled="adjustMsg.state >= 20"
              clearable
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="adjusted_selling_price">
            <el-input
              v-model="adjustForm.adjusted_selling_price"
              class="analy-form_mar"
              placeholder="请输入金额"
              :disabled="adjustMsg.state === 30"
              clearable
              @change="clearRmb"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="adjustForm.adjusted_selling_price_rmb"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-divider />
      <div
        v-if="adjustMsg.state === 20"
        style="text-align: right"
      >
        <el-button
          type="primary"
          @click="submitPrice"
        >
          提交
        </el-button>
      </div>
    </el-form>

    <div
      v-if="adjustMsg.state !== 20"
      style="text-align: right"
    >
      <el-button
        class="close-btn"
        @click="pricingApproval(0)"
      >
        不通过
      </el-button>
      <el-button
        type="primary"
        style="background: #379f0d; border: 1px solid #379f0d"
        @click="pricingApproval(1)"
      >
        通过
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Clock } from '@element-plus/icons';
export default {
  components: {
    Clock
  },
  props: ['dialogVisible', 'title', 'type', 'id', 'adjustMsg', 'market'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      adjustForm: this.adjustMsg.adjustment,
      adjustRules: {
        adjusted_selling_price: [
          {
            required: true,
            message: '请输入金额'
          }
        ]
      },
      currency: []
    };
  },
  mounted() {
    if (this.adjustMsg.state >= 20) {
      this.getPriceRmb();
    }
    this.getCurrency();
  },
  methods: {
    async getCurrency() {
      if (localStorage.getItem('params')) {
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getCurrency();
        } catch (err) {
          return;
        }
      }
    },
    async getPriceRmb() {
      let params = {
        price: this.adjustForm.adjusted_selling_price,
        currency: this.adjustForm.currency,
        product_id: +this.$route.params.productId,
        market: this.market
      };
      if (this.adjustForm.adjusted_selling_price) {
        try {
          await this.$store.dispatch('getPriceRmb', { params });
          this.adjustForm.adjusted_selling_price_rmb =
            this.$store.state.priceRmb;
        } catch (err) {
          return;
        }
      }
    },
    async applyPricing(val) {
      try {
        await this.$store.dispatch('product/project/applyPricing', val);
        this.visible = false;
      } catch (err) {
        return;
      }
    },
    async approvalPricing(val) {
      try {
        await this.$store.dispatch('product/project/approvalPricing', val);
        this.visible = false;
      } catch (err) {
        return;
      }
    },
    async submitAdjust(val) {
      try {
        await this.$store.dispatch(
          'product/project/submitPricingAdjustment',
          val
        );
        this.visible = false;
      } catch (err) {
        return;
      }
    },
    pricingApproval(type) {
      let body = {
        price_adjustment_apply_id: this.id,
        approval_result: type
      };
      if (this.adjustMsg.state === 10) {
        this.applyPricing(body);
      } else if (this.adjustMsg.state === 30) {
        this.approvalPricing(body);
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    colorStage(val) {
      if (val === 10) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    colorApprove(val) {
      if (val === 0) {
        return 'result-fail';
      } else {
        return 'result-pass';
      }
    },
    isNull(val) {
      if (val === null || val === 0) {
        return 'hide';
      }
    },
    submitPrice() {
      this.$refs.adjustForm.validate((valid) => {
        if (valid) {
          let body = {
            price_adjustment_apply_id: this.id,
            adjusted_selling_price: this.adjustForm.adjusted_selling_price,
            adjusted_selling_price_rmb:
              this.adjustForm.adjusted_selling_price_rmb
          };
          this.submitAdjust(body);
        }
      });
    },
    clearRmb() {
      this.adjustForm.adjusted_selling_price_rmb = '';
      this.getPriceRmb();
    },
    clearMoney() {
      this.adjustForm.adjusted_selling_price = '';
      this.adjustForm.adjusted_selling_price_rmb = '';
    }
  }
};
</script>
