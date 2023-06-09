<template>
  <div>
    <div v-loading="$store.state.price.quotationLoading">
      <div class="border">
        <el-descriptions
          :title="quotationList.related_product_name"
          :column="5"
          style="width: 80%"
        >
          <el-descriptions-item label="产品信息:">
            <text-btn
              @handle-click="
                getProductDetailDialog(quotationList.related_product_id)
              "
            >
              查看
            </text-btn>
          </el-descriptions-item>
          <el-descriptions-item label="定价ID:">
            {{ quotationList.pricing_id }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              采购参考价:
            </template>
            <text-btn @handle-click="showReferencePriceForm">
              查看内容
            </text-btn>
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
        <base-table
          :table-column="$global.quotationListTableColumn"
          :table-data="quotationList.list"
          :operation-width="400"
          :pagination="pagination"
          :length="quotationList.total"
          @change-pagination="changeQuotationListPagination"
        >
          <template #link="linkProps">
            <text-btn @handle-click="toDetail(linkProps.row.supplier_id)">
              {{ linkProps.row.supplier_name }}
            </text-btn>
          </template>
          <template #operation="operationProps">
            <text-btn
              @handle-click="showTargetPriceForm(operationProps.row.id)"
            >
              查看内容
            </text-btn>
          </template>
          <template #default="slotProps">
            <div style="display: flex">
              <el-button
                style="width: 80px"
                @click="showViewQuotationForm(slotProps.row.id)"
              >
                查看
              </el-button>
              <div
                v-if="slotProps.row.state === 10"
                style="margin-left: 12px"
              >
                <el-button
                  type="danger"
                  style="width: 80px"
                  :disabled="pricingState === 20"
                  @click="showDeleteDialog(slotProps.row.id)"
                >
                  删除
                </el-button>
                <el-button
                  style="width: 80px"
                  :disabled="pricingState === 20"
                  @click="
                    showApplyForm(
                      slotProps.row.id,
                      slotProps.row.quote_amount_rmb
                    )
                  "
                >
                  申请调价
                </el-button>
                <el-button
                  type="primary"
                  style="width: 80px"
                  :disabled="pricingState === 20"
                  @click="
                    showQuotation(
                      slotProps.row.id,
                      slotProps.row.quote_amount_rmb
                    )
                  "
                >
                  提交报价
                </el-button>
              </div>
              <div
                v-if="slotProps.row.state === 20"
                style="margin-left: 12px"
              >
                <el-button
                  style="width: 80px"
                  @click="
                    showEditForm(
                      slotProps.row.id,
                      slotProps.row.purchase_specialist_id
                    )
                  "
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  style="width: 80px"
                  @click="showTerminateForm(slotProps.row.id)"
                >
                  终止定价
                </el-button>
                <el-button
                  type="success"
                  style="width: 80px"
                  @click="showConfirmForm(slotProps.row.id)"
                >
                  确定定价
                </el-button>
              </div>
            </div>
          </template>
        </base-table>
      </div>
    </div>

    <purchase-form
      v-if="referenceFormVisible"
      name="参考"
      type="reference"
      :market="market"
      :product-id="prodId"
      :dialog-visible="referenceFormVisible"
      :close-on-click-modal="false"
      @hide-dialog="closeReferencePriceForm"
    />
    <purchase-form
      v-if="targetFormVisible"
      type="target"
      name="目标"
      :quotation-id="quotationId"
      :dialog-visible="targetFormVisible"
      :close-on-click-modal="false"
      @hide-dialog="closeTargetPriceForm"
    />

    <price-form
      v-if="quotationFormVisible"
      :id="priceId"
      title="我要报价"
      :product-id="prodId"
      :market="market"
      :get-list="getQuotationList"
      :dialog-visible="quotationFormVisible"
      :close-on-click-modal="false"
      @hide-dialog="closeQuotationForm"
    />

    <view-form
      v-if="viewQuotationFormVisible"
      :id="viewId"
      title="查看"
      :dialog-visible="viewQuotationFormVisible"
      :close-on-click-modal="false"
      @hide-dialog="closeViewQuotationForm"
    />

    <el-dialog
      v-model="terminateFormVisible"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
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
      width="25%"
      :close-on-click-modal="false"
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
      width="25%"
      :close-on-click-modal="false"
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
          <el-tree-select
            v-model="editSpecialistForm.purchase_specialist_id"
            :data="memberList"
            clearable
            filterable
            :props="defaultProps"
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
      :close-on-click-modal="false"
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
            clearable
          >
            <el-option
              v-for="item in platform"
              :key="item.platform"
              :label="item.platform_desc"
              :value="item.platform"
            />
          </el-select>
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
            clearable
            maxlength="200"
            show-word-limit
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
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="form-desc">
        存有平台的对应采购目标价 &lt; 此次报价，确认提交该报价吗
      </div>
      <div style="text-align: center; margin: 40px 0 0 0">
        <el-button
          class="close-btn"
          @click="closeLowForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitQuotation"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="highVisible"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="form-desc">
        该报价高于所有平台对应采购目标价，请申请调价后再提交
      </div>
      <div style="text-align: center; margin: 40px 0 0 0">
        <el-button
          type="primary"
          @click="closeHighForm"
        >
          好的
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="deleteDialog"
      title="提示"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="result-content">
        确认要删除该报价吗
      </div>
      <div style="text-align: center">
        <el-button
          class="member-btn"
          @click="closeDeleteDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="quote-btn"
          @click="submitDeteleResult"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="productViewVisible"
      title="基本信息"
      width="50%"
      :close-on-click-modal="false"
    >
      <product-basic
        :attachment="productAttachment"
        :product-form="productForm"
        type="quotation"
      />
    </el-dialog>
  </div>
</template>

<script>
import PurchaseForm from './common/purchase-form.vue';
import PriceForm from './common/price-form.vue';
import ViewForm from './common/view-form.vue';
import { formatterTime, getOrganizationList } from '../../../utils';
import ProductBasic from '../../common/product-basic-form.vue';

export default {
  components: {
    PurchaseForm,
    PriceForm,
    ViewForm,
    ProductBasic
  },
  props: ['id'],
  data() {
    return {
      quotationList: {},
      referenceFormVisible: false,
      market: 0,
      targetFormVisible: false,
      quotationId: 0,
      quotationFormVisible: false,
      terminateFormVisible: false,
      terminateQuotationId: 0,
      confirmFormVisible: false,
      confirmQuotationId: 0,
      editSpecialistFormVisible: false,
      editSpecialistForm: {},
      applyAdjustmentFormVisible: false,
      applyAdjustmentForm: {},
      quoteId: 0,
      priceId: 0,
      viewQuotationFormVisible: false,
      viewId: 0,
      referenceList: [],
      targetList: [],
      lowVisible: false,
      highVisible: false,
      submitId: 0,
      platform: [],
      prodId: 0,
      deleteDialog: false,
      deleteId: 0,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      pricingState: 0,
      productViewVisible: false,
      productAttachment: [],
      productForm: {},
      pagination: JSON.parse(JSON.stringify(this.$global.pagination))
    };
  },
  mounted() {
    this.getQuotationList();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    async getQuotationList() {
      this.$store.commit('price/setQuotationLoading', true);
      let params = {
        ...this.pagination,
        pricing_id: +this.$route.params.id
      };
      try {
        await this.$store.dispatch('price/getQuotationList', { params });
        this.quotationList = this.$store.state.price.quotationList;
        this.priceId = this.quotationList.pricing_id;
        this.prodId = this.quotationList.related_product_id;
        this.market = this.quotationList.market;
        this.pricingState = this.quotationList.pricing_state;
        this.quotationList.list.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.quote_validity = formatterTime(item.quote_validity);
          item.confirm_time = formatterTime(item.confirm_time);
        });
        this.getPlatform();
        this.getReferencePrice();
      } catch (err) {
        this.$store.commit('price/setQuotationLoading', false);
        return;
      }
    },
    async getReferencePrice() {
      let params = {
        product_id: this.prodId,
        market: this.market
      };
      try {
        await this.$store.dispatch('price/getReferencePrice', { params });
        this.referenceList = this.$store.state.price.referencePrice;
      } catch (err) {
        return;
      }
    },
    async getTargetPrice(id, val) {
      let price = val.substring(1);
      try {
        await this.$store.dispatch('price/getTargetPrice', {
          params: {
            quote_id: id
          }
        });
        this.targetList = this.$store.state.price.targetPrice;
        let low = this.targetList.some((item) => {
          return +item.target_price < +price;
        });
        let high = this.targetList.every((item) => {
          return +item.target_price < +price;
        });
        if (high) {
          this.highVisible = true;
        } else if (low) {
          this.lowVisible = true;
        } else {
          this.submitQuotation();
        }
      } catch (err) {
        return;
      }
    },
    async getPlatform() {
      let params = {
        product_id: this.prodId,
        pricing_id: this.priceId
      };
      try {
        await this.$store.dispatch('getPlatform', { params });
        this.platform = this.$store.state.platform;
      } catch (err) {
        return;
      }
    },
    showReferencePriceForm() {
      this.referenceFormVisible = true;
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
      try {
        await this.$store.dispatch('price/terminateQuotation', {
          id: this.terminateQuotationId
        });
        this.terminateFormVisible = false;
        this.getQuotationList();
      } catch (err) {
        return;
      }
    },
    showConfirmForm(id) {
      this.confirmFormVisible = true;
      this.confirmQuotationId = id;
    },
    closeConfirmForm() {
      this.confirmFormVisible = false;
    },
    async confirmQuotation() {
      try {
        await this.$store.dispatch('price/confirmQuotation', {
          id: this.confirmQuotationId
        });
        this.confirmFormVisible = false;
        this.getQuotationList();
      } catch (err) {
        return;
      }
    },
    submitDeteleResult() {
      this.deleteQuote(this.deleteId);
    },
    async deleteQuote(id) {
      try {
        await this.$store.dispatch('price/deleteQuote', {
          id
        });
        this.deleteDialog = false;
        this.getQuotationList();
      } catch (err) {
        return;
      }
    },
    showDeleteDialog(id) {
      this.deleteDialog = true;
      this.deleteId = id;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
    showEditForm(id, purchaseSpecialist) {
      this.editSpecialistForm = {
        quote_id: id,
        purchase_specialist_id: purchaseSpecialist
      };
      this.editSpecialistFormVisible = true;
    },
    closeEditForm() {
      this.editSpecialistFormVisible = false;
    },
    async updatePurchaseSpecialist() {
      try {
        await this.$store.dispatch(
          'price/updatePurchaseSpecialist',
          this.editSpecialistForm
        );
        this.editSpecialistFormVisible = false;
        this.getQuotationList();
      } catch (err) {
        return;
      }
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
      this.quoteId = id;
      this.applyAdjustmentForm.quote_amount_rmb = price;
    },
    closeApplyForm() {
      this.applyAdjustmentFormVisible = false;
    },
    async applyAdjustment(val) {
      let body = val;
      body['quote_id'] = this.quoteId;
      try {
        await this.$store.dispatch('price/applyAdjustment', body);
        this.applyAdjustmentFormVisible = false;
        this.getQuotationList();
      } catch (err) {
        return;
      }
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
    showQuotation(id, price) {
      this.submitId = id;
      this.getTargetPrice(id, price);
    },
    async submitQuotation() {
      try {
        await this.$store.dispatch('price/submitQuotation', {
          id: this.submitId
        });
        this.lowVisible = false;
        this.getQuotationList();
      } catch (err) {
        return;
      }
    },
    closeLowForm() {
      this.lowVisible = false;
    },
    closeHighForm() {
      this.highVisible = false;
    },
    toDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/supplier-list') > -1) {
        this.$router.push(`/supplier-list/${id}`);
      } else {
        this.$message.error('无权限访问');
      }
    },
    async getProductDetailDialog(id) {
      this.$store.commit('price/setDetailLoading', true);
      try {
        await this.$store.dispatch('price/getProductDetail', {
          params: {
            id
          }
        });
        this.productForm = this.$store.state.price.productDetail;
        this.productAttachment = this.productForm.images;
        this.productViewVisible = true;
      } catch (err) {
        this.$store.commit('price/setDetailLoading', false);
        return;
      }
    },
    changeQuotationListPagination(pagination) {
      this.pagination = pagination;
      this.getQuotationList();
    }
  }
};
</script>
