<template>
  <div v-loading="$store.state.product.mouldLoading">
    <div class="member-item">
      <div class="select-title">
        <span class="line">|</span> 模具信息
      </div>
      <el-button
        type="primary"
        @click="showMouldSelectedForm"
      >
        选择模具
      </el-button>
    </div>
    <base-table
      :table-data="mouldList"
      :pagination="pagination"
      :operation-width="150"
      :length="$store.state.product.mouldListLength"
      :table-column="tableColumn"
      @change-pagination="changePagination"
    >
      <template #default="scope">
        <text-btn @handle-click="showDeleteDialog(scope.row.id)">
          删除
        </text-btn>
        <span class="table-btn">|</span>
        <text-btn @handle-click="toDetail(scope.row.mould_id)">
          查看
        </text-btn>
      </template>
    </base-table>

    <el-dialog
      v-model="deleteDialog"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        确认要删除该模具吗
      </div>
      <div style="text-align: center">
        <el-button
          class="mould-btn"
          @click="closeDeleteDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="mould-btn"
          @click="deleteMould"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="mouldSelectedVisible"
      title="选择模具"
      width="50%"
      :close-on-click-modal="false"
    >
      <base-table
        :table-data="allMouldList"
        :pagination="AllMouldPagination"
        :length="$store.state.product.selectedMouldListLength"
        :table-column="AllMouldTableColumn"
        :operation-visible="false"
        :selection-visible="true"
        @change-pagination="changeAllMouldPagination"
        @handle-selection="handleSelectionChange"
      />
      <el-divider style="margin: 68px 0px 20px" />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeMouldSelectedForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitResult"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changeTimestamp, resetPagination } from '../../../../utils';

export default {
  inject: ['getMould'],
  props: ['mouldList', 'mouldPagination'],
  emits: ['change-page', 'change-size'],
  data() {
    return {
      mouldSelectedVisible: false,
      multipleSelection: [],
      mouldIds: [],
      deleteDialog: false,
      mouldId: 0,
      allMouldList: [],
      pagination: this.mouldPagination,
      AllMouldPagination: JSON.parse(JSON.stringify(this.$global.pagination)),
      commonTableColumn: [
        {
          prop: 'name',
          label: '模具名称',
          min_width: 150,
          fixed: 'left'
        },
        { prop: 'mould_factory', label: '开模工厂', min_width: '150' },
        { prop: 'create_time', label: '创建时间', width: 200 },
        { prop: 'creator', label: '创建人' }
      ]
    };
  },
  computed: {
    tableColumn() {
      return [
        { prop: 'mould_id', label: '模具ID', width: 100, fixed: 'left' }
      ].concat(this.commonTableColumn);
    },
    AllMouldTableColumn() {
      return [
        { prop: 'id', label: '模具ID', width: 100, fixed: 'left' }
      ].concat(this.commonTableColumn);
    }
  },
  watch: {
    mouldPagination(val) {
      this.pagination = val;
    }
  },
  methods: {
    async getAllMouldList() {
      let params = this.AllMouldPagination;
      try {
        await this.$store.dispatch('product/getSelectedMouldList', { params });
        this.allMouldList = this.$store.state.product.selectedMouldList;
        this.allMouldList.forEach((item) => {
          changeTimestamp(item, 'create_time');
        });
        this.mouldSelectedVisible = true;
      } catch (err) {
        return;
      }
    },
    showMouldSelectedForm() {
      resetPagination(this.AllMouldPagination, 1, 10);
      this.getAllMouldList();
    },
    closeMouldSelectedForm() {
      this.mouldSelectedVisible = false;
    },
    handleSelectionChange(ids) {
      this.mouldIds = ids.map((item) => {
        return item.id;
      });
    },
    async submitResult() {
      let body = {
        product_id: +this.$route.params.productId,
        mould_id: this.mouldIds
      };
      try {
        await this.$store.dispatch('product/createMould', body);
        this.mouldSelectedVisible = false;
        this.getMould();
      } catch (err) {
        return;
      }
    },
    async deleteMould() {
      try {
        await this.$store.dispatch('product/deleteMould', {
          relation_id: this.mouldId
        });
        this.deleteDialog = false;
        this.getMould();
      } catch (err) {
        return;
      }
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
    showDeleteDialog(id) {
      this.deleteDialog = true;
      this.mouldId = id;
    },
    toDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/mould-list') > -1) {
        this.$router.push(`/mould-list/${id}`);
        this.$store.commit('setActiveTab', 'design');
      } else {
        this.$message.error('无权限访问');
      }
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.$emit('change-page', this.pagination);
    },
    changeAllMouldPagination(pagination) {
      this.AllMouldPagination = pagination;
      this.getAllMouldList();
    }
  }
};
</script>
