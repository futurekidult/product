<template>
  <el-dialog
    v-model="visible"
    title="调价记录"
    width="30%"
    @close="cancel"
  >
    <el-scrollbar height="400px">
      <div
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="adjust-time">
          <el-icon :size="19">
            <clock />
          </el-icon>
          <div>申请提交时间: {{ item.submit_time }}</div>
        </div>

        <div class="adjust-result">
          <el-table
            border
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            :data="item.content"
          >
            <el-table-column
              label="平台名称"
              prop="platform"
            />
            <el-table-column
              label="申请前销售价"
              prop="origin_selling_price"
            />
            <el-table-column
              label="申请调整后销售价"
              prop="applied_selling_price"
            />
            <el-table-column
              v-if="item.isShow"
              label="实际调整后销售价"
              prop="adjusted_selling_price_rmb"
            />
          </el-table>

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
            >{{ item.adjust_state }}
            </span>
          </section>
          <section :class="isNull(item.adjust_approve_time)">
            调价完成时间: {{ item.adjust_approve_time }}
          </section>
          <el-divider />
        </div>
      </div>
      <el-divider />
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import { Clock } from '@element-plus/icons';
export default {
  components: {
    Clock
  },
  props: ['dialogVisible'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      list: []
    };
  },
  created() {
    this.getColumn();
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    getColumn() {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].content[0].adjusted_selling_price_rmb === 0) {
          this.list[i].isShow = false;
        } else {
          this.list[i].isShow = true;
        }
      }
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
