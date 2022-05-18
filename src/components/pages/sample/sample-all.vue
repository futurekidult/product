<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 筛选条件
    </div>
    <el-form
      label-position="right"
      label-width="80px"
      style="display: flex"
      :model="chooseForm"
    >
      <el-form-item label="产品名称">
        <el-input
          v-model="chooseForm.product_name"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="产品品类">
        <el-select
          v-model="chooseForm.product_category"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="chooseForm.state"
          placeholder="请选择"
        />
      </el-form-item>
      <div style="float: right">
        <el-form-item>
          <el-button
            type="primary"
            @click="search"
          >
            查询
          </el-button>
          <el-button
            class="reset-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>

  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 样品列表
    </div>
    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="sampleList"
    >
      <el-table-column
        label="样品ID"
        prop="id"
      />
      <el-table-column
        label="关联产品名称"
        prop="product_name"
      />
      <el-table-column
        label="关联产品ID"
        prop="product_id"
      />
      <el-table-column
        label="关联定价ID"
        prop="pricing_id"
      />
      <el-table-column
        label="供应商名称"
        prop="supplier"
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
        label="采购员"
        prop="purchase_specialist"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeCellColor(scop.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="测试结果"
        prop="test_result"
      >
        <template #default="scope">
          <div :class="changeCellColor(scop.row.test_result)">
            {{ scope.row.test_result }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            @click="toDetail(scope.row.id)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chooseForm: {},
      sampleList: []
    };
  },
  mounted() {
    this.getSampleList();
  },
  methods: {
    async getSampleList(currentPage = 1, pageSize = 10) {
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
      await this.$store.dispatch('sample/getSampleList', { params });
      this.sampleList = this.$store.state.sample.sampleList;
    },
    search() {
      this.getSampleList();
    },
    resetForm() {
      this.chooseForm = {};
    },
    toDetail(id) {
      this.$router.push(`/sample-list/${id}`);
    },
    changeCellColor(val) {
      if (val === 30 || val === 1) {
        return 'result-pass';
      } else if (val === 20 || val === 10) {
        return 'result-ing';
      } else {
        return 'result-ignore';
      }
    }
  }
};
</script>
