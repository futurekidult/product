<template>
  <div>
    <div class="border">
      <el-table
        border
        stripe
        empty-text="无数据"
        :data="draftList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          fixed
          label="需求ID"
          prop="id"
          width="100"
        />
        <el-table-column
          fixed
          label="产品名称"
          prop="name"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
          width="200"
        />
        <el-table-column
          label="状态"
          prop="state_desc"
          width="100"
          fixed="right"
        />
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template #default="scope">
            <text-btn @handle-click="toForm(scope.row.id)">
              编辑
            </text-btn>
            <span class="table-btn">|</span>
            <text-btn @handle-click="showDeleteDraftItem(scope.row.id)">
              删除
            </text-btn>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        v-if="$store.state.demand.draftListLength > pageSize"
        :length="$store.state.demand.draftListLength"
        :current-page="currentPage"
        :page-num="pageSize"
        @change-size="changePageSize"
        @change-page="changeCurrentPage"
      />
    </div>

    <confirm-dialog
      v-if="deleteDialogVisible"
      :id="deleteId"
      :dialog-visible="deleteDialogVisible"
      dialog-content="是否确认删除该草稿"
      type="draft delete"
      :get-list="getDraftList"
      :close-on-click-modal="false"
      @hide-dialog="closeDeleteDraftItem"
    />
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';
import { getDemandDetail } from '../../../utils/demand';

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      draftList: [],
      deleteDialogVisible: false
    };
  },
  mounted() {
    this.getDraftList();
  },
  methods: {
    async getDraftList() {
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize
      };
      try {
        await this.$store.dispatch('demand/getDraftList', { params });
        this.draftList = this.$store.state.demand.draftList;
        this.draftList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
        });
      } catch (err) {
        return;
      }
    },
    toForm(id) {
      getDemandDetail(id, 'edit');
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDraftList();
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getDraftList();
    },
    showDeleteDraftItem(id) {
      this.deleteId = id;
      this.deleteDialogVisible = true;
    },
    closeDeleteDraftItem() {
      this.deleteDialogVisible = false;
    }
  }
};
</script>
