<template>
  <el-dialog
    v-model="visible"
    width="50%"
    :title="title"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="quotationForm"
      label-width="150px"
      :model="quotationForm"
    >
      <el-form-item label="采购员">
        <el-input
          v-model="quotationForm.purchase_specialist"
          disabled
        />
      </el-form-item>
      <el-form-item label="报价时间">
        <el-date-picker
          v-model="quotationForm.create_time"
          type="datetime"
          disabled
        />
      </el-form-item>
      <el-form-item label="选择供应商">
        <el-select
          v-model="quotationForm.supplier"
          disabled
        />
      </el-form-item>
      <el-form-item label="报价">
        <el-input
          v-model="quotationForm.quote_amount_rmb"
          disabled
        >
          <template #prepend>
            ￥
          </template>
        </el-input>
      </el-form-item>
      <div v-if="quotationForm.appended_reason">
        <el-form-item label="新增该报价原因">
          <el-input
            v-model="quotationForm.appended_reason"
            type="textarea"
            :rows="6"
            disabled
          />
        </el-form-item>
        <el-form-item>
          <div class="form-desc">
            检测到已有该供应商的报价，请填写新增该报价原因
          </div>
        </el-form-item>
      </div>
      <el-form-item
        v-if="quotationForm.beyond_reference_reason"
        label="高出参考价原因"
      >
        <el-input
          v-model="quotationForm.beyond_reference_reason"
          type="textarea"
          :rows="6"
          disabled
        />
      </el-form-item>
      <el-form-item label="报价有效期">
        <el-date-picker
          v-model="quotationForm.quote_validity"
          type="datetime"
          disabled
        />
      </el-form-item>
      <el-divider />
      <div class="analy-form_item">
        <el-form-item label="内箱尺寸/cm">
          <div style="display: flex">
            <el-form-item>
              <el-input
                v-model="quotationForm.inner_l"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.inner_w"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.inner_h"
                disabled
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="外箱尺寸/cm">
          <div style="display: flex">
            <el-form-item>
              <el-input
                v-model="quotationForm.outer_l"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.outer_w"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.outer_h"
                disabled
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="内箱重量/kg"
          style="margin-bottom: 18px"
        >
          <el-input
            v-model="quotationForm.inner_box_weight"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="外箱重量/kg"
          style="margin-bottom: 18px"
        >
          <el-input
            v-model="quotationForm.outer_box_weight"
            disabled
          />
        </el-form-item>
      </div>
      <el-form-item
        label="头程附加费"
        style="margin-bottom: 18px"
      >
        <div style="display: flex">
          <el-form-item>
            <el-select
              v-model="quotationForm.head_currency"
              class="analy-form_mar"
              disabled
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="quotationForm.head_cost"
              class="analy-form_mar"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="quotationForm.head_cost_rmb"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label="尾程费用"
        style="margin-bottom: 18px"
      >
        <div style="display: flex">
          <el-form-item>
            <el-select
              v-model="quotationForm.tail_currency"
              class="analy-form_mar"
              disabled
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="quotationForm.tail_cost"
              class="analy-form_mar"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="quotationForm.tail_cost_rmb"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label="海运单价"
        style="margin-bottom: 18px"
      >
        <div style="display: flex">
          <el-form-item>
            <el-select
              v-model="quotationForm.sea_freight_currency"
              class="analy-form_mar"
              disabled
            >
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="quotationForm.sea_freight_cost"
              class="analy-form_mar"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="quotationForm.sea_freight_cost_rmb"
              disabled
            >
              <template #prepend>
                ￥
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="desc">
          此处请填写一立方的海运单价,若没有海运费金额请填0
        </div>
      </el-form-item>
      <el-form-item label="报价单">
        <base-upload
          type="file"
          tag="报价单"
          url="quotation"
          :file="attachment"
          :is-disabled="true"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { formatterTime } from '../../../../utils/index.js';

export default {
  props: ['dialogVisible', 'title', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      quotationForm: {},
      attachment: {},
      currency: []
    };
  },
  mounted() {
    this.getQuotation();
    this.getParams();
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    },
    async getQuotation() {
      try {
        await this.$store.dispatch('price/getQuotation', {
          params: {
            quote_id: this.id
          }
        });
        this.quotationForm = this.$store.state.price.quotation;
        this.quotationForm.quote_validity = formatterTime(
          this.quotationForm.quote_validity
        );
        this.quotationForm.create_time = formatterTime(
          this.quotationForm.create_time
        );
        this.attachment = this.quotationForm.quotation;
      } catch (err) {
        return;
      }
    },
    async getParams() {
      if (localStorage.getItem('params')) {
        this.currency = JSON.parse(
          localStorage.getItem('params')
        ).demand.currency;
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
    }
  }
};
</script>

<style scoped>
.form-desc {
  font-size: 10px;
}
</style>
