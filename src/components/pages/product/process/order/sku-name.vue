<template>
  <div v-loading="$store.state.product.order.skuLoading">
    <div class="order-title">
      SKU命名进度表
    </div>

    <el-descriptions
      border
      :column="3"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ schedule.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="完成时间">
        {{ schedule.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(schedule.state)">
          {{ schedule.state_desc }}
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="skuForm"
      label-width="150px"
      style="width: 60%; margin: 20px 0"
      :model="form"
      :rules="skuRules"
    >
      <div
        v-for="(item, index) in form.sku"
        :key="index"
        style="display: flex"
      >
        <el-form-item
          :label="'平台' + (index + 1)"
          :prop="`sku.${index}.platform`"
          :rules="skuRules.platform"
        >
          <el-select
            v-model="item.platform"
            placeholder="请选择平台"
            :disabled="isDisabled"
            clearable
            @change="clearSku(index)"
          >
            <el-option
              v-for="content in $store.state.platform"
              :key="content.platform"
              :label="content.platform_desc"
              :value="content.platform"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'SKU命名' + (index + 1)"
          :prop="`sku.${index}.name`"
          :rules="skuRules.name"
        >
          <el-input
            v-model="item.name"
            placeholder="请输入SKU名"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
        <base-delete
          :id="index"
          mode="order-delete_btn"
          content=""
          :show="deleteVisible && schedule.state !== 40"
          :list="form.sku"
          @get-list="getFormSku"
        />
      </div>
      <el-form-item v-if="schedule.state !== 40">
        <el-button
          :disabled="isDisabled"
          @click="addSku"
        >
          + 新增SKU
        </el-button>
      </el-form-item>
      <el-form-item
        label="实际项目计划书"
        prop="project_plan_file"
      >
        <base-upload
          type="file"
          tag="实际项目计划书"
          url="project-plan"
          :file="file"
          :is-disabled="isDisabled"
          @get-file="getUploadFile"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="submitSkuForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>

    <div class="order-title">
      SKU录入进度表
    </div>

    <el-descriptions
      border
      :column="4"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ skuEntrySchedule.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ skuEntrySchedule.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(skuEntrySchedule.state)">
          {{ skuEntrySchedule.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="
          skuEntrySchedule.state !== 40 && skuEntrySchedule.state !== undefined
        "
        label="操作"
      >
        <el-button
          type="text"
          @click="completeEntry"
        >
          完成SKU录入甲骨文
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  inject: ['getSku', 'changeColor', 'getProgress'],
  props: ['skuForm', 'attachment', 'skuEntrySchedule', 'schedule', 'skuId'],
  data() {
    return {
      skuRules: {
        platform: [
          {
            required: true,
            message: '请选择平台'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入SKU命名'
          }
        ],
        project_plan_file: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      file: this.attachment,
      form: this.skuForm,
      deleteVisible: false
    };
  },
  computed: {
    isDisabled() {
      return this.schedule.state === 40 ? true : false;
    }
  },
  watch: {
    attachment(val) {
      this.file = val;
    },
    skuForm(val) {
      this.form = val;
      this.form.sku = this.form.sku || [{}];
    }
  },
  methods: {
    async updateSkuname(val) {
      let body = {};
      body['sku_info'] = {};
      body['sku_info']['sku'] = val.sku;
      body['order_id'] = +this.$route.params.orderId;
      body['sku_info']['project_plan_file'] = this.file.id;
      try {
        await this.$store.dispatch('product/order/submitSkuname', body);
        this.getSku();
      } catch (err) {
        return;
      }
    },
    submitSkuForm() {
      this.form.project_plan_file = this.file.id;
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          this.updateSkuname(this.form);
        }
      });
    },
    async completeEntry() {
      try {
        await this.$store.dispatch('product/order/completeSkuEntry', {
          id: this.skuId
        });
        this.getSku();
        this.getProgress();
      } catch (err) {
        return;
      }
    },
    addSku() {
      this.form.sku.push({});
      if (this.form.sku.length > 1) {
        this.deleteVisible = true;
      }
    },
    clearSku(index) {
      this.form.sku[index].name = '';
    },
    getFormSku(val) {
      this.form.sku = val;
    },
    getUploadFile(e) {
      this.file = e;
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
