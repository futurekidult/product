<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="20%"
    @close="cancel"
  >
    <el-form
      ref="reasonForm"
      :model="reasonForm"
      :rules="getRules"
    >
      <el-form-item
        label="内容"
        prop="content"
        :rules="[{ required: true, message: '请输入内容' }]"
      >
        <el-input
          v-model="reasonForm.content"
          type="textarea"
          :rows="6"
        />
      </el-form-item>
      <div
        v-if="type === 'ignore'"
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
          @click="submitReasonForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'title', 'type', 'id', 'submitForm'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      reasonForm: {}
    };
  },
  mounted() {
    if (this.type !== 'ignore') {
      this.getContent();
    }
  },
  methods: {
    async getContent() {
      await this.$store.dispatch('product/getContent', {
        params: {
          id: this.id
        }
      });
      this.reasonForm.content = this.$store.state.product.content.content;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitReasonForm() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          this.submitForm(this.id, 0, this.reasonForm.content);
          this.visible = false;
        }
      });
    }
  }
};
</script>
