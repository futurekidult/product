<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="开模费用"
        prop="cost"
      >
        <el-input
          v-model="form.cost"
          placeholder="请输入开模费用"
        >
          <template #prepend>
            ￥
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="开模工厂"
        prop="mould_factory"
      >
        <el-input
          v-model="form.mould_factory"
          placeholder="请输入开模工厂"
        />
      </el-form-item>
      <el-form-item
        label="计划完成时间"
        prop="estimated_finish_time"
      >
        <el-date-picker
          v-model="form.estimated_finish_time"
          type="datetime"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="说明">
        <el-input
          v-model="form.illustration_text"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
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
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { timestamp } from '../../../../utils/index';

export default {
  props: ['dialogVisible', 'title', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      form: {},
      rules: {
        cost: [
          {
            required: true,
            message: '请输入开模费用'
          }
        ],
        mould_factory: [
          {
            required: true,
            message: '请输入开模工厂'
          }
        ],
        estimated_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ]
      },
      visible: this.dialogVisible
    };
  },
  methods: {
    async createMakingMould(val) {
      let body = val;
      body['mould_id'] = +this.$route.params.id;
      await this.$store.dispatch('mould/createMakingMould', body);
      this.visible = false;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.estimated_finish_time = timestamp(
            this.form.estimated_finish_time
          );
          this.form.cost = +this.form.cost;
          this.createMakingMould(this.form);
        }
      });
    }
  }
};
</script>
