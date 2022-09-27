<template>
  <el-dialog
    v-model="visible"
    title="上传结果"
    width="35%"
    @close="cancel"
  >
    <el-form
      ref="resultForm"
      :model="resultForm"
      label-width="100px"
      :rules="templateRules"
    >
      <el-form-item
        label="体验报告"
        prop="user_template_file"
      >
        <base-upload
          type="file"
          tag="体验报告"
          url="user-experience-report"
          :file="attachment"
          :is-disabled="false"
          @get-file="getUploadFile"
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
          @click="submitResultForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['id', 'dialogVisible', 'getList', 'userId'],
  emits: ['hide-dialog'],
  data() {
    return {
      resultForm: {},
      visible: this.dialogVisible,
      attachment: {},
      templateRules: {
        user_template_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      }
    };
  },
  methods: {
    async uploadFile(val) {
      let body = {
        user_test_apply_id: this.id,
        test_result_file: val,
        user_id: this.userId
      };
      try {
        await this.$store.dispatch('sample/user/uploadFile', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitResultForm() {
      this.resultForm.user_template_file = this.attachment.id;
      this.$refs.resultForm.validate((valid) => {
        if (valid) {
          this.uploadFile(this.attachment.id);
        }
      });
    },
    getUploadFile(e) {
      this.attachment = e;
    }
  }
};
</script>
