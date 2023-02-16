<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="开模费用"
        prop="cost"
      >
        <el-input
          v-model="form.cost"
          placeholder="请输入开模费用"
          clearable
        >
          <template #prepend>
            ￥
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="开模工厂"
        prop="mould_factory"
      >
        <el-input
          v-model="form.mould_factory"
          placeholder="请输入开模工厂"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="计划完成时间"
        prop="estimated_finish_time"
      >
        <el-date-picker
          v-model="form.estimated_finish_time"
          type="datetime"
          placeholder="请选择日期"
          clearable
          :default-time="$global.defaultTime"
          :disabled-date="setDisabledDate"
        />
      </el-form-item>
      <el-form-item label="说明">
        <el-input
          v-model="form.illustration_text"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="协议附件"
        prop="agreement_file"
      >
        <base-upload
          type="file"
          tag="协议附件"
          url="mould-agreement"
          :file="file"
          @get-file="getUploadFile"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { timestamp, setDisabledDate } from '../../../../utils/index';

export default {
  props: [
    'dialogVisible',
    'title',
    'type',
    'editForm',
    'getList',
    'attachment'
  ],
  emits: ['hide-dialog'],
  data() {
    return {
      file: this.attachment,
      form: {},
      rules: {
        agreement_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ],
        cost: [
          {
            required: true,
            message: '请输入开模费用'
          }
        ],
        mould_factory: [
          {
            required: true,
            message: '请输入开模工厂'
          }
        ],
        estimated_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ]
      },
      visible: this.dialogVisible
    };
  },
  watch: {
    attachment(val) {
      this.file = val;
    }
  },
  mounted() {
    if (this.type === 'edit') {
      this.form = this.editForm;
    }
  },
  methods: {
    setDisabledDate,
    async createMakingMould(body) {
      try {
        await this.$store.dispatch('mould/createMakingMould', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async updateMakingMould(body) {
      try {
        await this.$store.dispatch('mould/updateMakingMould', body);
        this.visible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', false);
    },
    submitForm() {
      this.form.agreement_file = this.file.id;
      this.$refs.form.validate((valid) => {
        if (valid) {
          let val = {
            cost: +this.form.cost,
            mould_factory: this.form.mould_factory,
            estimated_finish_time: timestamp(this.form.estimated_finish_time),
            illustration_text: this.form.illustration_text,
            agreement_file: this.form.agreement_file
          };
          if (this.type === 'create') {
            val['mould_id'] = +this.$route.params.id;
            this.createMakingMould(val);
          } else {
            val['id'] = this.form.id;
            this.updateMakingMould(val);
          }
        }
      });
    },
    getUploadFile(e) {
      this.file = e;
    }
  }
};
</script>
