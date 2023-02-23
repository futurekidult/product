<template>
  <main>
    <el-table
      border
      stripe
      empty-text="无数据"
      :data="data"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        v-if="selectionVisible"
        type="selection"
        width="50"
      />
      <el-table-column
        v-if="indexVisible"
        type="index"
        width="50"
      />
      <el-table-column
        v-for="(column, index) in tableColumn"
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.min_width"
        :fixed="column.fixed"
      >
        <template #default="scope">
          <section
            v-if="column.formatter"
            :class="column.formatter(scope.row, column)"
          >
            {{ column.getSpecialProp && column.getSpecialProp(scope.row) }}
          </section>
          <section v-else-if="column.overdue">
            {{ scope.row[column.prop] }}
            <span
              v-if="scope.row.is_overdue !== 0"
              :class="scope.row.is_overdue !== 0 ? 'overdue' : ''"
            >【{{ scope.row.overdue_desc }}】</span>
          </section>
          <section v-else-if="column.is_operation">
            <slot
              name="operation"
              :row="scope.row"
            />
          </section>
          <section v-else-if="column.is_link">
            <slot
              name="link"
              :row="scope.row"
            />
          </section>
          <section v-else>
            {{ scope.row[column.prop] }}
          </section>
        </template>
      </el-table-column>
      <el-table-column
        v-if="operationVisible"
        label="操作"
        :width="operationWidth"
        fixed="right"
      >
        <template #default="scope">
          <slot :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="paginationVisible">
      <el-pagination
        v-if="total > listPagination.page_size"
        :total="total"
        :page-size="listPagination.page_size"
        :current-page="listPagination.current_page"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </main>
</template>

<script>
export default {
  props: {
    indexVisible: {
      type: Boolean,
      default: false
    },
    selectionVisible: {
      type: Boolean,
      default: false
    },
    tableColumn: {
      type: Array,
      default: null
    },
    tableData: {
      type: Array,
      default: null
    },
    paginationVisible: {
      type: Boolean,
      default: true
    },
    operationVisible: {
      type: Boolean,
      default: true
    },
    length: {
      type: Number,
      default: 0
    },
    pagination: {
      type: Object,
      default: null
    },
    operationWidth: {
      type: Number,
      default: 150
    }
  },
  emits: ['change-pagination'],
  data() {
    return {
      data: this.tableData,
      total: this.length,
      listPagination: this.pagination
    };
  },
  watch: {
    tableData(val) {
      this.data = val;
    },
    length(val) {
      this.total = val;
    },
    pagination(val) {
      this.listPagination = val;
    }
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.listPagination.current_page = currentPage;
      this.$emit('change-pagination', this.listPagination);
    },
    handleSizeChange(pageSize) {
      this.listPagination.page_size = pageSize;
      this.handleCurrentChange(1);
    }
  }
};
</script>
