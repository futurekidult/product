<template>
  <div class="order-title">
    SKU命名进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <el-form
    label-width="110px"
    style="width: 50%; margin: 20px 0"
  >
    <div class="form-item">
      <el-form-item label="平台">
        <el-select />
      </el-form-item>
      <el-form-item label="SKU命名">
        <el-select />
      </el-form-item>
    </div>
    <el-form-item>
      <el-button>+ 新增SKU</el-button>
    </el-form-item>
    <el-form-item label="上传附件">
      <el-upload action="#">
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
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

  <div class="order-title">
    SKU录入进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作" />
  </el-table>
</template>
