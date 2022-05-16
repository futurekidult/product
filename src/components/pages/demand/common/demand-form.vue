<template>
  <el-form
    label-width="100px"
    class="demand-form"
  >
    <el-form-item label="产品名称">
      <el-input />
    </el-form-item>
    <el-form-item label="产品图片">
      <el-upload action="">
        <el-button type="primary">
          点击上传
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            请上传 jpg/png/jepg等图片格式, 单个文件不超过 5MB
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item label="品类">
      <el-select />
    </el-form-item>
    <el-form-item label="品牌">
      <el-input />
    </el-form-item>
    <el-form-item label="竞品图片">
      <el-upload action="">
        <el-button type="primary">
          点击上传
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            请上传 jpg/png/jepg等图片格式, 单个文件不超过 5MB
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item label="竞品链接">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="竞品参数">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="对标理由">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="">
      <el-button>+ 新增竞品</el-button>
    </el-form-item>
    <el-form-item label="核心参数">
      <el-input />
    </el-form-item>
    <el-form-item label="产品尺寸/cm">
      <el-input />
      <el-input />
      <el-input />
    </el-form-item>
    <el-form-item label="包装尺寸/cm">
      <el-input />
      <el-input />
      <el-input />
    </el-form-item>
    <el-form-item label="毛重/kg">
      <el-input />
    </el-form-item>
    <el-form-item label="出货量">
      <el-input />
    </el-form-item>
    <el-form-item label="销售价格">
      <el-select />
      <el-input />
      <el-input />
    </el-form-item>
    <el-form-item label="采购价格">
      <el-select />
      <el-input />
      <el-input />
    </el-form-item>
    <el-form-item label="特别卖点">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="需求洞察来源">
      <el-select />
    </el-form-item>
    <el-form-item label="痛点">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="需求点">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="产品信息">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item v-if="type === 'create'">
      <el-button>保存草稿</el-button>
      <el-button type="primary">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ['type']
};
</script>

<style scoped>
.tip {
  font-size: 12px;
  color: #606266;
  margin-left: 10px;
}

.demand-form {
  width: 1280px;
  margin: auto;
}
</style>
