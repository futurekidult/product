<template>
  <div class="survey-title">
    调研进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="负责人" />
    <el-table-column label="是否多平台" />
    <el-table-column label="调研平台" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    label-width="110px"
    style="width: 50%"
  >
    <el-form-item label="上传附件">
      <el-upload action="#">
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div class="attachment-list">
        xx
      </div>
    </el-form-item>
    <el-form-item label="产品链接">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="规格参数">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="产品功能">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="需求分析">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <div class="form-item">
      <el-form-item label="年度销售额(万)">
        <el-input />
      </el-form-item>
      <el-form-item label="最近3年年销售额同比增长率">
        <el-input />
      </el-form-item>
    </div>
    <el-form-item label="淡旺季系数">
      <div class="form-template">
        <el-select />
        <div style="text-align: center">
          至
        </div>
        <el-select />
      </div>
    </el-form-item>
    <div class="form-item">
      <el-form-item label="竞争度/垄断性">
        <el-select />
      </el-form-item>
      <el-form-item label="类目是否跳水">
        <el-select />
      </el-form-item>
      <el-form-item label="精准价位段">
        <el-select />
      </el-form-item>
      <el-form-item label="流浪丰富度">
        <el-select />
      </el-form-item>
      <el-form-item label="关键词是否跳水">
        <el-select />
      </el-form-item>
      <el-form-item label="关键词竞价">
        <el-select />
      </el-form-item>
    </div>
    <el-form-item
      label="竞品是否对标"
      style="width: 49%"
    >
      <el-input />
    </el-form-item>
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
