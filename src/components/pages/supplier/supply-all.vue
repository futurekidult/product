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
              @clear="getSupplierList()"
            />
          </el-form-item>
          <el-form-item label="采购员">
            <el-input
              v-model="chooseForm.purchase_specialist"
              clearable
              placeholder="请输入采购员"
              @clear="getSupplierList()"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择"
              @clear="getSupplierList()"
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
            type="primary"
            @click="getSupplierList"
          >
            查询
          </el-button>
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
          <el-button
            type="text"
            @click="toBlackList"
          >
            查看黑名单
          </el-button>
        </div>
        <el-button
          type="primary"
          class="create"
          @click="toCreate"
        >
          创建供应商
        </el-button>
      </div>

      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="supplierList"
      >
        <el-table-column
          label="供应商ID"
          prop="id"
          width="100px"
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
          width="200px"
        />
        <el-table-column
          label="审批完成时间"
          prop="approval_time"
          width="200px"
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
            <div style="display: flex">
              <el-button
                type="text"
                @click="toDetail(scope.row.id)"
              >
                查看
              </el-button>
              <div v-if="scope.row.state === 10">
                <span class="table-btn">|</span>
                <el-button
                  type="text"
                  @click="deleteSupplier(scope.row.id)"
                >
                  删除
                </el-button>
                <span class="table-btn">|</span>
                <el-button
                  type="text"
                  @click="toDetail(scope.row.id)"
                >
                  供应商审批
                </el-button>
              </div>
              <div
                v-else
                style="display: flex"
              >
                <div v-if="scope.row.state === 30">
                  <span class="table-btn">|</span>
                  <el-button
                    type="text"
                    @click="toUpdate(scope.row.id)"
                  >
                    编辑
                  </el-button>
                </div>
                <div>
                  <span class="table-btn">|</span>
                  <el-button
                    type="text"
                    @click="showBlackDialog(scope.row.id)"
                  >
                    加入黑名单
                  </el-button>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="40"
        :get-list="getSupplierList"
      />
    </div>
  </div>

  <confirm-dialog
    v-if="blackDialogVisible"
    :id="supplierBlackId"
    :dialog-visible="blackDialogVisible"
    type="black"
    :get-list="getSupplierList"
    @hide-dialog="closeBlackDialog"
  />
</template>

<script>
import { formatterTime } from '../../../utils';
import ConfirmDialog from './common/confirm-dialog.vue';

export default {
  components: {
    ConfirmDialog
  },
  data() {
    return {
      chooseForm: {},
      supplierList: [],
      supplierState: [],
      blackDialogVisible: false,
      supplierBlackId: 0
    };
  },
  mounted() {
    this.getState();
    this.getSupplierList();
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
    async getSupplierList(currentPage = 1, pageSize = 10) {
      this.$store.commit('supplier/setSupplierLoading', true);
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
      try {
        await this.$store.dispatch('supplier/getSupplierList', { params });
        this.supplierList = this.$store.state.supplier.supplierList;
        this.supplierList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.approval_time = formatterTime(item.approval_time);
        });
      } catch (err) {
        return;
      }
    },
    toCreate() {
      this.$router.push('/supplier-create');
    },
    toUpdate(id) {
      this.$store.commit('supplier/setSupplierDetailLoading', true);
      this.$router.push(`/supplist-list/supplier-update/${id}`);
    },
    toDetail(id) {
      this.$store.commit('supplier/setSupplierDetailLoading', true);
      this.$router.push(`/supplier-list/${id}`);
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
    resetForm() {
      this.chooseForm = {};
      this.getSupplierList();
    },
    async deleteSupplier(id) {
      try {
        await this.$store.dispatch('supplier/deleteSupplier', {
          id
        });
        this.getSupplierList();
      } catch (err) {
        return;
      }
    },
    toBlackList() {
      this.$store.commit('supplier/setBlackLoading', true);
      this.$router.push('/black-list');
    },
    showBlackDialog(id) {
      this.blackDialogVisible = true;
      this.supplierBlackId = id;
    },
    closeBlackDialog() {
      this.blackDialogVisible = false;
    }
  }
};
</script>
