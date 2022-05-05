<template>
  <el-descriptions
    border
    :column="9"
    direction="vertical"
  >
    <el-descriptions-item label="采购负责人" />
    <el-descriptions-item label="关联ID" />
    <el-descriptions-item label="计划完成时间" />
    <el-descriptions-item label="实际完成时间" />
    <el-descriptions-item label="状态" />
    <el-descriptions-item label="测试结果" />
    <el-descriptions-item label="不通过原因" />
    <el-descriptions-item label="测试结果提交人" />
    <el-descriptions-item label="操作">
      <el-button
        type="text"
        @click="confirmResult"
      >
        样品测试结果确认
      </el-button>
    </el-descriptions-item>
  </el-descriptions>

  <el-dialog
    v-model="confirmVisible"
    title=" 样品测试结果确认"
    width="20%"
  >
    <div
      v-if="testResult === 1"
      class="result-content"
    >
      是否确定提交样品测试结果
    </div>
    <el-form
      v-if="testResult === 0"
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
        />
      </el-form-item>
      <el-divider />
    </el-form>

    <div :class="testResult === 1 ? 'pass-btn' : 'fail-btn'">
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
</template>

<script>
export default {
  data() {
    return {
      confirmVisible: false,
      resultForm: {},
      testResult: 0
    };
  },
  methods: {
    confirmResult() {
      this.confirmVisible = true;
    },
    closeConfirmResult() {
      this.confirmVisible = false;
    },
    submitTestResult() {
      this.$refs.resultForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
