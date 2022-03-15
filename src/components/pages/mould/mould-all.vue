<template>
  <el-form
    label-width="80px"
    style="display: flex"
    :model="chooseForm"
  >
    <el-form-item label="模具名称">
      <el-input
        v-model="chooseForm.name"
        placeholder="请输入内容"
      />
    </el-form-item>
    <el-form-item label="创建人">
      <el-input
        v-model="chooseForm.author"
        placeholder="请输入内容"
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

  <el-button type="primary">
    创建模具
  </el-button>
  <el-table>
    <el-table-column label="模具ID" />
    <el-table-column label="模具名称" />
    <el-table-column label="开模工厂名称" />
    <el-table-column label="创建时间" />
    <el-table-column label="创建人" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <el-button @click="toDetail">
        查看详情
      </el-button>
    </el-table-column>
  </el-table>

  <el-button @click="toDetail">
    查看详情
  </el-button>
</template>

<script>
export default {
  data() {
    return {
      chooseForm: {
        name: '',
        author: '',
        status: ''
      }
    };
  },
  methods: {
    toDetail() {
      this.$router.push('/mould-list/1');
    }
  }
};
</script>
