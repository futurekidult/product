<template>
  <base-breadcrumb />

  <div class="border">
    <div class="nav-title todo-title">
      <div><span class="line">|</span> 待办列表</div>

      <div style="display: flex">
        <el-input
          v-model="keyword"
          clearable
        >
          <template #append>
            <el-button
              type="primary"
              @click="getTodoList()"
            >
              搜索
            </el-button>
          </template>
        </el-input>
        <span class="operator">执行人</span>
        <el-tree-select
          v-model="operator"
          :data="memberList"
          clearable
          show-checkbox
          :props="defaultProps"
        />
        <el-button
          type="primary"
          style="margin-left: 12px"
          @click="getTodoList()"
        >
          查询
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </div>
    </div>

    <div v-loading="$store.state.system.todoLoading">
      <el-table
        stripe
        :data="todoList"
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          width="60px"
        />
        <el-table-column
          label="待办名称"
          prop="name"
        />
        <el-table-column
          label="关联新品名称"
          prop="product_name"
        />
        <el-table-column
          label="执行人"
          prop="user_name"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="text"
              @click="showOperatorDialog(scope.row.id, scope.row.user_name)"
            >
              待办转移
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="todoList.length"
        :get-list="getTodoList"
      />
    </div>
  </div>

  <el-dialog
    v-model="operatorVisible"
    width="30%"
    title="待办转移"
  >
    <el-form
      ref="operatorForm"
      :model="operatorForm"
      label-width="130px"
    >
      <el-form-item label="原待办执行人">
        <el-input
          v-model="oldOperator"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="转移后执行人"
        prop="new_user_id"
        :rules="[{ required: true, message: '请选择' }]"
      >
        <el-tree-select
          v-model="operatorForm.new_user_id"
          :data="memberList"
          clearable
          show-checkbox
          :props="defaultProps"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitTransferTodo"
        >
          提交
        </el-button>
      </div>
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
      oldOperator: '',
      keyword: '',
      operator: '',
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      operatorForm: {}
    };
  },
  mounted() {
    this.getTodoList();
    this.getOrganizationList();
  },
  methods: {
    async getTodoList(currentPage = 1, pageSize = 10) {
      this.$store.commit('system/setTodoLoading', true);
      let params = {
        current_page: currentPage,
        page_size: pageSize,
        keyword: this.keyword,
        operator: this.operator
      };
      try {
        await this.$store.dispatch('system/getTodoList', { params });
        this.todoList = this.$store.state.system.todoList;
      } catch (err) {
        return;
      }
    },
    async transferTodo(val) {
      let body = val;
      body['todo_id'] = this.todoId;
      try {
        await this.$store.dispatch('system/transferTodo', body);
        this.operatorVisible = false;
        this.getTodoList();
      } catch (err) {
        return;
      }
    },
    async getOrganizationList() {
      try {
        await this.$store.dispatch('getOrganizationList');
        this.memberList = this.$store.state.organizationList;
        for (let key in this.memberList) {
          this.childrenFunc(this.memberList[key]);
        }
      } catch (err) {
        return;
      }
    },
    childrenFunc(data) {
      if (data.member_list) {
        for (const item of data.member_list) {
          data.children.push(item);
        }
      }
      return data.children;
    },
    showOperatorDialog(id, operator) {
      this.operatorVisible = true;
      this.todoId = id;
      this.oldOperator = operator;
    },
    submitTransferTodo() {
      this.$refs.operatorForm.validate((valid) => {
        if (valid) {
          this.transferTodo(this.operatorForm);
        }
      });
    },
    resetForm() {
      this.keyword = '';
      this.operator = '';
    },
    closeForm() {
      this.operatorVisible = false;
    }
  }
};
</script>

<style scoped>
.operator {
  font-size: 14px;
  width: 120px;
  margin: 0 10px 0 10px;
  padding-top: 5px;
  font-weight: 500;
}
</style>
