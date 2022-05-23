<template>
  <el-form
    :model="passForm"
    label-width="100px"
  >
    <section>
      <el-form-item label="是否为新品类">
        <el-radio
          v-model="passForm.isNew"
          label="1"
        >
          是
        </el-radio>
        <el-radio
          v-model="passForm.isNew"
          label="2"
        >
          否
        </el-radio>
      </el-form-item>
      <el-form-item label="是否为新产品">
        <el-radio
          v-model="passForm.isNewProduct"
          label="1"
        >
          是
        </el-radio>
        <el-radio
          v-model="passForm.isNewProduct"
          label="2"
        >
          否
        </el-radio>
      </el-form-item>
      <el-form-item label="市场">
        <el-input v-model="passForm.market" />
      </el-form-item>
      <el-form-item label="平台">
        <el-checkbox-group v-model="passForm.platform">
          <el-checkbox
            label="Amazon"
            name="platform"
          />
          <el-checkbox
            name="platform"
            label="Wayfair"
          />
          <el-checkbox
            name="platform"
            label="Walmart"
          />
          <el-checkbox
            name="platform"
            label="Homedeport"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button>+ 新增市场</el-button>
      </el-form-item>
    </section>

    <el-divider />

    <section>
      <div>
        <el-form-item label="市场调研">
          <el-date-picker
            v-model="passForm.marketResearch"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户分析">
          <el-date-picker
            v-model="passForm.userAnalysis"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="风险调研">
          <el-date-picker
            v-model="passForm.riskASurvey"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="平台调研">
          <el-date-picker
            v-model="passForm.platformSurvey"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="产品方案">
          <el-date-picker
            v-model="passForm.productSchema"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户调研">
          <el-date-picker
            v-model="passForm.userSurvey"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
      </div>
    </section>

    <el-divider />

    <section>
      <span>相关人员</span>
    </section>
    <el-button type="primary">
      提交
    </el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      passForm: {
        isNew: '',
        isNewProduct: '',
        market: '',
        platform: [],
        marketResearch: '',
        userAnalysis: '',
        riskSurvey: '',
        platformSurvey: '',
        productSchema: '',
        userSurvey: ''
      }
    };
  }
};
</script>
