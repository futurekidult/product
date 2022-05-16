<template>
  <el-form
    label-width="80px"
    style="display: flex"
    :model="chooseForm"
  >
    <el-form-item label="供应商名称">
      <el-input
        v-model="chooseForm.id"
        clearable
        placeholder="请输入供应商名称"
      />
    </el-form-item>
    <el-form-item label="创建人">
      <el-input
        v-model="chooseForm.author"
        clearable
        placeholder="请输入创建人"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        v-model="chooseForm.status"
        clearable
        placeholder="请选择"
      >
        <el-option
          label="草稿"
          value="0"
        />
        <el-option
          label="待评审"
          value="1"
        />
        <el-option
          label="评审通过"
          value="2"
        />
        <el-option
          label="评审不通过"
          value="3"
        />
      </el-select>
    </el-form-item>
    <div style="float: right">
      <el-form-item>
        <el-button
          type="primary"
          @click="searchSupplier"
        >
          查询
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </el-form-item>
    </div>
  </el-form>

  <el-button
    type="primary"
    @click="toCreate"
  >
    创建供应商
  </el-button>

  <el-table>
    <el-table-column label="供应商ID" />
    <el-table-column label="供应商名称" />
    <el-table-column label="营业执照注册号" />
    <el-table-column label="货源地" />
    <el-table-column label="创建时间" />
    <el-table-column label="审批完成时间" />
    <el-table-column label="创建人" />
    <el-table-column label="状态" />
    <el-table-column label="操作" />
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
        id: '',
        author: '',
        status: ''
      }
    };
  },
  methods: {
    searchSupplier() {
      console.log(this.chooseForm);
    },
    resetForm() {
      this.chooseForm = {};
    },
    toCreate() {
      this.$router.push('/supplier-create');
    },
    toDetail() {
      this.$router.push('/supplier-list/1');
    }
  }
};
</script>
