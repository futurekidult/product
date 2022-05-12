<template>
  <div class="select-title">
    <span class="line">|</span> 测试问题
  </div>

  <el-table
    border
    empty-text="无数据"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :data="getQuestionList"
  >
    <el-table-column
      label="序号"
      type="index"
      width="80px"
    />
    <el-table-column
      label="关联样品ID"
      prop="sample_id"
    />
    <el-table-column
      label="关联定价ID"
      prop="pricing_id"
    />
    <el-table-column
      label="问题名称"
      props="name"
    />
    <el-table-column label="后果描述">
      <template #default="scope">
        <el-button
          type="text"
          @click="showConsequenceForm(scope.row.consequence_id)"
        >
          查看内容
        </el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="记录时间"
      props="record_time"
    />
    <el-table-column
      label="问题来源"
      props="source"
    />
    <el-table-column
      label="采购员"
      props="purchase_specialist"
    />
    <el-table-column
      label="解決时间"
      props="resolve_time"
    />
    <el-table-column
      label="状态"
      props="state_desc"
    />
    <el-table-column label="原因">
      <template #default="scope">
        <el-button
          type="text"
          @click="showReasonForm(scope.row.ignore_reason_id)"
        >
          查看内容
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button @click="showIgnoreForm(scope.row.id)">
          可忽略
        </el-button>
        <el-button @click="showResolveDialog(scope.row.id)">
          已解决
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <base-pagination :length="questionList" />

  <reason-form
    v-if="ignoreFormVisible"
    :id="questionId"
    :dialog-visible="ignoreFormVisible"
    title="忽略原因"
    type="ignore"
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
    :id="consequenceId"
    :dialog-visible="consequenceFormVisible"
    title="后果描述"
    type="consequence"
    @hide-dialog="closeConsequenceForm"
  />

  <el-dialog
    v-model="resolveDialog"
    title="提示"
  >
    <div class="result-content">
      是否确定提交样品测试结果
    </div>
    <div style="text-align: center">
      <el-button> 取消 </el-button>
      <el-button type="primary">
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
  data() {
    return {
      questionList: [],
      ignoreFormVisible: false,
      reasonFormVisible: false,
      consequenceFormVisible: false,
      questionId: 0,
      consequenceId: 0,
      reasonId: 0,
      resolveDialog: false,
      resolveId: 0
    };
  },
  mounted() {
    this.getQuestionList();
  },
  methods: {
    async getQuestionList() {
      let params = {
        product_id: +this.$route.params.productId,
        current_page: 1,
        page_size: 10
      };
      await this.$store.dispatch('product/getQuestionList', { params });
      this.questionList = this.$store.state.product.questionList;
    },
    showIgnoreForm(id) {
      this.ignoreFormVisible = true;
      this.questionId = id;
    },
    closeIgnoreForm() {
      this.ignoreFormVisible = false;
    },
    showConsequenceForm(id) {
      this.consequenceFormVisible = true;
      this.consequenceId = id;
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
    }
  }
};
</script>
