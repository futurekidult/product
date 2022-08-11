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
          <el-form-item label="模具名称">
            <el-input
              v-model="chooseForm.name"
              placeholder="请输入内容"
              clearable
              @clear="searchMould"
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-tree-select
              v-model="chooseForm.creator_id"
              :data="memberList"
              clearable
              filterable
              :props="defaultProps"
              @clear="searchMould"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              clearable
              placeholder="请选择状态"
              @clear="searchMould"
            >
              <el-option
                v-for="item in mouldState"
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
            @click="searchMould"
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
      v-loading="$store.state.mould.listLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 模具列表
        <el-button
          type="primary"
          class="create"
          @click="showMouldForm"
        >
          创建模具
        </el-button>
      </div>

      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="mouldList"
      >
        <el-table-column
          label="模具ID"
          prop="id"
          width="80px"
        />
        <el-table-column
          label="模具名称"
          prop="name"
        />
        <el-table-column
          label="开模工厂名称"
          prop="mould_factory"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
          width="200px"
        />
        />
        <el-table-column
          label="创建人"
          prop="creator"
        />
        <el-table-column
          label="计划完成时间"
          prop="estimated_finish_time"
          width="200px"
        />
        <el-table-column
          label="实际完成时间"
          prop="actual_finish_time"
          width="200px"
        />
        />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="toDetail(scope.row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="$store.state.mould.mouldListLength"
        :current-page="currentPage"
        :page-num="pageSize"
        @change-size="changePageSize"
        @change-page="changeCurrentPage"
      />

      <el-dialog
        v-if="mouldFormVisible"
        v-model="mouldFormVisible"
        title="创建模具"
        width="30%"
      >
        <el-form
          ref="mouldForm"
          :model="mouldForm"
          :rules="mouldRules"
          label-width="120px"
        >
          <el-form-item
            label="模具名称"
            prop="name"
          >
            <el-input
              v-model="mouldForm.name"
              placeholder="请输入模具名称"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="计划完成时间"
            prop="estimated_finish_time"
          >
            <el-date-picker
              v-model="mouldForm.estimated_finish_time"
              type="datetime"
              placeholder="请选择日期"
              clearable
              :default-time="defaultTime"
            />
          </el-form-item>
          <el-divider />
          <div style="text-align: right">
            <el-button
              class="close-btn"
              @click="closeMouldForm"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              @click="submitMouldForm"
            >
              提交
            </el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { formatterTime, getOrganizationList, timestamp } from '../../../utils/index.js';

export default {
  data() {
    return {
      chooseForm: {},
      mouldList: [],
      mouldFormVisible: false,
      mouldForm: {},
      mouldRules: {
        name: [
          {
            required: true,
            message: '请输入模具名称'
          }
        ],
        estimated_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ]
      },
      mouldState: [],
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      defaultTime: new Date(2000,1,1,23,59,59),
      currentPage: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.getMouldList();
    this.getState();
    getOrganizationList().then( (res) => {
      this.memberList = res;
    });
  },
  methods: {
    async getState() {
      if (localStorage.getItem('params')) {
        this.mouldState = JSON.parse(
          localStorage.getItem('params')
        ).mould.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getState();
        } catch (err) {
          return;
        }
      }
    },
    async getMouldList() {
      this.$store.commit('mould/setListLoading', true);
      let params = this.chooseForm;
      params['current_page'] = this.currentPage;
      params['page_size'] = this.pageSize;
      try {
        await this.$store.dispatch('mould/getMouldList', { params });
        this.mouldList = this.$store.state.mould.mouldList;
        this.mouldList.map((item) => {
          item.create_time = formatterTime(item.create_time);
          item.estimated_finish_time = formatterTime(
            item.estimated_finish_time
          );
          item.actual_finish_time = formatterTime(item.actual_finish_time);
        });
      } catch (err) {
        this.$store.commit('mould/setListLoading', false);
        return;
      }
    },
    async createMould(val) {
      let body = {
        name: val.name,
        estimated_finish_time: timestamp(val.estimated_finish_time)
      }
      try {
        await this.$store.dispatch('mould/createMould', body);
        this.mouldFormVisible = false;
        this.getMouldList();
      } catch (err) {
        return;
      }
    },
    toDetail(id) {
      this.$router.push(`/mould-list/${id}`);
      this.$store.commit('setEntry', 'detail');
    },
    changeCellColor(val) {
      if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-ing';
      }
    },
    showMouldForm() {
      this.mouldFormVisible = true;
      this.mouldForm = {};
    },
    closeMouldForm() {
      this.mouldFormVisible = false;
    },
    resetForm() {
      this.chooseForm = {};
      this.pageSize = 10;
      this.searchMould();
    },
    submitMouldForm() {
      this.$refs.mouldForm.validate((valid) => {
        if (valid) {
          this.createMould(this.mouldForm);
        }
      });
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getMouldList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getMouldList();
    },
    searchMould() {
      this.currentPage = 1;
      this.getMouldList();
    }
  }
};
</script>
