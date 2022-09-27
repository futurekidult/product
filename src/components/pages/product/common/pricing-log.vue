<template>
  <el-dialog
    v-model="visible"
    title="记录"
    width="40%"
    @close="cancel"
  >
    <el-scrollbar height="400px">
      <div
        v-for="(item, index) in getList"
        :key="index"
      >
        <div class="adjust-time">
          <el-icon :size="19">
            <clock />
          </el-icon>
          <div>申请提交时间: {{ item.submit_time }}</div>
        </div>

        <div class="adjust-result">
          <el-descriptions
            border
            :column="4"
            direction="vertical"
          >
            <el-descriptions-item label="平台名称">
              {{ item.platform }}
            </el-descriptions-item>
            <el-descriptions-item label="申请前销售价">
              ￥ {{ item.origin_selling_price }}
            </el-descriptions-item>
            <el-descriptions-item label="申请调整后销售价">
              ￥{{ item.applied_selling_price }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="item.adjusted_selling_price_rmb === '' ? '' : 'hide'"
              label="实际调整后销售价"
            >
              ￥{{ item.adjusted_selling_price_rmb }}
            </el-descriptions-item>
          </el-descriptions>

          <section>申请调价原因: {{ item.reason }}</section>
          <section>申请人: {{ item.applicant }}</section>
          <section :class="isNull(item.apply_approve_result)">
            调价申请审批:
            <span :class="colorApprove(item.apply_approve_result)">{{
              item.apply_approve_result
            }}</span>
          </section>
          <section :class="isNull(item.apply_approve_time)">
            审批完成时间: {{ item.apply_approve_time }}
          </section>
          <section :class="isNull(item.operator)">
            调价人: {{ item.operator }}
          </section>
          <section :class="isNull(item.adjust_state)">
            调价状态:
            <span
              :class="colorStage(item.adjust_state)"
            >{{ item.adjust_state_desc }}
            </span>
          </section>
          <section :class="isNull(item.adjust_approve_time)">
            调价完成时间: {{ item.adjust_approve_time }}
          </section>
          <el-divider />
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import { Clock } from '@element-plus/icons';
export default {
  components: {
    Clock
  },
  props: ['dialogVisible', 'getList'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible
    };
  },
  methods: {
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
      if (val === '不通过') {
        return 'result-fail';
      } else {
        return 'result-pass';
      }
    },
    isNull(val) {
      if (val === 0 || val === '') {
        return 'hide';
      }
    }
  }
};
</script>
