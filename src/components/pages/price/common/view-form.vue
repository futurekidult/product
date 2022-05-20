<template>
  <el-dialog
    v-model="visible"
    width="40%"
    :title="title"
    @close="cancel"
  >
    <el-form
      ref="quotationForm"
      v-loading="$store.state.price.viewLoading"
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
      <el-form-item lable="报价">
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
                v-model="quotationForm.inner_length"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.inner_width"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.inner_height"
                disabled
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="外箱尺寸/cm">
          <div style="display: flex">
            <el-form-item>
              <el-input
                v-model="quotationForm.outer_length"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.outer_width"
                class="analy-form_mar"
                disabled
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="quotationForm.outer_height"
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
        label="头程费用"
        style="margin-bottom: 18px"
      >
        <div style="display: flex">
          <el-form-item>
            <el-select
              v-model="quotationForm.head_currency"
              class="analy-form_mar"
              disabled
            />
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
            />
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
      <el-form-item label="上传附件">
        <el-upload
          :show-file-list="false"
          action=""
          :limit="1"
        >
          <el-button
            type="primary"
            disabled
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          只能上传jpg/png格式文件,单个文件不能超过5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div class="attachment-list">
          <div>{{ attachment.name }}</div>
          <el-button type="text">
            下载
          </el-button>
        </div>
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
      supplierList: [
        {
          id: 1,
          name: 'xxx有限公司1'
        },
        {
          id: 2,
          name: 'xxx有限公司2'
        }
      ],
      attachment: {}
    };
  },
  mounted() {
    this.getQuotation();
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    },
    async getQuotation() {
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
    }
  }
};
</script>

<style scoped>
.form-desc {
  font-size: 10px;
}
</style>
