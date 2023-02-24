<template>
  <div v-loading="$store.state.product.questionLoading">
    <div class="select-title">
      <span class="line">|</span> 测试问题
    </div>
    <base-table
      :table-data="questionList"
      :pagination="pagination"
      :operation-width="250"
      :length="$store.state.product.questionListLength"
      :table-column="$global.questionTableColumn"
      @change-pagination="changePagination"
    >
      <template #link="linkProps">
        <text-btn @handle-click="toSampleDetail(linkProps.row.sample_id)">
          {{ linkProps.row.sample_id }}
        </text-btn>
      </template>
      <template #description="descriptionProps">
        <text-btn
          @handle-click="showConsequenceForm(descriptionProps.row.consequence)"
        >
          查看内容
        </text-btn>
      </template>
      <template #operation="operationProps">
        <text-btn
          v-if="operationProps.row.state === 30"
          @handle-click="showReasonForm(operationProps.row.ignore_reason_id)"
        >
          查看内容
        </text-btn>
      </template>
      <template #default="slotProps">
        <el-button
          :disabled="slotProps.row.state !== 10"
          @click="showIgnoreForm(slotProps.row.id)"
        >
          可忽略
        </el-button>
        <el-button
          type="success"
          :disabled="slotProps.row.state !== 10"
          @click="showResolveDialog(slotProps.row.id)"
        >
          已解决
        </el-button>
      </template>
    </base-table>

    <reason-form
      v-if="ignoreFormVisible"
      :id="questionId"
      :dialog-visible="ignoreFormVisible"
      title="忽略原因"
      type="ignore"
      :submit-form="submitQuestionResult"
      :close-on-click-modal="false"
      @hide-dialog="closeIgnoreForm"
    />

    <reason-form
      v-if="reasonFormVisible"
      :id="reasonId"
      :dialog-visible="reasonFormVisible"
      title="原因"
      type="reason"
      :close-on-click-modal="false"
      @hide-dialog="closeReasonForm"
    />

    <reason-form
      v-if="consequenceFormVisible"
      :content="consequence"
      :dialog-visible="consequenceFormVisible"
      title="后果描述"
      type="consequence"
      :close-on-click-modal="false"
      @hide-dialog="closeConsequenceForm"
    />

    <el-dialog
      v-model="resolveDialog"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        是否确认已解决问题
      </div>
      <div style="text-align: center">
        <el-button
          class="close-btn"
          @click="closeResolveDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitResult"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ReasonForm from '../common/reason-form.vue';

export default {
  components: {
    ReasonForm
  },
  inject: ['getQuestion'],
  props: ['questionList', 'questionPagination'],
  data() {
    return {
      ignoreFormVisible: false,
      reasonFormVisible: false,
      consequenceFormVisible: false,
      questionId: 0,
      consequence: '',
      reasonId: 0,
      resolveDialog: false,
      resolveId: 0,
      pagination: this.questionPagination
    };
  },
  watch: {
    questionPagination(val) {
      this.pagination = val;
    }
  },
  methods: {
    async submitQuestionResult(id, val, reason = '') {
      let body = {
        problem_id: id,
        result: val
      };
      if (val === 0) {
        body['ignore_reason_text'] = reason;
      }
      try {
        await this.$store.dispatch('product/submitQuestionResult', body);
        this.getQuestion();
      } catch (err) {
        return;
      }
    },
    showIgnoreForm(id) {
      this.ignoreFormVisible = true;
      this.questionId = id;
    },
    closeIgnoreForm() {
      this.ignoreFormVisible = false;
    },
    showConsequenceForm(content) {
      this.consequenceFormVisible = true;
      this.consequence = content;
    },
    closeConsequenceForm() {
      this.consequenceFormVisible = false;
    },
    showReasonForm(id) {
      this.reasonId = id;
      this.reasonFormVisible = true;
    },
    closeReasonForm() {
      this.reasonFormVisible = false;
    },
    showResolveDialog(id) {
      this.resolveDialog = true;
      this.resolveId = id;
    },
    closeResolveDialog() {
      this.resolveDialog = false;
    },
    submitResult() {
      this.submitQuestionResult(this.resolveId, 1);
      this.resolveDialog = false;
    },
    toSampleDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/sample-list') > -1) {
        this.$router.push(`/sample-list/${id}`);
        this.$store.commit('setActiveTab', 'base');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.$emit('change-page', this.pagination);
    }
  }
};
</script>
