<template>
  <el-form :model="reviewForm">
    <el-form-item label="评审结果">
      <el-select v-model="reviewForm.result">
        <el-option
          label="通过"
          value="0"
        />
        <el-option
          label="不通过"
          value="1"
        />
      </el-select>
    </el-form-item>
    <div v-if="flag === 'pass'">
      <el-divider />
      <el-form-item>
        <demand-pass />
      </el-form-item>
    </div>
    <div v-if="flag === 'fail'">
      <el-divider />
      <el-form-item label="不通过原因">
        <el-input
          v-model="reviewForm.failForm.reason"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">
          提交
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
import DemandPass from './demand-review-pass.vue';

export default {
  components: {
    DemandPass
  },
  data() {
    return {
      reviewForm: {
        result: '',
        failForm: {
          reason: ''
        }
      },
      flag: ''
    };
  },
  computed: {
    getResult() {
      return this.reviewForm.result;
    }
  },
  watch: {
    getResult(val) {
      if (val === '0') {
        this.flag = 'pass';
      } else {
        this.flag = 'fail';
      }
    }
  }
};
</script>
