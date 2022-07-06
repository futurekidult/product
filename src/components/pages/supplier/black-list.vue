<template>
  <base-breadcrumb />

  <div
    v-loading="$store.state.supplier.blackLoading"
    class="border"
  >
    <div class="select-title">
      <span class="line">|</span> 黑名单
    </div>

    <el-table
      border
      stripe
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="blackList"
    >
      <el-table-column
        label="供应商ID"
        prop="id"
      />
      <el-table-column
        label="供应商名称"
        prop="name"
      />
      <el-table-column
        label="供应商类型"
        prop="type"
      />
      <el-table-column
        label="合作等级"
        prop="cooperation_level"
      />
      <el-table-column
        label="采购员"
        prop="purchase_specialist"
      />
      <el-table-column
        label="创建时间"
        prop="create_time"
      />
      <el-table-column
        label="审批完成时间"
        prop="approval_time"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250px"
      >
        <template #default="scope">
          <el-button
            type="text"
            @click="toDetail(scope.row.id)"
          >
            查看
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            type="text"
            @click="showWhiteDialog(scope.row.id)"
          >
            加入白名单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="$store.state.supplier.blackListLength"
      :get-list="getBlackList"
    />
  </div>

  <confirm-dialog
    v-if="whiteDialogVisible"
    :id="supplierWhiteId"
    :dialog-visible="whiteDialogVisible"
    type="white"
    :get-list="getBlackList"
    @hide-dialog="closeWhiteDialog"
  />
</template>

<script>
import { formatterTime } from '../../../utils';
import ConfirmDialog from './common/confirm-dialog.vue';
export default {
  components: {
    ConfirmDialog
  },
  provide() {
    return {
      getBlack: this.getBlackList
    };
  },
  data() {
    return {
      blackList: [],
      whiteDialogVisible: false,
      supplierWhiteId: 0
    };
  },
  mounted() {
    this.getBlackList();
  },
  methods: {
    async getBlackList(currentPage = 1, pageSize = 10) {
      this.$store.commit('supplier/setBlackLoading', true);
      let params = {
        current_page: currentPage,
        page_size: pageSize
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
    changeColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else if (val === 20) {
        return 'result-fail';
      } else {
        return 'result-pass';
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
    }
  }
};
</script>
