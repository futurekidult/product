<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="35%"
    @close="cancel"
  >
    <el-form
      ref="applyForm"
      :model="applyForm"
      :rules="rules"
      label-width="160px"
    >
      <el-form-item label="样品型号">
        <el-input
          v-model="applyForm.sample_model"
          placeholder="请输入样品型号"
          disabled
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="售卖国家">
        <el-input
          v-model="applyForm.market"
          placeholder="请输入售卖国家"
          disabled
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="样品总数"
        prop="total"
      >
        <el-input
          v-model="applyForm.total"
          placeholder="请输入样品总数"
          :disabled="disabled"
          clearable
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="售卖国整数与测试报告">
        <el-input
          v-model="applyForm.certificate_and_report"
          placeholder="请输入"
          :disabled="disabled"
          clearable
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="样品是否大货包装"
        prop="is_pre_production"
      >
        <el-select
          v-model="applyForm.is_pre_production"
          placeholder="请选择"
          :disabled="disabled"
          clearable
        >
          <el-option
            v-for="item in hasOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否含规格说明书"
        prop="has_manual"
      >
        <el-select
          v-model="applyForm.has_manual"
          placeholder="请选择"
          :disabled="disabled"
          clearable
        >
          <el-option
            v-for="item in hasOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="期望完成日期"
        prop="expected_finish_time"
      >
        <el-date-picker
          v-model="applyForm.expected_finish_time"
          placeholder="请选择日期"
          :disabled="disabled"
          clearable
          type="datetime"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-divider v-if="type !== 'apply'" />
      <el-form-item
        v-if="type !== 'apply'"
        label="评审结果"
        prop="review_result"
      >
        <el-select
          v-model="applyForm.review_result"
          :disabled="type === 'view'"
          placeholder="请选择评审结果"
          clearable
        >
          <el-option
            v-for="item in reviewOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="applyForm.review_result === 1"
        label="选择品质专员"
        prop="quality_specialist_id"
      >
        <el-tree-select
          v-model="applyForm.quality_specialist_id"
          :data="memberList"
          clearable
          filterable
          :props="defaultProps"
          :disabled="type === 'view'"
        />
      </el-form-item>
      <el-divider />
      <div
        v-if="type !== 'view'"
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
          @click="submitSampleTest"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  timestamp,
  getOrganizationList,
  formatterTime
} from '../../../../utils';
export default {
  inject: ['getTest', 'getQualityDetail', 'refreshTestSupply'],
  props: ['dialogVisible', 'title', 'type', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      applyForm: {},
      applyRules: {
        total: [
          {
            required: true,
            message: '请输入样品总数'
          }
        ],
        is_pre_production: [
          {
            required: true,
            message: '请选择'
          }
        ],
        has_manual: [
          {
            required: true,
            message: '请选择'
          }
        ],
        expected_finish_time: [
          {
            required: true,
            message: '请选择日期'
          }
        ]
      },
      reviewRules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ],
        quality_specialist_id: [
          {
            required: true,
            message: '请选择品质专员'
          }
        ]
      },
      disabled: null,
      hasOptions: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      reviewOptions: this.$global.reviewOptions,
      loading: true,
      reviewValue: 0,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      defaultTime: new Date(2000, 1, 1, 23, 59, 59)
    };
  },
  computed: {
    rules() {
      if (this.type === 'apply') {
        return this.applyRules;
      } else if (this.type === 'review') {
        return this.reviewRules;
      } else {
        return {};
      }
    }
  },
  mounted() {
    this.isDisabled();
    this.getMsg();
    this.isLoading();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    getMsg() {
      if (this.type === 'apply') {
        this.getSampleMarketList();
      } else {
        this.getSampleTestApply();
      }
    },
    async getSampleMarketList() {
      try {
        await this.$store.dispatch('sample/getSampleMarketList', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        let { sampleMarketList } = this.$store.state.sample;
        this.applyForm.sample_model = sampleMarketList.sample_model;
        this.applyForm.market = sampleMarketList.market;
      } catch (err) {
        return;
      }
    },
    async createTestApply(val) {
      let body = {
        sample_id: +this.$route.params.id,
        total: +val.total,
        expected_finish_time: timestamp(val.expected_finish_time),
        certificate_and_report: val.certificate_and_report,
        is_pre_production: val.is_pre_production,
        has_manual: val.has_manual
      };
      body['sample_id'] = +this.$route.params.id;
      try {
        await this.$store.dispatch('sample/createTestApply', body);
        this.visible = false;
        this.refreshTestSupply();
        this.getTest();
      } catch (err) {
        return;
      }
    },
    async getSampleTestApply() {
      try {
        await this.$store.dispatch('sample/getSampleTestApply', {
          params: {
            id: this.id
          }
        });
        this.applyForm = this.$store.state.sample.sampleTestApply;
        this.applyForm.expected_finish_time = formatterTime(
          this.applyForm.expected_finish_time
        );
        if (!this.applyForm.quality_specialist_id) {
          this.applyForm.quality_specialist_id = '';
        }
      } catch (err) {
        return;
      }
    },
    async reviewTestApply(val) {
      let body = val;
      body.id = this.id;
      try {
        await this.$store.dispatch('sample/reviewTestApply', body);
        this.visible = false;
        this.getTest();
        this.getQualityDetail();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    isDisabled() {
      if (this.type === 'apply') {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    isLoading() {
      if (this.type === 'apply') {
        this.loading = this.$store.state.sample.applyLoading;
      } else if (this.type === 'review') {
        this.loading = this.$store.state.sample.reviewLoading;
      }
    },
    submitSampleTest() {
      this.$refs.applyForm.validate((valid) => {
        if (valid) {
          if (this.type === 'apply') {
            this.createTestApply(this.applyForm);
          } else {
            this.reviewTestApply({
              review_result: this.applyForm.review_result,
              quality_specialist_id: this.applyForm.quality_specialist_id
            });
          }
        }
      });
    }
  }
};
</script>
