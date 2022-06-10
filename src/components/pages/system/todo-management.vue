<template>
  <div class="select-title">
    <span class="line">|</span> 待办列表
  </div>

  <el-table
    :data="todoList"
    empty-text="无数据"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column
      label="序号"
      type="index"
      width="60px"
    />
    <el-table-column label="待办名称" />
    <el-table-column label="关联新品名称" />
    <el-table-column label="执行人" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          type="text"
          @click="showOperatorDialog(scope.row.id, scope.row.operator)"
        >
          待办转移
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <base-pagination :length="todoList.length" />

  <el-dialog v-model="operatorVisible">
    <el-form>
      <el-form-item label="原待办执行人" />
      <el-form-item label="转移后执行人" />
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      todoList: [],
      operatorVisible: false,
      todoId: 0,
      operator: ''
    };
  },
  methods: {
    showOperatorDialog(id, operator) {
      this.operatorVisible = true;
      this.todoId = id;
      this.operator = operator;
    }
  }
};
</script>
