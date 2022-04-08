<template>
  <div class="select-title">
    <span class="line">|</span> 项目立项
  </div>

  <div class="project-title">
    立项进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="项目管理员" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="评审状态" />
    <el-table-column label="状态" />
    <el-table-column label="操作" />
  </el-table>

  <el-form
    label-width="100px"
    class="project-form"
    :model="projectForm"
  >
    <el-form-item
      label="评审结果"
      style="width: 20%"
    >
      <el-select v-model="projectForm.result">
        <el-option
          value="0"
          label="通过"
        />
        <el-option
          value="1"
          label="不通过"
        />
      </el-select>
    </el-form-item>
    <el-divider />
    <el-form-item
      v-if="flag === 'fail'"
      label="不通过原因"
      style="width: 50%"
    >
      <el-input type="textarea" />
    </el-form-item>
    <div v-if="flag === 'pass'">
      <div class="profit-plan_title">
        核算利润表
      </div>
      <el-table
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        class="profit-plan_table"
      >
        <el-table-column label="序号" />
        <el-table-column label="市场" />
        <el-table-column label="平台" />
        <el-table-column label="是否开模" />
        <el-table-column label="调价记录" />
        <el-table-column label="操作" />
      </el-table>

      <el-button class="profit-plan_btn">
        + 新增核算利润
      </el-button>

      <div class="profit-plan_title">
        项目进度计划表
      </div>
      <el-table
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        class="profit-plan_table"
      >
        <el-table-column label="序号" />
        <el-table-column label="阶段名称" />
        <el-table-column label="计划完成时间" />
        <el-table-column label="实际完成时间" />
        <el-table-column label="状态" />
        <el-table-column label="操作" />
      </el-table>
      <el-button class="profit-plan_btn">
        设置阶段完成时间
      </el-button>

      <div class="profit-plan_title">
        销售计划表
      </div>

      <el-form-item
        label="上传附件"
        style="margin-bottom: 18px"
      >
        <el-upload action="#">
          <el-button type="primary">
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px">
        <div
          class="attachment-list"
          style="width: 50%"
        >
          xx
        </div>
      </el-form-item>
    </div>
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
    return {
      projectForm: {
        result: ''
      },
      flag: ''
    };
  },
  computed: {
    getResult() {
      return this.projectForm.result;
    }
  },
  watch: {
    getResult(val) {
      if (val === '0') {
        this.flag = 'pass';
      } else {
        this.flag = 'fail';
      }
    }
  }
};
</script>

<style scoped>
.project-form {
  margin: 20px 0;
}

.profit-plan_table {
  margin-left: 30px;
}

.profit-plan_btn {
  margin-left: 30px;
  margin-top: 15px;
}
</style>
