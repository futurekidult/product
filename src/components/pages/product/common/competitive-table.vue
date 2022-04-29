<template>
  <el-collapse class="collapse-item">
    <el-collapse-item title="竞品信息">
      <el-table
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="competitiveProduct"
      >
        <el-table-column label="上传附件">
          <el-button type="text">
            预览
          </el-button>
          <span class="table-btn">|</span>
          <el-button type="text">
            下载
          </el-button>
        </el-table-column>
        <el-table-column
          label="竞品链接"
          prop="link"
        />
        <el-table-column
          label="竞品参数"
          prop="parameter"
        />
        <el-table-column
          label="对标理由"
          prop="reason"
        />
      </el-table>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  props: ['competitiveProduct']
};
</script>
