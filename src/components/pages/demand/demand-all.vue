<template>
  <el-form
    label-width="80px"
    style="display: flex"
    :model="chooseForm"
  >
    <el-form-item label="需求ID">
      <el-input
        v-model="chooseForm.id"
        clearable
        placeholder="请输入需求id"
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
        placeholder="请选择需求状态"
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

  <el-button
    type="primary"
    class="create-demand"
    @click="toCreate"
  >
    创建需求
  </el-button>

  <el-table :data="getTableList">
    <el-table-column
      prop="demand_id"
      label="需求ID"
    />
    <el-table-column
      prop="demand_name"
      label="产品名称"
    />
    <el-table-column
      prop="product_id"
      label="关联产品ID"
    />
    <el-table-column
      prop="creator"
      label="创建人"
    />
    <el-table-column
      prop="department"
      label="所属部门"
    />
    <el-table-column
      prop="create_time"
      label="提交时间"
    />
    <el-table-column
      prop="create_time"
      label="评审完成时间"
    />
    <el-table-column
      prop="status"
      label="状态"
    />
    <el-table-column label="不通过原因">
      <template #default="scope">
        <div
          class="reason"
          @click="resaonDialog"
        >
          {{ scope.row.reason }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button
        type="text"
        @click="toDetail"
      >
        查看详情
      </el-button>
    </el-table-column>
  </el-table>

  <base-pagination :length="getLength" />

  <el-dialog
    v-model="dialogVisible"
    width="400px"
  >
    <el-form>
      <el-form-item label="不通过原因">
        <el-input type="textarea" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      chooseForm: {
        id: '',
        author: '',
        status: ''
      },
      dialogVisible: false
    };
  },
  computed: {
    getLength() {
      return this.$store.getters['demand/getLength'];
    },
    getTableList() {
      return this.$store.getters['demand/getData'];
    }
  },
  methods: {
    resaonDialog() {
      this.dialogVisible = true;
    },
    toCreate() {
      this.$router.push('/create-demand');
    },
    toDetail() {
      this.$router.push('/demand-list/1');
    }
  }
};
</script>

<style scoped>
.reason {
  cursor: pointer;
  color: #409eff;
}

.create-demand {
  float: right;
}
</style>
