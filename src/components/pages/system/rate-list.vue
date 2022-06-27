<template>
  <base-breadcrumb />

  <div class="border">
    <div class="system-item">
      <div class="nav-title">
        <span class="line">|</span> 汇率表
      </div>
      <el-button
        type="primary"
        @click="showAddForm"
      >
        新增
      </el-button>
    </div>
    <div v-loading="$store.state.system.rateListLoading">
      <el-table
        stripe
        border
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="rateList"
      >
        <el-table-column
          label="ID"
          prop="id"
          width="60px"
        />
        <el-table-column
          label="美元"
          prop="usd_to_cny"
        />
        <el-table-column
          label="欧元"
          prop="gbp_to_cny"
        />
        <el-table-column
          label="英镑"
          prop="eur_to_cny"
        />
        <el-table-column
          label="日元"
          prop="jpy_to_cny"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="text"
              @click="deleteRate(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="rateList.length"
        :get-list="getRateList"
      />
    </div>
  </div>

  <el-dialog
    v-model="addVisible"
    title="新增"
    width="30%"
  >
    <div class="content">
      注: 填写的数值为对应币种的100倍兑人民币的汇率值, 例如:
      100美金兑换人民币的汇率值。
    </div>
    <el-form
      ref="rateForm"
      :model="rateForm"
      label-width="100px"
      :rules="rateRules"
    >
      <el-form-item
        label="美元"
        prop="usd_to_cny"
      >
        <el-input
          v-model="rateForm.usd_to_cny"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="欧元"
        prop="gbp_to_cny"
      >
        <el-input
          v-model="rateForm.gbp_to_cny"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="英镑"
        prop="eur_to_cny"
      >
        <el-input
          v-model="rateForm.eur_to_cny"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="日元"
        prop="jpy_to_cny"
      >
        <el-input
          v-model="rateForm.jpy_to_cny"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitRateForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { formatterTime } from '../../../utils';
export default {
  data() {
    return {
      rateList: [],
      addVisible: false,
      rateForm: {},
      rateRules: {
        usd_to_cny: [
          {
            required: true,
            message: '请输入'
          }
        ],
        gbp_to_cny: [
          {
            required: true,
            message: '请输入'
          }
        ],
        eur_to_cny: [
          {
            required: true,
            message: '请输入'
          }
        ],
        jpy_to_cny: [
          {
            required: true,
            message: '请输入'
          }
        ]
      }
    };
  },
  mounted() {
    this.getRateList();
  },
  methods: {
    async getRateList(currentPage = 1, pageSize = 10) {
      this.$store.commit('system/setRateListLoading', true);
      let params = {
        current_page: currentPage,
        page_size: pageSize
      };
      try {
        await this.$store.dispatch('system/getRateList', { params });
        this.rateList = this.$store.state.system.rateList;
        this.rateList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
        });
      } catch (err) {
        this.$store.commit('system/setRateListLoading', false);
        return;
      }
    },
    async createRate(body) {
      try {
        await this.$store.dispatch('system/createRate', body);
      } catch (err) {
        return;
      }
      this.addVisible = false;
      this.getRateList();
    },
    submitRateForm() {
      this.$refs.rateForm.validate((valid) => {
        if (valid) {
          this.createRate(this.rateForm);
        }
      });
    },
    async deleteRate(id) {
      try {
        await this.$store.dispatch('system/deleteRate', {
          id
        });
        this.getRateList();
      } catch (err) {
        return;
      }
    },
    showAddForm() {
      this.addVisible = true;
    },
    closeForm() {
      this.addVisible = false;
    }
  }
};
</script>

<style scoped>
.content {
  color: red;
  margin-bottom: 10px;
}
</style>
