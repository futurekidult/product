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
              @clear="getPriceList()"
            />
          </el-form-item>
          <el-form-item label="品类">
            <el-select
              v-model="chooseForm.category"
              placeholder="请选择品类"
              clearable
              @clear="getPriceList()"
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
              @clear="getPriceList()"
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
            @click="getPriceList()"
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
      <el-table
        border
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="priceList"
      >
        <el-table-column
          label="定价ID"
          prop="id"
        />
        <el-table-column
          label="关联产品名称"
          prop="related_product_name"
        />
        <el-table-column label="关联产品ID">
          <template #default="scope">
            <el-button type="text">
              {{ scope.row.related_product_id }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="市场"
          prop="market_desc"
        />
        <el-table-column
          label="平台"
          prop="platform"
        />
        <el-table-column
          label="采购负责人"
          prop="purchase_principal"
        />
        <el-table-column
          label="计划完成时间"
          prop="estimated_finish_time"
        />
        <el-table-column
          label="首次报价时间"
          prop="first_submit_time"
        />
        <el-table-column
          label="当前已有报价"
          prop="current_quote_count"
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
            <el-button
              type="text"
              @click="ToQuotation(scope.row.id)"
            >
              报价列表
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <base-pagination
        :length="priceList.length"
        :get-list="getPriceList"
      />
    </div>
  </div>
</template>

<script>
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
      categoryList: []
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
    async getPriceList(currentPage = 1, pageSize = 10) {
      this.$store.commit('price/setPriceLoading', true);
      let params = this.chooseForm;
      params['current_page'] = currentPage;
      params['page_size'] = pageSize;
      try {
        await this.$store.dispatch('price/getPriceList', { params });
        this.priceList = this.$store.state.price.priceList;
      } catch (err) {
        return;
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.getPriceList();
    },
    changeCellColor(val) {
      if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-ing';
      }
    },
    ToQuotation(id) {
      this.$router.push(`/price-list/${id}`);
    }
  }
};
</script>
