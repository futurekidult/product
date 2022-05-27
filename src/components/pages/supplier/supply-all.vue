<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 筛选条件
    </div>
    <el-form
      label-width="100px"
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
      <span class="line">|</span> 供应商列表
      <el-button
        type="primary"
        class="create"
        @click="toCreate"
      >
        创建供应商
      </el-button>
    </div>

    <el-table border>
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
  </div>
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
    toCreate() {
      this.$router.push('/supplier-create');
    },
    toDetail() {
      this.$router.push('/supplier-list/1');
    }
  }
};
</script>
