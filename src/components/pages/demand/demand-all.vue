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
              @clear="searchDemand"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择需求状态"
              @clear="searchDemand"
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
            type="primary"
            @click="searchDemand"
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
      v-loading="$store.state.demand.demandLoading"
      class="border"
    >
      <div class="select-title demand-title">
        <div>
          <span class="line">|</span> 需求列表
          <el-button
            type="text"
            @click="toDraft"
          >
            我的草稿
          </el-button>
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
      <el-table
        border
        stripe
        empty-text="无数据"
        :data="demandList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          fixed
          prop="id"
          label="需求ID"
          width="100"
        />
        <el-table-column
          fixed
          prop="name"
          label="产品名称"
          min-width="150"
        />
        <el-table-column
          fixed
          label="关联产品ID"
          width="110"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="toProductDetail(scope.row.product_id)"
            >
              {{ scope.row.product_id }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="creator_desc"
          label="创建人"
        />
        <el-table-column
          prop="ding_dept_desc"
          label="所属部门"
          min-width="150"
        />
        <el-table-column
          prop="create_time"
          label="提交时间"
          width="200"
        />
        <el-table-column
          prop="review_finish_time"
          label="评审完成时间"
          width="200"
        />
        <el-table-column
          label="状态"
          width="100"
        >
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="不通过原因"
          width="100"
        >
          <template #default="scope">
            <div
              v-if="scope.row.state === 40"
              class="reason"
              @click="reasonDialog(scope.row.review_failed_reason)"
            >
              查看原因
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="170"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="toDetail(scope.row.id)"
            >
              查看详情
            </el-button>
            <span
              v-if="scope.row.state === 20"
              class="table-btn"
            >|</span>
            <el-button
              v-if="scope.row.state === 20"
              type="text"
              @click="toReview(scope.row.id)"
            >
              需求评审
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="$store.state.demand.demandListLength"
        :current-page="currentPage"
        :page-num="pageSize"
        @change-size="changePageSize"
        @change-page="changeCurrentPage"
      />
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
      currentPage: 1,
      pageSize: 10,
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
      params['current_page'] = this.currentPage;
      params['page_size'] = this.pageSize;
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
      this.pageSize = 10;
      this.searchDemand();
    },
    changeCellColor(val) {
      if (val === 20) {
        return 'result-ing';
      } else if (val === 30) {
        return 'result-pass';
      } else if (val === 40) {
        return 'result-fail';
      } else {
        return '';
      }
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getDemandList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getDemandList();
    },
    searchDemand() {
      this.currentPage = 1;
      this.getDemandList();
    },
    toDraft() {
      this.$router.push('/draft-list');
    },
    async toReview(id) {
      getDemandDetail(id, 'review');
    }
  }
};
</script>

<style scoped>
.reason {
  cursor: pointer;
  color: #409eff;
}
</style>
