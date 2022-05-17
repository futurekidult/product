<template>
  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 筛选条件
    </div>
    <el-form
      label-width="80px"
      style="display: flex"
      :model="chooseForm"
    >
      <el-form-item label="模具名称">
        <el-input
          v-model="chooseForm.name"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input
          v-model="chooseForm.author"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="chooseForm.status" />
      </el-form-item>
      <div style="float: right">
        <el-form-item>
          <el-button
            type="primary"
            @click="getMouldList"
          >
            查询
          </el-button>
          <el-button
            class="close-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>

  <div class="border">
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
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="mouldList"
    >
      <el-table-column
        label="模具ID"
        prop="id"
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
      />
      <el-table-column
        label="
        创建人"
        prop="creator"
      />
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
      />
      <el-table-column
        label="实际完成时间"
        prop="actual_finish_time"
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
      :length="mouldList.length"
      :get-list="getMouldList"
    />

    <el-dialog
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
</template>

<script>
import { formatterTime, timestamp } from '../../../utils/index.js';

export default {
  data() {
    return {
      chooseForm: {
        name: '',
        author: '',
        status: ''
      },
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
      }
    };
  },
  mounted() {
    this.getMouldList();
  },
  methods: {
    async getMouldList(currentPage = 1, pageSize = 10) {
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
      await this.$store.dispatch('mould/getMouldList', { params });
      this.mouldList = this.$store.state.mould.mouldList;
      this.mouldList.map((item) => {
        item.create_time = formatterTime(item.create_time);
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.actual_finish_time = formatterTime(item.actual_finish_time);
      });
    },
    async createMould(body) {
      await this.$store.dispatch('mould/createMould', body);
      this.mouldFormVisible = false;
      this.getMouldList();
    },
    toDetail(id) {
      this.$router.push(`/mould-list/${id}`);
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
    },
    closeMouldForm() {
      this.mouldFormVisible = false;
    },
    resetForm() {
      this.chooseForm = {};
    },
    submitMouldForm() {
      this.$refs.mouldForm.validate((valid) => {
        if (valid) {
          this.mouldForm.estimated_finish_time = timestamp(
            this.mouldForm.estimated_finish_time
          );
          this.createMould(this.mouldForm);
        }
      });
    }
  }
};
</script>
