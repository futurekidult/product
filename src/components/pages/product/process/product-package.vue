<template>
  <div v-loading="$store.state.product.packageLoading">
    <div class="select-title">
      <span class="line">|</span> 包材设计
    </div>

    <el-table
      border
      stripe
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="packageList"
    >
      <el-table-column
        label="序号"
        type="index"
        width="60px"
      />
      <el-table-column
        label="关联定价ID"
        prop="pricing_id"
        width="100px"
      />
      <el-table-column
        label="运营专员"
        prop="operations_specialist"
        width="200px"
      />
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
        width="200px"
      />
      <el-table-column
        label="实际完成时间"
        prop="actual_finish_time"
        width="200px"
      />
      <el-table-column
        label="结果文件地址"
        prop="result_path"
        show-overflow-tooltip
      />
      <el-table-column
        label="状态"
        width="200px"
      >
        <template #default="scope">
          <div :class="changeColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150px"
      >
        <template #default="scope">
          <el-button
            :disabled="scope.row.result_path !== ''"
            @click="showResultForm(scope.row.id)"
          >
            上传结果
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="$store.state.product.packageListLength"
      :current-page="page"
      :page-num="pageNum"
      @change-size="changePageSize"
      @change-page="changeCurrentPage"
    />

    <el-dialog
      v-model="resultFormVisible"
      width="30%"
      title="上传结果"
    >
      <el-form
        ref="resultForm"
        :model="resultForm"
        label-width="100px"
      >
        <el-form-item
          label="文件路径"
          prop="result_path"
          :rules="[{ required: true, message: '请输入内容' }]"
        >
          <el-input
            v-model="resultForm.result_path"
            type="textarea"
            :rows="6"
            clearable
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="">
          <div style="font-size: 10px">
            注：请填写结果文件所在公司盘位置
          </div>
        </el-form-item>
        <el-divider />
        <div style="text-align: center">
          <el-button
            class="close-btn"
            @click="closeResultForm"
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
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ['getPackage'],
  props: ['changeColor', 'packageList', 'currentPage', 'pageSize'],
  emits: ['change-page', 'change-size'],
  data() {
    return {
      packageId: 0,
      resultForm: {},
      resultFormVisible: false,
      page: this.currentPage,
      pageNum: this.pageSize
    };
  },
  watch: {
    currentPage(val) {
      this.page = val;
    },
    pageSize(val) {
      this.pageNum = val;
    }
  },
  methods: {
    async createPackageResult(val) {
      let body = val;
      body.id = this.packageId;
      try {
        await this.$store.dispatch('product/createPackageResult', body);
        this.resultFormVisible = false;
        this.getPackage();
      } catch (err) {
        return;
      }
    },
    showResultForm(id) {
      this.resultFormVisible = true;
      this.packageId = id;
    },
    closeResultForm() {
      this.resultFormVisible = false;
    },
    submitResult() {
      this.$refs.resultForm.validate((valid) => {
        if (valid) {
          this.createPackageResult(this.resultForm);
        }
      });
    },
    changeCurrentPage(val) {
      this.page = val;
      this.$emit('change-page', this.page);
    },
    changePageSize(val) {
      this.pageNum = val;
      this.$emit('change-size', this.pageNum);
    }
  }
};
</script>
