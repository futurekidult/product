<template>
  <div v-loading="$store.state.sample.baseLoading">
    <el-descriptions
      border
      :column="9"
      direction="vertical"
    >
      <el-descriptions-item label="采购负责人">
        {{ sampleDetail.purchase_principal }}
      </el-descriptions-item>
      <el-descriptions-item label="关联ID">
        {{ sampleDetail.pricing_id }}
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ sampleDetail.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ sampleDetail.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(sampleDetail.state)">
          {{ sampleDetail.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="测试结果">
        <div :class="changeColor(sampleDetail.test_result)">
          {{ sampleDetail.test_result_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="不通过原因">
        {{ sampleDetail.unapproved_reason_text }}
      </el-descriptions-item>
      <el-descriptions-item label="测试结果提交人">
        {{ sampleDetail.submitter }}
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          v-if="sampleDetail.test_result !== -1"
          type="text"
          :disabled="
            sampleDetail.state !== 20 && sampleDetail.test_result !== -1
          "
          :class="sampleDetail.state === undefined ? 'hide' : ''"
          @click="confirmResult"
        >
          样品测试结果确认
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog
      v-model="confirmVisible"
      title=" 样品测试结果确认"
      width="25%"
      :close-on-click-modal="false"
    >
      <div
        v-if="sampleDetail.test_result === 1"
        class="result-content"
      >
        是否确定提交样品测试结果
      </div>
      <el-form
        v-if="sampleDetail.test_result === 0"
        ref="resultForm"
        :model="resultForm"
      >
        <el-form-item
          label="选择样品结果"
          :rules="[{ required: true, message: '请选择样品结果' }]"
          prop="result"
        >
          <el-select
            v-model="resultForm.result"
            placeholder="请选择样品结果"
            clearable
          >
            <el-option
              v-for="item in resultOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-divider />
      </el-form>

      <div :class="sampleDetail.test_result === 1 ? 'pass-btn' : 'fail-btn'">
        <el-button @click="closeConfirmResult">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitTestResult"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['sampleDetail', 'getList', 'changeColor'],
  data() {
    return {
      confirmVisible: false,
      resultForm: {},
      resultOptions: [
        {
          label: '已终止-重新打样',
          value: 40
        },
        {
          label: '已终止-样品终止',
          value: 50
        }
      ]
    };
  },
  methods: {
    async confirmTestResult(val) {
      let body = {
        id: +this.$route.params.id,
        result: val
      };
      try {
        await this.$store.dispatch('sample/confirmTestResult', body);
        this.confirmVisible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    confirmResult() {
      this.confirmVisible = true;
    },
    closeConfirmResult() {
      this.confirmVisible = false;
    },
    submitTestResult() {
      if (this.sampleDetail.test_result === 1) {
        this.confirmTestResult(30);
      } else {
        this.$refs.resultForm.validate((valid) => {
          if (valid) {
            this.confirmTestResult(this.resultForm.result);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
