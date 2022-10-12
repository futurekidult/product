<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="40%"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="proofingForm"
      :model="proofingForm"
      :rules="proofingRules"
      label-width="110px"
    >
      <el-form-item
        label="样品型号"
        prop="sample_model"
      >
        <el-input
          v-model="proofingForm.sample_model"
          placeholder="请输入样品型号"
          :disabled="disabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="需求数量"
        prop="demand_quantity"
      >
        <el-input
          v-model="proofingForm.demand_quantity"
          placeholder="请输入需求数量"
          :disabled="disabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="有无认证"
        prop="has_verify"
      >
        <el-select
          v-model="proofingForm.has_verify"
          placeholder="请选择"
          :disabled="disabled"
          clearable
        >
          <el-option
            v-for="item in hasVerifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="需求日期"
        prop="demand_time"
      >
        <el-date-picker
          v-model="proofingForm.demand_time"
          type="datetime"
          placeholder="请选择"
          :disabled="disabled"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="proofingForm.remark_text"
          placeholder="请输入备注信息"
          type="textarea"
          rows="5"
          :disabled="disabled"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="打样单"
        prop="proofing_sheet_file"
      >
        <base-upload
          type="file"
          tag="打样单"
          url="proofing-sheet"
          :file="attachment"
          :is-disabled="disabled"
          @get-file="getUploadFile"
        />
      </el-form-item>
      <el-divider />
      <div v-if="type !== 'view'">
        <div
          v-if="type === 'create' || type === 'edit'"
          style="text-align: right"
        >
          <el-button
            class="close-btn"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitProofingSheet"
          >
            提交
          </el-button>
        </div>
        <div
          v-else
          style="text-align: right"
        >
          <el-button
            class="close-btn"
            @click="submitProofingSheetApproval(0)"
          >
            不通过
          </el-button>
          <el-button
            type="primary"
            style="background: #379f0d; border: 1px solid #379f0d"
            @click="submitProofingSheetApproval(1)"
          >
            通过
          </el-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { formatterTime, timestamp } from '../../../../utils';
export default {
  inject: ['getProofing'],
  props: ['dialogVisible', 'title', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      attachment: {},
      proofingForm: {},
      proofingRules: {
        sample_model: [
          {
            required: true,
            message: '请输入样品型号'
          }
        ],
        demand_quantity: [
          {
            required: true,
            message: '请输入需求数量'
          }
        ],
        has_verify: [
          {
            required: true,
            message: '请选择'
          }
        ],
        demand_time: [
          {
            required: true,
            message: '请选择需求日期'
          }
        ],
        proofing_sheet_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      hasVerifyOptions: [
        {
          label: '有',
          value: 1
        },
        {
          label: '无',
          value: 0
        }
      ],
      disabled: null
    };
  },
  mounted() {
    this.isDisabled();
    if (this.type !== 'create') {
      this.getProofingSheet();
    }
  },
  methods: {
    async getProofingSheet() {
      try {
        await this.$store.dispatch('sample/getProofingSheet', {
          params: {
            id: this.$store.state.sample.proofingId
          }
        });
        let { sample } = this.$store.state;
        this.proofingForm = sample.proofingSheet;
        this.attachment = this.proofingForm.proofing_sheet_file;
        this.proofingId = this.proofingForm.id;
        this.proofingForm.demand_time = formatterTime(
          this.proofingForm.demand_time
        );
      } catch (err) {
        return;
      }
    },
    async createProofingSheet(val) {
      let body = val;
      try {
        await this.$store.dispatch('sample/createProofingSheet', body);
        this.visible = false;
        this.getProofing();
      } catch (err) {
        return;
      }
    },
    async approvalProofingSheet(body) {
      try {
        await this.$store.dispatch('sample/approvalProofingSheet', body);
        this.visible = false;
        this.getProofing();
      } catch (err) {
        return;
      }
    },
    async updateProofingSheet(val) {
      let body = val;
      try {
        await this.$store.dispatch('sample/updateProofingSheet', body);
        this.visible = false;
        this.getProofing();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    isDisabled() {
      if (this.type === 'create' || this.type === 'edit') {
        this.disabled = false;
      }
      if (this.type === 'approval' || this.type === 'view') {
        this.disabled = true;
      }
    },
    submitProofingSheet() {
      this.proofingForm.proofing_sheet_file = this.attachment.id;
      let val = {
        sample_id: +this.$route.params.id,
        sample_model: this.proofingForm.sample_model,
        demand_quantity: +this.proofingForm.demand_quantity,
        has_verify: +this.proofingForm.has_verify,
        demand_time: timestamp(this.proofingForm.demand_time),
        remark_text: this.proofingForm.remark_text,
        proofing_sheet_file: this.proofingForm.proofing_sheet_file
      };
      this.$refs.proofingForm.validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.createProofingSheet(val);
          } else {
            val.id = this.proofingId;
            this.updateProofingSheet(val);
          }
        }
      });
    },
    submitProofingSheetApproval(val) {
      this.approvalProofingSheet({
        id: this.proofingForm.id,
        approval_result: val
      });
    },
    getUploadFile(e) {
      this.attachment = e;
    }
  }
};
</script>
