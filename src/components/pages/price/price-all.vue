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
              v-model="chooseForm.product_name"
              placeholder="请输入内容"
              clearable
              @keyup.enter.native="searchPricing"
              @clear="searchPricing"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.category"
              placeholder="请选择品类"
              clearable
              @change="searchPricing"
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
              placeholder="请选择状态"
              clearable
              @change="searchPricing"
            >
              <el-option
                v-for="item in pricingEnum"
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
      v-loading="$store.state.price.priceLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 定价列表
      </div>
      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="priceList"
      >
        <el-table-column
          fixed
          label="定价ID"
          prop="id"
          width="100"
        />
        <el-table-column
          fixed
          label="关联产品名称"
          prop="related_product_name"
          min-width="150"
        />
        <el-table-column
          fixed
          label="关联产品ID"
          prop="related_product_id"
          width="110"
        />
        <el-table-column
          label="市场"
          prop="market_desc"
        />
        <el-table-column
          label="平台"
          prop="platform"
          min-width="150"
        />
        <el-table-column
          label="采购负责人"
          prop="purchase_principal"
          min-width="100"
        />
        <el-table-column
          label="计划完成时间"
          prop="estimated_finish_time"
          width="200"
        />
        <el-table-column
          label="首次报价时间"
          prop="first_submit_time"
          width="200"
        />
        <el-table-column
          label="当前已有报价"
          prop="current_quote_count"
          min-width="120"
        />
        <el-table-column
          label="状态"
          fixed="right"
        >
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="100"
        >
          <template #default="scope">
            <text-btn @handle-click="toQuotation(scope.row.id)">
              报价列表
            </text-btn>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="$store.state.price.priceListLength"
        :current-page="currentPage"
        :page-num="pageSize"
        @change-size="changePageSize"
        @change-page="changeCurrentPage"
      />
    </div>
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';
export default {
  data() {
    return {
      chooseForm: {
        product_name: '',
        category: '',
        state: ''
      },
      priceList: [],
      pricingEnum: [],
      categoryList: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.getCategoryList();
    this.getPriceList();
    this.getPricingEnum();
  },
  methods: {
    async getPricingEnum() {
      if (localStorage.getItem('params')) {
        this.pricingEnum = JSON.parse(
          localStorage.getItem('params')
        ).pricing.state;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getPricingEnum();
        } catch (err) {
          return;
        }
      }
    },
    async getCategoryList() {
      try {
        await this.$store.dispatch('demand/getCategoryList');
        this.categoryList = this.$store.state.demand.categoryList;
      } catch (err) {
        return;
      }
    },
    async getPriceList() {
      this.$store.commit('price/setPriceLoading', true);
      let params = this.chooseForm;
      params['current_page'] = this.currentPage;
      params['page_size'] = this.pageSize;
      try {
        await this.$store.dispatch('price/getPriceList', { params });
        this.priceList = this.$store.state.price.priceList;
        this.priceList.forEach((item) => {
          item.estimated_finish_time = formatterTime(
            item.estimated_finish_time
          );
          item.first_submit_time = formatterTime(item.first_submit_time);
        });
      } catch (err) {
        this.$store.commit('price/setPriceLoading', false);
        return;
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.pageSize = 10;
      this.searchPricing();
    },
    changeCellColor(val) {
      if (val >= 30) {
        return 'result-pass';
      } else {
        return 'result-ing';
      }
    },
    toQuotation(id) {
      this.$router.push(`/price-list/${id}`);
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getPriceList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getPriceList();
    },
    searchPricing() {
      this.currentPage = 1;
      this.getPriceList();
    }
  }
};
</script>
