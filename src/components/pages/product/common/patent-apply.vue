<template>
  <el-dialog
    v-model="visible"
    :title="formTitle"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="patentForm"
      :model="patentForm"
      :rules="Rules"
      label-width="110px"
      width="30%"
    >
      <el-form-item
        label="专利类型"
        prop="patent_types"
      >
        <el-checkbox-group v-model="patentForm.patent_types">
          <el-checkbox
            v-for="(item, i) in patentType"
            :key="i"
            :label="item.key"
            :disabled="isDisabled"
          >
            {{ item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="产品中文名"
        prop="product_name_cn"
      >
        <el-input
          v-model="patentForm.product_name_cn"
          placeholder="请输入产品中文名"
          disabled
          clearable
        />
      </el-form-item>
      <el-form-item
        label="产品英文名"
        prop="product_name_en"
      >
        <el-input
          v-model="patentForm.product_name_en"
          placeholder="请输入产品英文名"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="国家/地区"
        prop="countries"
      >
        <el-checkbox-group v-model="patentForm.countries">
          <el-checkbox
            v-for="(item, i) in countries"
            :key="i"
            :label="item.key"
            :disabled="isDisabled"
          >
            {{ item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="产品销售链接"
        prop="sale_link"
      >
        <el-input
          v-model="patentForm.sale_link"
          type="textarea"
          :disabled="isDisabled"
          clearable
        />
      </el-form-item>
      <competitive-table :competitive-product="competitiveProduct" />
      <el-divider />

      <el-form-item
        v-if="type !== 'apply'"
        label="评审结果"
        prop="review_result"
      >
        <el-select
          v-model="patentForm.review_result"
          placeholder="请选择评审结果"
          clearable
          :disabled="type === 'view'"
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
          @click="submitPatentApply"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import CompetitiveTable from '../common/competitive-table.vue';

export default {
  components: {
    CompetitiveTable
  },
  props: [
    'dialogVisible',
    'formTitle',
    'type',
    'form',
    'id',
    'competitiveProduct'
  ],
  emits: ['hide-dialog'],
  injetc: ['getPatent'],
  data() {
    return {
      countries: [],
      patentType: [],
      visible: this.dialogVisible,
      patentForm: this.form,
      patentRules: {
        patent_types: [
          {
            required: true,
            message: '请选择专利类型'
          }
        ],
        product_name_cn: [
          {
            required: true,
            message: '请输入产品中文名'
          }
        ],
        product_name_en: [
          {
            required: true,
            message: '请输入产品英文名'
          }
        ],
        countries: [
          {
            required: true,
            message: '请选择国家/地区'
          }
        ],
        sale_link: [
          {
            required: true,
            message: '请输入产品销售链接'
          }
        ]
      },
      reviewRules: {
        review_result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ]
      },
      reviewOptions: [
        {
          label: '请选择',
          value: -1,
          disabled: true
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    };
  },
  computed: {
    Rules() {
      if (this.type === 'apply') {
        return this.patentRules;
      } else {
        return this.reviewRules;
      }
    },
    isDisabled() {
      if (this.type === 'review' || this.type === 'view') {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.getParams();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let { patent } = JSON.parse(localStorage.getItem('params'));
        this.countries = patent.countries;
        this.patentType = patent.type;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    async patentApply(params) {
      let body = params;
      body['product_id'] = 1;
      await this.$store.dispatch('product/patent/patentApply', body);
      this.visible = false;
      this.getPatent();
    },
    async patentReview(val) {
      let body = {
        id: this.id,
        review_result: val
      };
      await this.$store.dispatch('product/patent/patentReview', body);
      this.visible = false;
      this.getPatent();
    },
    submitPatentApply() {
      this.$refs.patentForm.validate((valid) => {
        if (valid) {
          if (this.type === 'apply') {
            this.patentApply(this.patentForm);
          } else {
            this.patentReview(this.patentForm.review_result);
          }
        }
      });
    }
  }
};
</script>
