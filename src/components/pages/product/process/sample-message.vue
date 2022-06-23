<template>
  <div v-loading="$store.state.product.sampleLoading">
    <div class="select-title">
      <span class="line">|</span> 样品信息
    </div>

    <el-table
      border
      stripe
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="sampleList"
    >
      <el-table-column
        label="样品ID"
        prop="id"
        width="80px"
      />
      <el-table-column
        label="关联定价ID"
        prop="pricing_id"
      />
      <el-table-column
        label="平台"
        prop="platform"
      />
      <el-table-column
        label="需求数量"
        prop="demand_quantity"
      />
      <el-table-column
        label="需求日期"
        prop="demand_time"
        width="200px"
      />
      <el-table-column
        label="有无认证"
        prop="has_verify"
      />
      <el-table-column
        label="供应商ID"
        prop="supplier_id"
      />
      <el-table-column
        label="采购员"
        prop="purchase_specialist"
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
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
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

    <base-pagination
      :length="sampleList.length"
      :get-list="getSample"
    />
  </div>
</template>

<script>
export default {
  inject: ['getSample'],
  props: ['sampleList'],
  methods: {
    toDetail(id) {
      this.$router.push(`/sample-list/${id}`);
    },
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 30) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    }
  }
};
</script>
