<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="supplyForm"
      :model="supplyForm"
    >
      <el-form-item
        :label="label"
        :prop="prop"
        :rules="[{ required: true, message: '请输入内容' }]"
      >
        <el-input
          v-model="supplyForm[prop]"
          type="textarea"
          :rows="6"
          clearable
          placeholder="请输入内容"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitSupplyContent"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: [
    'title',
    'label',
    'prop',
    'dialogVisible',
    'value',
    'action',
    'ids',
    'updateId',
    'type',
    'getList'
  ],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      supplyForm: {}
    };
  },
  mounted() {
    if (this.action === 'suggestion update') {
      this.supplyForm[this.prop] = this.value;
    }
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async createSuggestionContent(body) {
      try {
        body['survey_id'] = this.ids.survey_id;
        await this.$store.dispatch(
          'product/survey/createSurveySuggestion',
          body
        );
        this.visible = false;
        this.$emit('hide-dialog', this.visible);
        this.getList();
      } catch (err) {
        return;
      }
    },
    async updateSuggestionContent(body) {
      try {
        body['id'] = this.updateId;
        await this.$store.dispatch(
          'product/survey/updateSurveySuggestion',
          body
        );
        this.visible = false;
        this.$emit('hide-dialog', this.visible);
        this.getList();
      } catch (err) {
        return;
      }
    },
    submitSupplyContent() {
      this.$refs.supplyForm.validate((valid) => {
        if (valid) {
          let body = this.supplyForm;
          body.type = this.type;
          switch (this.action) {
            case 'suggestion create':
              body['survey_schedule_id'] = this.ids.survey_schedule_id;
              this.createSuggestionContent(body);
              break;
            case 'suggestion update':
              body['survey_schedule_id'] = this.ids.survey_schedule_id;
              this.updateSuggestionContent(body);
              break;
            default:
          }
        }
      });
    }
  }
};
</script>
