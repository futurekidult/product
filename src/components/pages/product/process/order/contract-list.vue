<template>
  <div class="order-title">
    合同确认进度表
  </div>

  <el-descriptions
    border
    :column="4"
    direction="vertical"
  >
    <el-descriptions-item label="任务负责人" />
    <el-descriptions-item label="【香港→宁波】的合同确认" />
    <el-descriptions-item label="实际完成时间" />
    <el-descriptions-item label="操作">
      <el-button type="primary">
        已完成
      </el-button>
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    border
    :column="6"
    direction="vertical"
    style="margin-top: 20px"
  >
    <el-descriptions-item label="任务负责人" />
    <el-descriptions-item label="【宁波→工厂】的合同确认" />
    <el-descriptions-item label="实际完成时间" />
    <el-descriptions-item label="产品说明书">
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
    </el-descriptions-item>
    <el-descriptions-item label="刀模附件">
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
    </el-descriptions-item>
    <el-descriptions-item label="操作">
      <el-button type="primary">
        提交
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
