<template>
  <el-dialog
    v-model="visible"
    width="25%"
    :title="title"
    @close="cancel"
  >
    <el-form
      ref="questionForm"
      label-width="100px"
      :model="questionForm"
      :rules="questionRules"
    >
      <el-form-item
        label="问题名称"
        prop="name"
      >
        <el-input
          v-model="questionForm.name"
          placeholder="请输入问题"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="后果描述"
        prop="consequence_text"
      >
        <el-input
          v-model="questionForm.consequence_text"
          placeholder="请输入问题描述"
          type="textarea"
          :rows="6"
          clearable
          maxlength="200"
          show-word-limit
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
          @click="submitTestQuestion"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['id', 'title', 'dialogVisible', 'question', 'getList', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      questionForm: this.question,
      questionRules: {
        name: [
          {
            required: true,
            message: '请输入问题'
          }
        ],
        consequence_text: [
          {
            required: true,
            message: '请输入问题描述'
          }
        ]
      }
    };
  },
  methods: {
    async updateTestQuestion(val) {
      let body = val;
      body.id = this.id;
      if (this.type === 'quality') {
        try {
          await this.$store.dispatch('sample/quality/updateTestQuestion', body);
        } catch (err) {
          return;
        }
      } else if (this.type === 'agency') {
        try {
          await this.$store.dispatch('sample/agency/updateTestQuestion', body);
        } catch (err) {
          return;
        }
      } else {
        try {
          await this.$store.dispatch('sample/user/updateTestQuestion', body);
        } catch (err) {
          return;
        }
      }
      this.visible = false;
      this.getList();
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitTestQuestion() {
      this.$refs.questionForm.validate((valid) => {
        if (valid) {
          this.updateTestQuestion(this.questionForm);
        }
      });
    }
  }
};
</script>
