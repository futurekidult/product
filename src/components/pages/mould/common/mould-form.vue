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
          clearable
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
          clearable
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
          clearable
        />
      </el-form-item>
      <el-form-item label="说明">
        <el-input
          v-model="form.illustration_text"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          clearable
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
  props: ['dialogVisible', 'title', 'type', 'editForm', 'getList'],
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
  mounted() {
    if (this.type === 'edit') {
      this.form = this.editForm;
    }
  },
  methods: {
    async createMakingMould(val) {
      let body = val;
      body['mould_id'] = +this.$route.params.id;
      try {
        await this.$store.dispatch('mould/createMakingMould', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async updateMakingMould(body) {
      try {
        await this.$store.dispatch('mould/updateMakingMould', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
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
          if (this.type === 'create') {
            this.createMakingMould(this.form);
          } else {
            this.updateMakingMould(this.form);
          }
        }
      });
    }
  }
};
</script>
