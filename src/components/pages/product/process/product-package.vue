<template>
  <div v-loading="$store.state.product.packageLoading">
    <div class="select-title">
      <span class="line">|</span> 包材设计
    </div>
    <base-table
      :table-data="packageList"
      :pagination="pagination"
      :length="$store.state.product.packageListLength"
      :table-column="$global.packageTableColumn"
      @change-pagination="changePagination"
    >
      <template #default="slotProps">
        <text-btn
          :disabled="slotProps.row.result_path !== ''"
          @handle-click="showResultForm(slotProps.row.id)"
        >
          上传结果
        </text-btn>
      </template>
    </base-table>

    <el-dialog
      v-model="resultFormVisible"
      width="30%"
      title="上传结果"
      :close-on-click-modal="false"
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
            maxlength="120"
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
  props: ['packageList', 'packagePagination'],
  data() {
    return {
      packageId: 0,
      resultForm: {},
      resultFormVisible: false,
      pagination: this.packagePagination
    };
  },
  watch: {
    packagePagination(val) {
      this.pagination = val;
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
    changePagination(pagination) {
      this.pagination = pagination;
      this.$emit('change-page', this.pagination);
    }
  }
};
</script>
