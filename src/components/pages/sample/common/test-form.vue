<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="applyForm"
      :model="applyForm"
      :rules="rules"
      label-width="160px"
    >
      <el-form-item
        label="样品型号"
        required
      >
        <el-input
          v-model="applyForm.sample_model"
          placeholder="请输入样品型号"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="售卖国家"
        required
      >
        <el-input
          v-model="applyForm.market"
          placeholder="请输入售卖国家"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="样品总数"
        prop="total"
      >
        <el-input
          v-model="applyForm.total"
          placeholder="请输入样品总数"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="售卖国整数与测试报告">
        <el-select
          v-model="applyForm.certificate_and_report"
          placeholder="请选择"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item
        label="样品是否大货包装"
        prop="is_pre_production"
      >
        <el-select
          v-model="applyForm.is_pre_production"
          placeholder="请选择"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item
        label="是否含规格说明书"
        prop="has_manual"
      >
        <el-select
          v-model="applyForm.has_manual"
          placeholder="请选择"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item
        label="期望完成日期"
        prop="expected_finish_time"
      >
        <el-date-picker
          v-model="applyForm.expected_finish_time"
          placeholder="请选择日期"
          :disabled="disabled"
        />
      </el-form-item>
      <el-divider />
      <el-form-item
        label="评审结果"
        prop="review_result"
      >
        <el-select
          v-model="applyForm.review_result"
          :disabled="type === 'view' ? true : false"
          placeholder="请选择评审结果"
        >
          <el-option
            label="不通过"
            value="0"
          />
          <el-option
            label="通过"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="flag"
        label="选择品质专员"
        prop="quality_specialist_id"
      >
        <el-select
          v-model="applyForm.quality_specialist_id"
          placeholder="请选择品质专员"
          :disabled="type === 'view' ? true : false"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button type="primary">
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'title', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      applyForm: {},
      applyRules: {
        total: [
          {
            required: true,
            message: '请输入样品总数'
          }
        ],
        is_pre_production: [
          {
            required: true,
            message: '请选择'
          }
        ],
        has_manual: [
          {
            required: true,
            message: '请选择'
          }
        ],
        expected_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ]
      },
      reviewRules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        quality_specialist_id: [
          {
            required: true,
            message: '请选择品质专员'
          }
        ]
      },
      flag: false,
      disabled: null
    };
  },
  computed: {
    rules() {
      if (this.type === 'apply') {
        return this.applyRules;
      } else if (this.type === 'review') {
        return this.reviewRules;
      } else {
        return '';
      }
    },
    getReviewResult() {
      return this.applyForm.review_result;
    }
  },
  watch: {
    getReviewResult(val) {
      if (val === '1') {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  },
  created() {
    this.isDisabled();
    if (this.type === 'view') {
      this.flag = true;
    }
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    isDisabled() {
      if (this.type === 'apply') {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  }
};
</script>
