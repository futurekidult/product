<template>
  <div>
    <div class="border">
      <base-table
        :table-data="draftList"
        :pagination="pagination"
        :length="$store.state.demand.draftListLength"
        :table-column="draftTableColumn"
        @change-pagination="changePagination"
      >
        <template #link="linkProps">
          <text-btn @handle-click="toDemand(linkProps.row.demand_id)">
            {{ linkProps.row.demand_id }}
          </text-btn>
        </template>
        <template #default="slotProps">
          <text-btn @handle-click="toForm(slotProps.row.id)">
            编辑
          </text-btn>
          <span class="table-btn">|</span>
          <text-btn @handle-click="showDeleteDraftItem(slotProps.row.id)">
            删除
          </text-btn>
        </template>
      </base-table>
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
      draftList: [],
      deleteDialogVisible: false,
      draftTableColumn: [
        { prop: 'id', label: '需求ID', width: 100, fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'create_time', label: '创建时间', width: 200 },
        { prop: 'state_desc', label: '状态', width: 100, fixed: 'right' }
      ],
      pagination: JSON.parse(JSON.stringify(this.$global.pagination))
    };
  },
  mounted() {
    this.getDraftList();
  },
  methods: {
    async getDraftList() {
      let params = this.pagination;
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
    showDeleteDraftItem(id) {
      this.deleteId = id;
      this.deleteDialogVisible = true;
    },
    closeDeleteDraftItem() {
      this.deleteDialogVisible = false;
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getDraftList();
    }
  }
};
</script>
