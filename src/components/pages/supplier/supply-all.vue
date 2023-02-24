<template>
  <div>
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 筛选条件
      </div>
      <div class="select-item">
        <el-form
          label-width="100px"
          style="display: flex"
          :model="chooseForm"
        >
          <el-form-item label="供应商名称">
            <el-input
              v-model="chooseForm.name"
              clearable
              placeholder="请输入供应商名称"
              @keyup.enter.native="searchSupplier"
              @clear="searchSupplier"
            />
          </el-form-item>
          <el-form-item label="采购员">
            <el-tree-select
              v-model="chooseForm.purchase_specialist_id"
              :data="memberList"
              clearable
              filterable
              :props="defaultProps"
              @change="searchSupplier"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择"
              @change="searchSupplier"
            >
              <el-option
                v-for="item in supplierState"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            class="close-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div
      v-loading="$store.state.supplier.supplierLoading"
      class="border"
    >
      <div class="select-title supplier-item">
        <div>
          <span class="line">|</span> 供应商列表
          <text-btn @handle-click="toBlackList">
            查看黑名单
          </text-btn>
        </div>
        <el-button
          type="primary"
          class="create"
          @click="toCreate"
        >
          创建供应商
        </el-button>
      </div>

      <base-table
        :table-column="$global.supplierTableColumn"
        :table-data="supplierList"
        :pagination="pagination"
        :length="$store.state.supplier.supplierListLength"
        @change-pagination="changeSupplierPagination"
      >
        <template #default="slotProps">
          <div style="display: flex">
            <text-btn @handle-click="toDetail(slotProps.row.id, 'view')">
              查看
            </text-btn>
            <div v-if="slotProps.row.state === 10">
              <span class="table-btn">|</span>
              <text-btn @handle-click="showDeleteDialog(slotProps.row.id)">
                删除
              </text-btn>
              <span class="table-btn">|</span>
              <text-btn @handle-click="toDetail(slotProps.row.id, 'approval')">
                供应商审批
              </text-btn>
            </div>
            <div
              v-else
              style="display: flex"
            >
              <div v-if="slotProps.row.state === 30">
                <span class="table-btn">|</span>
                <text-btn @handle-click="toUpdate(slotProps.row.id)">
                  编辑
                </text-btn>
              </div>
              <div>
                <span class="table-btn">|</span>
                <text-btn @handle-click="showBlackDialog(slotProps.row.id)">
                  加入黑名单
                </text-btn>
              </div>
            </div>
          </div>
        </template>
      </base-table>
    </div>

    <confirm-dialog
      v-if="blackDialogVisible"
      :id="supplierBlackId"
      :dialog-visible="blackDialogVisible"
      dialog-content="确定将该供应商加入黑名单"
      type="black enter"
      :get-list="getSupplierList"
      :close-on-click-modal="false"
      @hide-dialog="closeBlackDialog"
    />

    <el-dialog
      v-model="deleteDialogVisible"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        是否删除该供应商
      </div>
      <div style="text-align: center">
        <el-button
          class="close-btn"
          @click="closeDeleteDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="deleteSupplier"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatterTime, getOrganizationList } from '../../../utils';

export default {
  data() {
    return {
      chooseForm: {},
      supplierList: [],
      supplierState: [],
      blackDialogVisible: false,
      supplierBlackId: 0,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      pagination: JSON.parse(JSON.stringify(this.$global.pagination)),
      deleteDialogVisible: false,
      deleteId: 0
    };
  },
  mounted() {
    this.getState();
    this.getSupplierList();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    async getState() {
      if (localStorage.getItem('params')) {
        this.supplierState = JSON.parse(
          localStorage.getItem('params')
        ).supplier.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getState();
        } catch (err) {
          return;
        }
      }
    },
    async getSupplierList() {
      this.$store.commit('supplier/setSupplierLoading', true);
      let params = { ...this.chooseForm, ...this.pagination };
      try {
        await this.$store.dispatch('supplier/getSupplierList', { params });
        this.supplierList = this.$store.state.supplier.supplierList;
        this.supplierList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.approval_time = formatterTime(item.approval_time);
        });
      } catch (err) {
        this.$store.commit('supplier/setSupplierLoading', false);
        return;
      }
    },
    toCreate() {
      this.$router.push('/supplier-create');
    },
    toUpdate(id) {
      this.$router.push(`/supplier-list/supplier-update/${id}`);
    },
    toDetail(id, type) {
      this.$router.push(`/supplier-list/${id}`);
      this.$store.commit('supplier/setActionType', type);
    },
    resetForm() {
      this.chooseForm = {};
      this.pagination.page_size = 10;
      this.searchSupplier();
    },
    showDeleteDialog(id) {
      this.deleteDialogVisible = true;
      this.deleteId = id;
    },
    closeDeleteDialog() {
      this.deleteDialogVisible = false;
    },
    async deleteSupplier() {
      try {
        await this.$store.dispatch('supplier/deleteSupplier', {
          id: this.deleteId
        });
        this.deleteDialogVisible = false;
        this.getSupplierList();
      } catch (err) {
        return;
      }
    },
    toBlackList() {
      this.$router.push('/black-list');
    },
    showBlackDialog(id) {
      this.blackDialogVisible = true;
      this.supplierBlackId = id;
    },
    closeBlackDialog() {
      this.blackDialogVisible = false;
    },
    changeSupplierPagination(pagination) {
      this.pagination = pagination;
      this.getSupplierList();
    },
    searchSupplier() {
      this.pagination.current_page = 1;
      this.getSupplierList();
    }
  }
};
</script>
