<template>
  <div class="border">
    <div class="select-title todo-title">
      <div><span class="line">|</span> 待办列表</div>
      <div style="display: flex">
        <el-input
          v-model="keyword"
          placeholder="输入要搜索的内容"
          style="width: 50%"
          clearable
        >
          <template #append>
            <el-button type="primary">
              <span>搜索</span>
            </el-button>
          </template>
        </el-input>
        <el-select
          v-model="state"
          placeholder="请选择"
          style="margin-left: 15px; width: 50%"
          clearable
        />
      </div>
    </div>
    <el-table
      :data="todoList"
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        prop="id"
        label="序号"
      />
      <el-table-column
        label="待办名称"
        width="600px"
      >
        <template #default="scope">
          {{ scope.row.name }}
          <span
            v-if="scope.row.is_overdue !== 0"
            :class="scope.row.is_overdue !== 0 ? 'overdue' : ''"
          >【{{ scope.row.overdue_desc }}】</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="接收时间"
      />
      <el-table-column
        prop="finish_time"
        label="完成时间"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="text">
          查看详情
        </el-button>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="20"
      :get-list="getList"
    />
  </div>
</template>

<script>
export default {
  props: ['todoList', 'getList'],
  emits: ['search'],
  data() {
    return {
      state: '',
      keyword: ''
    };
  },
  methods: {
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 30) {
        return 'result-fail';
      } else {
        return 'result-pass';
      }
    }
  }
};
</script>

<style scoped>
.todo-title {
  display: flex;
  justify-content: space-between;
}
</style>
