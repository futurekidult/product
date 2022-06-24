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
              @clear="getDemandList()"
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input
              v-model="chooseForm.creator_id"
              clearable
              placeholder="请输入创建人"
              @clear="getDemandList()"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择需求状态"
              @clear="getDemandList()"
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
            @click="getDemandList()"
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
      <div class="select-title">
        <span class="line">|</span> 需求列表
        <el-button
          type="primary"
          class="create"
          @click="toCreate"
        >
          创建需求
        </el-button>
      </div>
      <el-table
        :data="demandList"
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          prop="id"
          label="需求ID"
          width="80px"
        />
        <el-table-column
          prop="name"
          label="产品名称"
        />
        <el-table-column label="关联产品ID">
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
        />
        <el-table-column
          prop="create_time"
          label="提交时间"
          width="200px"
        />
        <el-table-column
          prop="review_finish_time"
          label="评审完成时间"
          width="200px"
        />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="不通过原因">
          <template #default="scope">
            <div
              v-if="scope.row.state === 40"
              class="reason"
              @click="reasonDialog(scope.row.failed_reason)"
            >
              查看原因
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.state !== 10"
              type="text"
              @click="toDetail(scope.row.id, scope.row.state)"
            >
              查看详情
            </el-button>
            <el-button
              v-else
              type="text"
              @click="toDetail(scope.row.id, scope.row.state)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="demandList.length"
        :get-list="getDemandList"
      />
    </div>

    <el-dialog
      v-model="reasonFormVisible"
      width="400px"
      title="查看内容"
    >
      <el-form :model="reasonForm">
        <el-form-item label="不通过原因">
          <el-input
            v-model="reasonForm.content"
            type="textarea"
            :rows="6"
            disabled
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';

export default {
  data() {
    return {
      chooseForm: {},
      reasonFormVisible: false,
      demandList: [],
      reasonForm: {},
      demandState: []
    };
  },
  mounted() {
    this.getDemandList();
    this.getParams();
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
    async getDemandList(currentPage = 1, pageSize = 10) {
      this.$store.commit('demand/setDemandLoading', true);
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
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
    toDetail(id, val) {
      this.$router.push(`/demand-list/${id}`);
      if (val === 10) {
        this.$store.commit('demand/setDraft', true);
      } else {
        this.$store.commit('demand/setDraft', false);
      }
      this.$store.commit('demand/setDemandDetailLoading', true);
    },
    toProductDetail(id) {
      this.$router.push(`/product-list/${id}`);
    },
    resetForm() {
      this.chooseForm = {};
      this.getDemandList();
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
