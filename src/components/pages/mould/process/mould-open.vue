<template>
  <section class="progress-table">
    <div class="progress-title">
      开模确认进度表
    </div>
    <div>
      <el-button type="primary">
        开模申请
      </el-button>
    </div>
    <el-table
      border
      empty-text="无数据"
    >
      <el-table-column label="任务负责人" />
      <el-table-column label="开模费用" />
      <el-table-column label="说明" />
      <el-table-column label="计划完成时间" />
      <el-table-column label="开模工厂" />
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
