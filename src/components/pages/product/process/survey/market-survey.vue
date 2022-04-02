<template>
  <div class="survey-title">
    调研进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="负责人" />
    <el-table-column label="是否多市场" />
    <el-table-column label="调研市场" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    label-width="80px"
    style="width: 50%"
  >
    <el-form-item label="上传附件">
      <el-upload action="#">
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式,文档不超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div class="attachment-list">
        xx
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
