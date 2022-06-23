<template>
  <div v-loading="$store.state.product.questionLoading">
    <div class="select-title">
      <span class="line">|</span> 测试问题
    </div>

    <el-table
      border
      stripe
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="questionList"
    >
      <el-table-column
        label="序号"
        type="index"
        width="60px"
      />
      <el-table-column label="关联样品ID">
        <template #default="scope">
          <el-button
            type="text"
            @click="toSampleDetail(scope.row.sample_id)"
          >
            {{ scope.row.sample_id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="关联定价ID"
        prop="pricing_id"
      />
      <el-table-column
        label="问题名称"
        prop="name"
      />
      <el-table-column label="后果描述">
        <template #default="scope">
          <el-button
            type="text"
            @click="showConsequenceForm(scope.row.consequence)"
          >
            查看内容
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="记录时间"
        prop="record_time"
        width="200px"
      />
      <el-table-column
        label="问题来源"
        prop="source"
      />
      <el-table-column
        label="采购员"
        prop="purchase_specialist"
      />
      <el-table-column
        label="解決时间"
        prop="resolve_time"
        width="200px"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="原因">
        <template #default="scope">
          <el-button
            v-if="scope.row.state === 30"
            type="text"
            @click="showReasonForm(scope.row.ignore_reason_id)"
          >
            查看内容
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300px"
      >
        <template #default="scope">
          <el-button @click="showIgnoreForm(scope.row.id)">
            可忽略
          </el-button>
          <el-button
            type="success"
            @click="showResolveDialog(scope.row.id)"
          >
            已解决
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="questionList.length"
      :get-list="getQuestion"
    />
  </div>
  <reason-form
    v-if="ignoreFormVisible"
    :id="questionId"
    :dialog-visible="ignoreFormVisible"
    title="忽略原因"
    type="ignore"
    :submit-form="submitQuestionResult"
    @hide-dialog="closeIgnoreForm"
  />
  <reason-form
    v-if="reasonFormVisible"
    :id="reasonId"
    :dialog-visible="reasonFormVisible"
    title="原因"
    type="reason"
    @hide-dialog="closeReasonForm"
  />
  <reason-form
    v-if="consequenceFormVisible"
    :content="consequence"
    :dialog-visible="consequenceFormVisible"
    title="后果描述"
    type="consequence"
    @hide-dialog="closeConsequenceForm"
  />

  <el-dialog
    v-model="resolveDialog"
    title="提示"
    width="20%"
  >
    <div class="result-content">
      是否确定提交样品测试结果
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
</template>

<script>
import ReasonForm from '../common/reason-form.vue';

export default {
  components: {
    ReasonForm
  },
  inject: ['getQuestion'],
  props: ['questionList'],
  data() {
    return {
      ignoreFormVisible: false,
      reasonFormVisible: false,
      consequenceFormVisible: false,
      questionId: 0,
      consequence: '',
      reasonId: 0,
      resolveDialog: false,
      resolveId: 0
    };
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
    changeCellColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else if (val === 20) {
        return 'result-pass';
      } else {
        return 'result-ignore';
      }
    },
    toSampleDetail(id) {
      this.$router.push(`/sample-list/${id}`);
    }
  }
};
</script>
