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
        prop="patentType"
      >
        <el-checkbox-group v-model="patentForm.patentType">
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
        prop="productCName"
      >
        <el-input
          v-model="patentForm.productCName"
          placeholder="请输入产品中文名"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="产品英文名"
        prop="productEName"
      >
        <el-input
          v-model="patentForm.productEName"
          placeholder="请输入产品英文名"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="国家/地区"
        prop="country"
      >
        <el-checkbox-group v-model="patentForm.country">
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
        prop="saleLink"
      >
        <el-input
          v-model="patentForm.saleLink"
          type="textarea"
          :disabled="isDisabled"
        />
      </el-form-item>
      <competitive-table />
      <el-divider />

      <el-form-item
        v-if="type === 'review'"
        label="评审结果"
        prop="result"
      >
        <el-select />
      </el-form-item>
      <div style="text-align: right">
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
  props: ['dialogVisible', 'formTitle', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      patentType: [
        {
          key: 10,
          value: '外观专利'
        },
        {
          key: 20,
          value: '发明专利'
        },
        {
          key: 30,
          value: '实用新型'
        }
      ],
      countries: [
        {
          key: 10,
          value: '美国'
        },
        {
          key: 20,
          value: '英国'
        },
        {
          key: 30,
          value: '欧盟'
        },
        {
          key: 40,
          value: '日本'
        },
        {
          key: 50,
          value: '中国'
        }
      ],
      visible: this.dialogVisible,
      patentForm: {},
      patentRules: {
        patentType: [
          {
            required: true,
            message: '请选择专利类型'
          }
        ],
        productCName: [
          {
            required: true,
            message: '请输入产品中文名'
          }
        ],
        productEName: [
          {
            required: true,
            message: '请输入产品英文名'
          }
        ],
        country: [
          {
            required: true,
            message: '请选择国家/地区'
          }
        ],
        saleLink: [
          {
            required: true,
            message: '请输入产品销售链接'
          }
        ]
      },
      reviewRules: {
        result: [
          {
            required: true,
            message: '请选择评审结果'
          }
        ]
      }
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
      if (this.type === 'review') {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitPatentApply() {
      console.log(this.patentForm.patentType, this.patentForm.country);
      this.$refs.patentForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
