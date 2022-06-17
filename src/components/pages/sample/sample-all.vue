<template>
  <div>
    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 筛选条件
      </div>
      <div class="select-item">
        <el-form
          label-position="right"
          label-width="80px"
          style="display: flex"
          :model="chooseForm"
        >
          <el-form-item label="产品名称">
            <el-input
              v-model="chooseForm.product_name"
              placeholder="请输入内容"
              clearable
              @clear="getSampleList()"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.product_category"
              placeholder="请选择"
              clearable
              @clear="getSampleList()"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              placeholder="请选择"
              clearable
              @clear="getSampleList()"
            >
              <el-option
                v-for="item in sampleState"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            type="primary"
            @click="getSampleList()"
          >
            查询
          </el-button>
          <el-button
            class="reset-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div
      v-loading="$store.state.sample.listLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 样品列表
      </div>
      <el-table
        border
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="sampleList"
      >
        <el-table-column
          label="样品ID"
          prop="id"
        />
        <el-table-column
          label="关联产品名称"
          prop="product_name"
        />
        <el-table-column
          label="关联产品ID"
          prop="product_id"
        />
        <el-table-column
          label="关联定价ID"
          prop="pricing_id"
        />
        <el-table-column
          label="供应商名称"
          prop="supplier"
        />
        <el-table-column
          label="计划完成时间"
          prop="estimated_finish_time"
        />
        <el-table-column
          label="实际完成时间"
          prop="actual_finish_time"
        />
        <el-table-column
          label="采购员"
          prop="purchase_specialist"
        />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="测试结果">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.test_result)">
              {{ scope.row.test_result_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="text"
              @click="toDetail(scope.row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chooseForm: {},
      sampleList: [],
      categoryList: [],
      sampleState: []
    };
  },
  mounted() {
    this.getCategoryList();
    this.getSampleList();
    this.getSampleState();
  },
  methods: {
    async getSampleState() {
      if (localStorage.getItem('params')) {
        this.sampleState = JSON.parse(
          localStorage.getItem('params')
        ).sample.state;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getSampleState();
      }
    },
    async getCategoryList() {
      await this.$store.dispatch('demand/getCategoryList');
      this.categoryList = this.$store.state.demand.categoryList;
    },
    async getSampleList(currentPage = 1, pageSize = 10) {
      this.$store.commit('sample/setListLoading', true);
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
      await this.$store.dispatch('sample/getSampleList', { params });
      this.sampleList = this.$store.state.sample.sampleList;
    },
    resetForm() {
      this.chooseForm = {};
      this.getSampleList();
    },
    toDetail(id) {
      this.$router.push(`/sample-list/${id}`);
      this.$store.commit('setEntry', 'detail');
    },
    changeCellColor(val) {
      if (val === 30 || val === 1) {
        return 'result-pass';
      } else if (val === 20 || val === 10) {
        return 'result-ing';
      } else {
        return 'result-ignore';
      }
    }
  }
};
</script>
