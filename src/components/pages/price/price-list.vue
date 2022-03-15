<template>
  <base-breadcrumb />

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
      <el-select v-model="chooseForm.type" />
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

  <el-table>
    <el-table-column lable="定价ID" />
    <el-table-column lable="关联产品名称" />
    <el-table-column lable="关联产品ID">
      <template #default="scope">
        <span>{{ scope.row }}</span>
      </template>
    </el-table-column>
    <el-table-column lable="市场" />
    <el-table-column lable="平台" />
    <el-table-column lable="采购负责人" />
    <el-table-column lable="计划完成时间" />
    <el-table-column lable="首次报价时间" />
    <el-table-column lable="当前已有报价" />
    <el-table-column label="操作">
      <el-button type="text">
        我要报价
      </el-button>
      <el-button type="text">
        报价列表
      </el-button>
    </el-table-column>
  </el-table>

  <el-button @click="ToQuotation">
    报价列表
  </el-button>

  <el-dialog
    v-model="priceDialog"
    title="我要报价"
    width="400px"
  >
    <price-form />
  </el-dialog>
</template>

<script>
import PriceForm from './common/priceForm.vue';

export default {
  components: {
    PriceForm
  },
  data() {
    return {
      chooseForm: {
        name: '',
        type: '',
        status: ''
      },
      priceDialog: false
    };
  },
  methods: {
    ToQuotation() {
      this.$router.push('/quotation-list');
    }
  }
};
</script>
