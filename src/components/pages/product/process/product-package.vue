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
      />
      <el-table-column
        label="运营负责人"
        prop="operations_principal"
      />
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
      />
      <el-table-column
        label="实际完成时间"
        prop="actual_finish_time"
      />
      <el-table-column
        label="结果文件地址"
        prop="result_path"
        show-overflow-tooltip
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300px"
      >
        <template #default="scope">
          <el-button @click="showResultForm(scope.row.id)">
            上传结果
          </el-button>
          <el-button
            type="primary"
            @click="confirmResult(scope.row.id)"
          >
            结果确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="packageList.length"
      :get-list="getPackage"
    />
  </div>
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
</template>

<script>
export default {
  inject: ['getPackage'],
  props: ['changeColor', 'packageList'],
  data() {
    return {
      packageId: 0,
      resultForm: {},
      resultFormVisible: false
    };
  },
  methods: {
    async confirmPackageResult(id) {
      try {
        await this.$store.dispatch('product/confirmPackageResult', {
          id
        });
        this.getPackage();
      } catch (err) {
        return;
      }
    },
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
    confirmResult(id) {
      this.confirmPackageResult(id);
    },
    submitResult() {
      this.$refs.resultForm.validate((valid) => {
        if (valid) {
          this.createPackageResult(this.resultForm);
        }
      });
    }
  }
};
</script>
