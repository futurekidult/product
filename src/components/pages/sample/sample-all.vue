<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 筛选条件
    </div>
    <el-form
      label-width="80px"
      style="display: flex"
      :model="chooseForm"
    >
      <el-form-item label="产品名称">
        <el-input
          v-model="chooseForm.name"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="产品品类">
        <el-select
          v-model="chooseForm.type"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="chooseForm.status"
          placeholder="请选择"
        />
      </el-form-item>
      <div style="float: right">
        <el-form-item>
          <el-button type="primary">
            查询
          </el-button>
          <el-button> 重置 </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>

  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 样品列表
    </div>
    <el-table
      border
      empty-text="无数据"
    >
      <el-table-column label="样品ID" />
      <el-table-column label="关联产品名称" />
      <el-table-column label="关联产品ID" />
      <el-table-column label="关联定价ID" />
      <el-table-column label="供应商名称" />
      <el-table-column label="计划完成时间" />
      <el-table-column label="实际完成时间" />
      <el-table-column label="采购员" />
      <el-table-column label="状态" />
      <el-table-column label="测试结果" />
      <el-table-column label="操作">
        <el-button type="text">
          查看详情
        </el-button>
      </el-table-column>
    </el-table>

    <el-button
      type="text"
      @click="toDetail"
    >
      查看详情
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chooseForm: {
        name: '',
        type: '',
        status: ''
      }
    };
  },
  methods: {
    toDetail() {
      this.$router.push('/sample-list/1');
    }
  }
};
</script>
