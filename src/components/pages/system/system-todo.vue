<template>
  <section>
    <div class="border">
      <div class="nav-title todo-title">
        <div><span class="line">|</span> 待办列表</div>
        <div style="display: flex">
          <el-input
            v-model="keyword"
            placeholder="待办名称搜索"
            clearable
            class="icon-click"
            @clear="searchTodo"
          >
            <template #append>
              <el-icon @click="searchTodo">
                <Search />
              </el-icon>
            </template>
          </el-input>
          <span class="operator">执行人</span>
          <el-tree-select
            v-model="operator"
            :data="memberList"
            clearable
            filterable
            :props="defaultProps"
            @clear="searchTodo"
          />
          <el-button
            type="primary"
            style="margin-left: 12px"
            @click="searchTodo"
          >
            查询
          </el-button>
          <el-button @click="resetForm">
            重置
          </el-button>
        </div>
      </div>
      <base-table
        v-loading="$store.state.system.todoLoading"
        :table-data="todoList"
        :pagination="pagination"
        :length="$store.state.system.todoListLength"
        :table-column="tableColumn"
        @change-pagination="changePagination"
      >
        <template #default="slotProps">
          <text-btn
            @handle-click="
              showOperatorDialog(slotProps.row.id, slotProps.row.user_name)
            "
          >
            待办转移
          </text-btn>
        </template>
      </base-table>
    </div>
    <el-dialog
      v-model="operatorVisible"
      width="30%"
      title="待办转移"
      :close-on-click-modal="false"
      @close="closeForm"
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
            filterable
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
  </section>
</template>

<script>
import { getOrganizationList, formatterTime } from '../../../utils';
import { Search } from '@element-plus/icons-vue';

export default {
  components: {
    Search
  },
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
        label: 'name',
        disabled: 'disabled'
      },
      operatorForm: {},
      tableColumn: [
        { prop: 'id', label: '待办ID', width: 80, fixed: 'left' },
        {
          prop: 'name',
          label: '待办名称',
          fixed: 'left'
        },
        { prop: 'create_time', label: '接收时间', width: 200 },
        { prop: 'user_name', label: '执行人', width: 150 }
      ],
      pagination: {
        current_page: 1,
        page_size: 10
      }
    };
  },
  mounted() {
    this.getTodoList(this.pagination);
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    async getTodoList(pagination) {
      this.$store.commit('system/setTodoLoading', true);
      let params = {
        current_page: pagination.current_page,
        page_size: pagination.page_size,
        keyword: this.keyword,
        operator: this.operator
      };
      try {
        await this.$store.dispatch('system/getTodoList', { params });
        this.todoList = this.$store.state.system.todoList;
        this.todoList.map((item) => {
          item.create_time = formatterTime(item.create_time);
        });
      } catch (err) {
        this.$store.commit('system/setTodoLoading', false);
        return;
      }
    },
    async transferTodo(val) {
      let body = { ...val, todo_id: this.todoId };
      try {
        await this.$store.dispatch('system/transferTodo', body);
        this.operatorVisible = false;
        this.$refs.operatorForm.resetFields();
        this.getTodoList(this.pagination);
      } catch (err) {
        return;
      }
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
      this.pagination.page_size = 10;
      this.searchTodo();
    },
    closeForm() {
      this.$refs.operatorForm.resetFields();
      this.operatorVisible = false;
    },
    searchTodo() {
      this.pagination.current_page = 1;
      this.getTodoList(this.pagination);
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getTodoList(this.pagination);
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
