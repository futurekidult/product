<template>
  <div>
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 筛选条件
      </div>

      <div class="select-item">
        <el-form
          label-width="80px"
          style="display: flex"
          :model="chooseForm"
        >
          <el-form-item label="产品名称">
            <el-input
              v-model="chooseForm.name"
              clearable
              placeholder="请输入产品名称"
              @keyup.enter.native="searchDemand"
              @clear="searchDemand"
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-tree-select
              v-model="chooseForm.creator_id"
              :data="memberList"
              clearable
              filterable
              :props="defaultProps"
              @change="searchDemand"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择需求状态"
              @change="searchDemand"
            >
              <el-option
                v-for="item in demandState"
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
      v-loading="$store.state.demand.demandLoading"
      class="border"
    >
      <div class="select-title demand-title">
        <div>
          <span class="line">|</span> 需求列表
          <text-btn @handle-click="toDraft">
            我的草稿
          </text-btn>
        </div>
        <el-button
          type="primary"
          class="create"
          :disabled="getPrivilege"
          @click="toCreate"
        >
          创建需求
        </el-button>
      </div>
      <base-table
        :table-data="demandList"
        :pagination="pagination"
        :operation-width="170"
        :length="$store.state.demand.demandListLength"
        :table-column="$global.demandTableColumn"
        @change-pagination="changePagination"
      >
        <template #link="linkProps">
          <text-btn @handle-click="toProductDetail(linkProps.row.product_id)">
            {{ linkProps.row.product_id }}
          </text-btn>
        </template>
        <template #operation="operationProps">
          <div
            v-if="operationProps.row.state === 40"
            class="reason"
            @click="reasonDialog(operationProps.row.review_failed_reason)"
          >
            查看原因
          </div>
        </template>
        <template #default="slotProps">
          <text-btn @handle-click="toDetail(slotProps.row.id)">
            查看详情
          </text-btn>
          <span
            v-if="slotProps.row.state === 20"
            class="table-btn"
          >|</span>
          <text-btn
            v-if="slotProps.row.state === 20"
            @handle-click="toReview(slotProps.row.id)"
          >
            需求评审
          </text-btn>
        </template>
      </base-table>
    </div>

    <el-dialog
      v-model="reasonFormVisible"
      width="400px"
      title="查看内容"
      :close-on-click-modal="false"
    >
      <el-form :model="reasonForm">
        <el-form-item label="不通过原因">
          <el-input
            v-model="reasonForm.content"
            type="textarea"
            :rows="6"
            disabled
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatterTime, getOrganizationList } from '../../../utils';
import { getDemandDetail } from '../../../utils/demand';

export default {
  data() {
    return {
      chooseForm: {},
      reasonFormVisible: false,
      demandList: [],
      reasonForm: {},
      demandState: [],
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      pagination: JSON.parse(JSON.stringify(this.$global.pagination)),
      show: true
    };
  },
  computed: {
    getPrivilege() {
      let group = JSON.parse(localStorage.getItem('center_group'));
      let flag = group.indexOf(100) > -1;
      let length = group.length === 1;
      return flag && length;
    }
  },
  mounted() {
    this.getDemandList();
    this.getParams();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        this.demandState = JSON.parse(
          localStorage.getItem('params')
        ).demand.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    },
    async getDemandList() {
      this.$store.commit('demand/setDemandLoading', true);
      let params = this.chooseForm;
      params['current_page'] = this.pagination.current_page;
      params['page_size'] = this.pagination.page_size;
      try {
        await this.$store.dispatch('demand/getDemandList', {
          params
        });
        this.demandList = this.$store.state.demand.demandList;
        this.demandList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.review_finish_time = formatterTime(item.review_finish_time);
        });
      } catch (err) {
        this.$store.commit('demand/setDemandLoading', false);
        return;
      }
    },
    async getReason(id) {
      try {
        await this.$store.dispatch('demand/getReasonText', { params: { id } });
        this.reasonForm.content = this.$store.state.demand.reasonText;
      } catch (err) {
        return;
      }
    },
    reasonDialog(id) {
      this.reasonFormVisible = true;
      this.getReason(id);
    },
    toCreate() {
      this.$router.push('/create-demand');
    },
    toDetail(id) {
      getDemandDetail(id, 'detail');
    },
    toProductDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.pagination.page_size = 10;
      this.searchDemand();
    },
    searchDemand() {
      this.pagination.current_page = 1;
      this.getDemandList();
    },
    toDraft() {
      this.$router.push('/draft-list');
    },
    async toReview(id) {
      getDemandDetail(id, 'review');
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getDemandList();
    }
  }
};
</script>

<style scoped>
.reason {
  color: #409eff;
}
</style>
