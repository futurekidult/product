<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="35%"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="supplyForm"
      label-width="150px"
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
          :disabled="action.indexOf('view') > -1"
          clearable
          placeholder="请输入内容"
          :maxlength="prop === 'content' ? 200 : 120"
          show-word-limit
        />
      </el-form-item>
      <div v-if="action.indexOf('view') > -1">
        <el-divider />
        <el-form-item
          label="评审结果"
          prop="review_result"
          :rules="[{ required: true, message: '请输入内容' }]"
        >
          <el-select
            v-model="supplyForm.review_result"
            placeholder="请选择评审结果"
            clearable
            :disabled="action.indexOf(' view') > -1"
          >
            <el-option
              v-for="item in reviewOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
      </div>
      <div
        v-if="action.indexOf(' view') === -1"
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
    'id',
    'ids',
    'type',
    'title',
    'label',
    'prop',
    'value',
    'action',
    'getList',
    'updateId',
    'getQuality',
    'dialogVisible'
  ],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      supplyForm: {},
      reviewOptions: this.$global.reviewOptions
    };
  },
  mounted() {
    if (this.action.indexOf(' view') > -1) {
      this.supplyForm = this.value;
    } else if (this.action.indexOf('create') === -1) {
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
    async createSupplementContent(body) {
      body['sample_id'] = this.id;
      try {
        await this.$store.dispatch('sample/createSupply', body);
        this.visible = false;
        this.$emit('hide-dialog', this.visible);
        this.getList();
      } catch (err) {
        return;
      }
    },
    async reviewSupplementContent(body) {
      try {
        body['id'] = this.updateId;
        await this.$store.dispatch('sample/reviewSupply', body);
        this.visible = false;
        this.$emit('hide-dialog', this.visible);
        this.getList();
        this.getQuality();
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
            case 'supplement create':
              this.createSupplementContent(body);
              break;
            case 'supplement review':
              this.reviewSupplementContent(body);
              break;
            default:
          }
        }
      });
    }
  }
};
</script>
