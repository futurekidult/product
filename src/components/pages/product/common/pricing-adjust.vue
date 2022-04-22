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
      <div>申请提交时间: {{ list.submit_time }}</div>
    </div>

    <div class="adjust-result">
      <el-descriptions
        border
        :column="4"
        direction="vertical"
      >
        <el-descriptions-item label="平台名称" />
        <el-descriptions-item label="申请前销售价" />
        <el-descriptions-item label="申请调整后销售价" />
        <el-descriptions-item
          v-if="list.state === 30"
          label="实际调整后销售价"
        />
      </el-descriptions>

      <section>申请调价原因: {{ list.reason }}</section>
      <section>申请人: {{ list.applicant }}</section>
      <section v-if="list.state !== 10">
        调价申请审批:
        <span :class="colorApprove(list.apply_approve_result)">
          {{ list.apply_approve_result }}</span>
      </section>
      <section v-if="list.state !== 10">
        审批完成时间: {{ list.apply_approve_time }}
      </section>
      <section v-if="list.state === 30">
        调价人: {{ list.operator }}
      </section>
      <section v-if="list.state === 30">
        调价状态:
        <span :class="colorApprove(list.adjust_state)">{{
          list.adjust_state
        }}</span>
      </section>
      <el-divider />
    </div>

    <el-form
      v-if="list.state !== 10"
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
              :disabled="list.state === 30 ? true : false"
            />
          </el-form-item>
          <el-form-item prop="money">
            <el-input
              v-model="adjustForm.money"
              class="analy-form_mar"
              placeholder="请输入金额"
              :disabled="list.state === 30 ? true : false"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="adjustForm.yuan"
              disabled
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-divider />
      <div
        v-if="list.state === 20"
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
      v-if="list.state !== 20"
      style="text-align: right"
    >
      <el-button class="close-btn">
        不通过
      </el-button>
      <el-button
        type="primary"
        style="background: #379f0d; border: 1px solid #379f0d"
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
  props: ['dialogVisible', 'title', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      list: {
        state: 30
      },
      adjustForm: {},
      adjustRules: {
        currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        money: [
          {
            required: true,
            message: '请输入金额'
          }
        ]
      }
    };
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    colorStage(val) {
      if (val === '待审批') {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    colorApprove(val) {
      if (val === '不通过') {
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
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
