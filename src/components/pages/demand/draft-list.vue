<template>
  <div>
    <base-breadcrumb />

    <div class="border">
      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          textAlign: 'center'
        }"
        :data="draftList"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column
          label="需求ID"
          prop="id"
          width="80px"
        />
        <el-table-column
          label="产品名称"
          prop="name"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
        />
        <el-table-column
          label="状态"
          prop="state_desc"
          width="200px"
        />
        <el-table-column
          label="操作"
          width="200px"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="toForm(scope.row.id)"
            >
              编辑
            </el-button>
            <span class="table-btn">|</span>
            <el-button
              type="text"
              @click="showDeleteDraftItem(scope.row.id)"
            >
              删除
            </el-button>
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
