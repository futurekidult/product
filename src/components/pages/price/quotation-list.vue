<template>
  <div v-loading="$store.state.price.quotationLoading">
    <div class="border">
      <el-descriptions
        :title="quotationList.related_product_name"
        :column="5"
        style="width: 80%"
      >
        <el-descriptions-item label="关联产品:">
          {{ quotationList.related_product_name }}
        </el-descriptions-item>
        <el-descriptions-item label="定价ID:">
          {{ quotationList.pricing_id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            采购参考价:
          </template>
          <el-button
            type="text"
            @click="
              showReferencePriceForm(
                quotationList.market,
                quotationList.related_product_id
              )
            "
          >
            查看内容
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="项目管理员:">
          {{ quotationList.project_administrator }}
        </el-descriptions-item>
        <el-descriptions-item label="采购负责人:">
          {{ quotationList.purchase_principal }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="border">
      <div class="quotation-item">
        <div class="select-title">
          <span class="line">|</span> 报价列表
        </div>
        <el-button
          type="primary"
          :disabled="quotationList.pricing_state === 40"
          @click="showQuotationForm"
        >
          新增报价
        </el-button>
      </div>
      <el-table
        border
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="quotationList.list"
      >
        <el-table-column
          label="序号"
          type="index"
          width="80px"
        />
        <el-table-column
          label="供应商名称"
          prop="supplier_name"
        />
        <el-table-column
          label="采购员"
          prop="purchase_specialist"
        />
        <el-table-column
          label="报价时间"
          prop="create_time"
        />
        <el-table-column label="报价">
          <template #default="scope">
            ￥{{ scope.row.quote_amount_rmb }}
          </template>
        </el-table-column>
        <el-table-column label="采购目标价">
          <template #default="scope">
            <el-button
              type="text"
              @click="showTargetPriceForm(scope.row.id)"
            >
              查看内容
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="报价有效期"
          prop="quote_validity"
        />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最终确定定价时间" />
        <el-table-column
          label="操作"
          width="400px"
        >
          <template #default="scope">
            <div style="display: flex">
              <el-button @click="showViewQuotationForm(scope.row.id)">
                查看
              </el-button>
              <div
                v-if="scope.row.state === 10"
                style="margin-left: 12px"
              >
                <el-button @click="deleteQuote(scope.row.id)">
                  删除
                </el-button>
                <el-button
                  @click="
                    showApplyForm(
                      quotationList.pricing_id,
                      scope.row.quote_amount_rmb
                    )
                  "
                >
                  申请调价
                </el-button>
                <el-button
                  type="primary"
                  @click="
                    submitQuotation(scope.row.id, scope.row.quote_amount_rmb)
                  "
                >
                  提交报价
                </el-button>
              </div>
              <div
                v-if="scope.row.state === 20"
                style="margin-left: 12px"
              >
                <el-button
                  @click="
                    showEditForm(scope.row.id, scope.row.purchase_specialist_id)
                  "
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="showTerminateForm(scope.row.id)"
                >
                  终止定价
                </el-button>
                <el-button
                  type="success"
                  @click="showConfirmForm(scope.row.id)"
                >
                  确定定价
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        :length="quotationList.total"
        :get-list="getQuotationList"
      />
    </div>
  </div>

  <purchase-form
    v-if="referenceFormVisible"
    name="参考"
    type="reference"
    :market="market"
    :product-id="productId"
    :dialog-visible="referenceFormVisible"
    @hide-dialog="closeReferencePriceForm"
  />
  <purchase-form
    v-if="targetFormVisible"
    type="target"
    name="目标"
    :quotation-id="quotationId"
    :dialog-visible="targetFormVisible"
    @hide-dialog="closeTargetPriceForm"
  />

  <price-form
    v-if="quotationFormVisible"
    :id="priceId"
    title="我要报价"
    :get-list="getQuotationList"
    :dialog-visible="quotationFormVisible"
    @hide-dialog="closeQuotationForm"
  />

  <view-form
    v-if="viewQuotationFormVisible"
    :id="viewId"
    title="查看"
    :dialog-visible="viewQuotationFormVisible"
    @hide-dialog="closeViewQuotationForm"
  />

  <el-dialog
    v-model="terminateFormVisible"
    title="提示"
    width="20%"
  >
    <div class="result-content">
      确定要终止该定价吗
    </div>
    <div style="text-align: center">
      <el-button
        class="close-btn"
        @click="closeTerminateForm"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="terminateQuotation"
      >
        确定
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    v-model="confirmFormVisible"
    title="提示"
    width="20%"
  >
    <div class="result-content">
      确定提交该定价为最终定价吗
    </div>
    <div style="text-align: center">
      <el-button
        class="close-btn"
        @click="closeConfirmForm"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="confirmQuotation"
      >
        确定
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    v-model="editSpecialistFormVisible"
    title="编辑"
    width="20%"
  >
    <el-form
      ref="editSpecialistForm"
      :model="editSpecialistForm"
    >
      <el-form-item
        label="采购员"
        :rules="[{ required: true, message: '请选择采购员' }]"
        prop="purchase_specialist_id"
      >
        <el-select
          v-model="editSpecialistForm.purchase_specialist_id"
          placeholder="请选择采购员"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeEditForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitPurchaseSpecialist"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="applyAdjustmentFormVisible"
    title="申请调价"
    width="30%"
  >
    <el-form
      ref="applyAdjustmentForm"
      :model="applyAdjustmentForm"
      label-width="120px"
    >
      <el-form-item label="报价">
        <el-input
          v-model="applyAdjustmentForm.quote_amount_rmb"
          disabled
        >
          <template #prepend>
            ￥
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="调价平台"
        prop="platform"
        :rules="[{ required: true, message: '请选择平台' }]"
      >
        <el-select
          v-model="applyAdjustmentForm.platform"
          placeholder="请选择平台"
        />
      </el-form-item>
      <el-form-item
        label="申请调价原因"
        prop="reason"
        :rules="[{ required: true, message: '请输入内容' }]"
      >
        <el-input
          v-model="applyAdjustmentForm.reason"
          placeholder="请输入内容"
          type="textarea"
          :rows="6"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeApplyForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitApplyAdjustment"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="lowVisible"
    title="提示"
    width="20%"
  >
    <div class="form-desc">
      存在低于该报价的平台对应采购目标，确认提交该报价吗
    </div>
    <div style="text-align: center">
      <el-button class="close-btn">
        取消
      </el-button>
      <el-button type="primary">
        确定
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    v-model="highVisible"
    title="提示"
    width="20%"
  >
    <div class="form-desc">
      存在低于该报价的平台对应采购目标，确认提交该报价吗
    </div>
    <div style="text-align: center">
      <el-button>取消</el-button>
      <el-button>确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PurchaseForm from './common/purchase-form.vue';
import PriceForm from './common/price-form.vue';
import ViewForm from './common/view-form.vue';

export default {
  components: {
    PurchaseForm,
    PriceForm,
    ViewForm
  },
  props: ['id'],
  data() {
    return {
      quotationList: {},
      referenceFormVisible: false,
      market: 0,
      targetFormVisible: false,
      quotationId: 0,
      productId: 0,
      quotationFormVisible: false,
      terminateFormVisible: false,
      terminateQuotationId: 0,
      confirmFormVisible: false,
      confirmQuotationId: 0,
      editSpecialistFormVisible: false,
      editSpecialistForm: {},
      applyAdjustmentFormVisible: false,
      applyAdjustmentForm: {},
      applyId: 0,
      priceId: 0,
      viewQuotationFormVisible: false,
      viewId: 0,
      referenceList: [],
      targetList: [],
      lowVisible: false,
      highVisible: false
    };
  },
  mounted() {
    this.getQuotationList();
    this.getReferencePrice();
    this.getTargetPrice();
  },
  methods: {
    async getQuotationList(currentPage = 1, pageSize = 10) {
      let params = {
        price_id: +this.$route.params.id,
        current_page: currentPage,
        page_size: pageSize
      };
      await this.$store.dispatch('price/getQuotationList', { params });
      this.quotationList = this.$store.state.price.quotationList;
      this.priceId = this.quotationList.pricing_id;
    },
    async getReferencePrice() {
      let params = {
        product_id: this.productId,
        market: this.market
      };
      await this.$store.dispatch('price/getReferencePrice', { params });
      this.referenceList = this.$store.state.price.referencePrice;
    },
    async getTargetPrice() {
      await this.$store.dispatch('price/getTargetPrice', {
        params: {
          quote_id: this.quotationId
        }
      });
      this.targetList = this.$store.state.price.targetPrice;
    },
    changeCellColor(val) {
      if (val === 20 || val === 30) {
        return 'result-pass';
      } else if (val === 10) {
        return 'result-ignore';
      } else {
        return 'result-fail';
      }
    },
    showReferencePriceForm(market, prodId) {
      this.referenceFormVisible = true;
      this.market = market;
      this.productId = prodId;
    },
    closeReferencePriceForm() {
      this.referenceFormVisible = false;
    },
    showTargetPriceForm(id) {
      this.targetFormVisible = true;
      this.quotationId = id;
    },
    closeTargetPriceForm() {
      this.targetFormVisible = false;
    },
    showQuotationForm() {
      this.quotationFormVisible = true;
    },
    closeQuotationForm() {
      this.quotationFormVisible = false;
    },
    showTerminateForm(id) {
      this.terminateFormVisible = true;
      this.terminateQuotationId = id;
    },
    closeTerminateForm() {
      this.terminateFormVisible = false;
    },
    async terminateQuotation() {
      await this.$store.dispatch('price/terminateQuotation', {
        id: this.terminateQuotationId
      });
      this.terminateFormVisible = false;
      this.getQuotationList();
    },
    showConfirmForm(id) {
      this.confirmFormVisible = true;
      this.confirmQuotationId = id;
    },
    closeConfirmForm() {
      this.confirmFormVisible = false;
    },
    async confirmQuotation() {
      await this.$store.dispatch('price/confirmQuotation', {
        id: this.confirmQuotationId
      });
      this.confirmQuotationId = false;
      this.getQuotationList();
    },
    async deleteQuote(id) {
      await this.$store.dispatch('price/deleteQuote', {
        id
      });
      this.getQuotationList();
    },
    showEditForm(id, purchaseSpecialist) {
      this.editSpecialistForm = {
        id,
        purchase_specialist_id: purchaseSpecialist
      };
      this.editSpecialistFormVisible = true;
    },
    closeEditForm() {
      this.editSpecialistFormVisible = false;
    },
    async updatePurchaseSpecialist() {
      await this.$store.dispatch(
        'price/updatePurchaseSpecialist',
        this.editSpecialistForm
      );
      this.editSpecialistFormVisible = false;
      this.getQuotationList();
    },
    submitPurchaseSpecialist() {
      this.$refs.editSpecialistForm.validate((valid) => {
        if (valid) {
          this.updatePurchaseSpecialist();
        }
      });
    },
    showApplyForm(id, price) {
      this.applyAdjustmentFormVisible = true;
      this.applyId = id;
      this.applyAdjustmentForm.quote_amount_rmb = price;
    },
    closeApplyForm() {
      this.applyAdjustmentFormVisible = false;
    },
    async applyAdjustment(val) {
      let body = val;
      body['pricing_id'] = this.applyId;
      await this.$store.dispatch('price/applyAdjustment', body);
      this.applyAdjustmentFormVisible = false;
      this.getQuotationList();
    },
    submitApplyAdjustment() {
      this.$refs.applyAdjustmentForm.validate((valid) => {
        if (valid) {
          this.applyAdjustment(this.applyAdjustmentForm);
        }
      });
    },
    showViewQuotationForm(id) {
      this.viewQuotationFormVisible = true;
      this.viewId = id;
    },
    closeViewQuotationForm() {
      this.viewQuotationFormVisible = false;
    },
    submitQuotation(id, price) {
      console.log(id, price);
      // this.referenceList.filter((item) => {
      //   if (item.reference_price < price) {
      //     this.lowVisible = true;
      //   }
      // });
      // this.targetList.every((item) => {
      //   if (item.target_price > price) {
      //     this.highVisible = true;
      //   }
      // });
    }
  }
};
</script>
