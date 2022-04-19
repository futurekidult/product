<template>
  <div class="order-title">
    合同确认进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="【香港→宁波】的合同确认" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="操作">
      <el-button type="primary">
        已完成
      </el-button>
    </el-table-column>
  </el-table>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    style="margin-top: 20px"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="【宁波→工厂】的合同确认" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="产品说明书">
      <el-button type="text">
        上传
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        预览
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        下载
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        删除
      </el-button>
    </el-table-column>
    <el-table-column label="刀模附件">
      <el-button type="text">
        上传
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        预览
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        下载
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        删除
      </el-button>
    </el-table-column>
    <el-table-column label="操作">
      <el-button>提交</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
