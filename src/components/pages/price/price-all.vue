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
              @clear="searchPricing"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.category"
              placeholder="请选择品类"
              clearable
              @clear="searchPricing"
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
              @clear="searchPricing"
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
            type="primary"
            @click="searchPricing"
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
      v-loading="$store.state.price.priceLoading"
      class="border"
    >
      <div class="select-title">
        <span class="line">|</span> 定价列表
      </div>
      <base-table
        :table-column="$global.priceAllTableColumn"
        :table-data="priceList"
        :operation-width="100"
        :pagination="pagination"
        :length="$store.state.price.priceListLength"
        @change-pagination="changePricePagination"
      >
        <template #default="slotProps">
          <text-btn @handle-click="toQuotation(slotProps.row.id)">
            报价列表
          </text-btn>
        </template>
      </base-table>
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
      pagination: JSON.parse(JSON.stringify(this.$global.pagination))
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
      params['current_page'] = this.pagination.current_page;
      params['page_size'] = this.pagination.page_size;
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
      this.pagination.page_size = 10;
      this.searchPricing();
    },
    toQuotation(id) {
      this.$router.push(`/price-list/${id}`);
    },
    changePricePagination(pagination) {
      this.pagination = pagination;
      this.getPriceList();
    },
    searchPricing() {
      this.pagination.current_page = 1;
      this.getPriceList();
    }
  }
};
</script>
