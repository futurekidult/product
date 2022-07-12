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
          clearable
          placeholder="请输入内容"
          maxlength="200"
          show-word-limit
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
  inject: ['getQuestion'],
  props: ['dialogVisible', 'title', 'type', 'id', 'submitForm', 'content'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      reasonForm: {}
    };
  },
  mounted() {
    if (this.type === 'reason') {
      this.getContent();
    } else if (this.type === 'consequence') {
      this.reasonForm.content = this.content;
    }
  },
  methods: {
    async getContent() {
      try {
        await this.$store.dispatch('product/getContent', {
          params: {
            id: this.id
          }
        });
        this.reasonForm.content = this.$store.state.product.content.content;
      } catch (err) {
        return;
      }
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
          this.getQuestion();
        }
      });
    }
  }
};
</script>
