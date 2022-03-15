<template>
  <el-button type="primary">
    选择模具
  </el-button>

  <el-table
    border
    empty-text="无数据"
  >
    <el-table-column label="模具ID" />
    <el-table-column label="模具名称" />
    <el-table-column label="开模工厂名称" />
    <el-table-column label="创建时间" />
    <el-table-column label="创建人" />
    <el-table-column label="操作">
      <el-button type="text">
        删除
      </el-button>
      <el-button type="text">
        查看
      </el-button>
    </el-table-column>
  </el-table>
</template>
