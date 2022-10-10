<template>
  <el-dialog
    v-model="visible"
    title="终止项目"
    width="30%"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="terminateForm"
      :model="terminateForm"
    >
      <el-form-item
        label="终止原因"
        prop="reason"
        :rules="[{ required: true, message: '请输入内容' }]"
      >
        <el-input
          v-model="terminateForm.reason"
          placeholder="请输入内容"
          clearable
          type="textarea"
          :rows="6"
          :disabled="type === 'view'"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-divider />
      <div
        v-if="type === 'create'"
        style="text-align: right"
      >
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
export default {
  inject: ['getBase'],
  props: ['type', 'dialogVisible', 'reason'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      terminateForm: {}
    };
  },
  mounted() {
    if (this.type === 'view') {
      this.terminateForm.reason = this.reason;
    }
  },
  methods: {
    async terminateProject() {
      try {
        await this.$store.dispatch('product/terminateProject', {
          id: +this.$route.params.productId,
          reason: this.terminateForm.reason
        });
        this.visible = false;
        this.getBase();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitForm() {
      this.$refs.terminateForm.validate((valid) => {
        if (valid) {
          this.terminateProject();
        }
      });
    }
  }
};
</script>
