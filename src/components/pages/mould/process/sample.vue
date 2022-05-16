<template>
  <el-upload
    class="upload-demo"
    action=""
  >
    <el-button>上传设计图</el-button>
    <template #tip>
      <div class="el-upload__tip">
        支持office文件,且不超过 5MB
      </div>
    </template>
  </el-upload>
  <section class="progress-table">
    <div class="progress-title">
      手板样确认进度表
    </div>
    <el-table
      border
      empty-text="无数据"
    >
      <el-table-column label="任务负责人" />
      <el-table-column label="实际完成时间" />
      <el-table-column label="状态" />
      <el-table-column label="操作">
        <el-button>不通过</el-button>
        <el-button type="primary">
          通过
        </el-button>
      </el-table-column>
    </el-table>
  </section>
</template>
