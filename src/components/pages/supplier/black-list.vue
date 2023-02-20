<template>
  <section>
    <div
      v-loading="$store.state.supplier.blackLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 黑名单
      </div>

      <base-table
        :table-column="$global.supplierTableColumn"
        :table-data="blackList"
        :pagination="blackListPagination"
        :length="$store.state.supplier.blackListLength"
        @change-pagination="changeBlackListPagination"
      >
        <template #default="slotProps">
          <text-btn @handle-click="toDetail(slotProps.row.id)">
            查看
          </text-btn>
          <span class="table-btn">|</span>
          <text-btn @handle-click="showWhiteDialog(slotProps.row.id)">
            加入白名单
          </text-btn>
        </template>
      </base-table>
    </div>

    <confirm-dialog
      v-if="whiteDialogVisible"
      :id="supplierWhiteId"
      :dialog-visible="whiteDialogVisible"
      dialog-content="确定将该供应商移除黑名单"
      type="black delete"
      :get-list="getBlackList"
      :close-on-click-modal="false"
      @hide-dialog="closeWhiteDialog"
    />
  </section>
</template>

<script>
import { formatterTime } from '../../../utils';
export default {
  provide() {
    return {
      getBlack: this.getBlackList
    };
  },
  data() {
    return {
      blackList: [],
      whiteDialogVisible: false,
      supplierWhiteId: 0,
      blackListPagination: {
        current_page: 1,
        page_size: 10
      }
    };
  },
  mounted() {
    this.getBlackList();
  },
  methods: {
    async getBlackList() {
      this.$store.commit('supplier/setBlackLoading', true);
      let params = {
        current_page: this.blackListPagination.current_page,
        page_size: this.blackListPagination.page_size
      };
      try {
        await this.$store.dispatch('supplier/getBlackList', { params });
        this.blackList = this.$store.state.supplier.blackList;
        this.blackList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.approval_time = formatterTime(item.approval_time);
        });
      } catch (err) {
        this.$store.commit('supplier/setBlackLoading', false);
        return;
      }
    },
    showWhiteDialog(id) {
      this.whiteDialogVisible = true;
      this.supplierWhiteId = id;
    },
    closeWhiteDialog() {
      this.whiteDialogVisible = false;
    },
    toDetail(id) {
      this.$router.push(`/supplier-list/${id}`);
    },
    changeBlackListPagination(pagination) {
      this.blackListPagination = pagination;
      this.getBlackList();
    }
  }
};
</script>
