<template>
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
    <el-form-item label="品类">
      <el-select
        v-model="chooseForm.type"
        placeholder="请选择"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="chooseForm.status" />
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

  <el-table
    border
    empty-text="无数据"
  >
    <el-table-column label="产品ID" />
    <el-table-column label="产品名称" />
    <el-table-column label="关联需求ID" />
    <el-table-column label="品类" />
    <el-table-column label="产品定位" />
    <el-table-column label="项目管理员" />
    <el-table-column label="创建时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <el-button type="text">
        编辑
      </el-button>
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
      this.$router.push('/product-list/1');
    }
  }
};
</script>
