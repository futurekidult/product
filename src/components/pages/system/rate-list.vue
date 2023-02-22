<template>
  <div>
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
      <base-table
        v-loading="$store.state.system.rateListLoading"
        :table-data="rateList"
        :operation-width="100"
        :pagination="pagination"
        :length="$store.state.system.rateListLength"
        :table-column="tableColumn"
        :operation-visible="false"
        @change-pagination="changePagination"
      >
        <template #default="slotProps">
          <text-btn @handle-click="showDeleteDialog(slotProps.row.id)">
            删除
          </text-btn>
        </template>
      </base-table>
    </div>
    <!-- 新增汇率弹窗 -->
    <el-dialog
      v-model="addVisible"
      title="新增"
      width="30%"
      :close-on-click-modal="false"
      @close="closeForm"
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
          prop="eur_to_cny"
        >
          <el-input
            v-model="rateForm.eur_to_cny"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="英镑"
          prop="gbp_to_cny"
        >
          <el-input
            v-model="rateForm.gbp_to_cny"
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
        <el-form-item
          label="加拿大元"
          prop="cad_to_cny"
        >
          <el-input
            v-model="rateForm.cad_to_cny"
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
  </div>
</template>

<script>
import { formatterTime, resetFormFields } from '../../../utils';
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
        ],
        cad_to_cny: [
          {
            required: true,
            message: '请输入'
          }
        ]
      },
      pagination: this.$global.pagination,
      tableColumn: [
        { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
        {
          prop: 'usd_to_cny',
          label: '美元'
        },
        {
          prop: 'eur_to_cny',
          label: '欧元'
        },
        {
          prop: 'gbp_to_cny',
          label: '英镑'
        },
        {
          prop: 'jpy_to_cny',
          label: '日元'
        },
        {
          prop: 'cad_to_cny',
          label: '加拿大元'
        },
        {
          prop: 'create_time',
          label: '创建时间',
          width: 200
        }
      ]
    };
  },
  mounted() {
    this.getRateList();
  },
  methods: {
    async getRateList() {
      this.$store.commit('system/setRateListLoading', true);
      let params = this.pagination;
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
        this.addVisible = false;
        this.pagination.current_page = 1;
        resetFormFields(this.$refs.rateForm);
        this.getRateList();
      } catch (err) {
        return;
      }
    },
    submitRateForm() {
      this.$refs.rateForm.validate((valid) => {
        if (valid) {
          this.createRate(this.rateForm);
        }
      });
    },
    showAddForm() {
      this.addVisible = true;
    },
    closeForm() {
      this.addVisible = false;
      resetFormFields(this.$refs.rateForm);
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getRateList();
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
