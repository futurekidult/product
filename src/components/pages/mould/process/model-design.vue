<template>
  <section
    v-loading="$store.state.mould.designLoading"
    class="progress-table"
  >
    <div class="design-title">
      产品结构/外观设计图确认进度表
    </div>
    <el-descriptions
      border
      :column="5"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ progress.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="结果附件">
        {{ progress.product_design_path }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="progress.state !== 40"
        label="操作"
      >
        <el-button
          type="text"
          :class="progress.state === undefined ? 'hide' : ''"
          @click="showDesignForm"
        >
          上传设计图
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog
      v-model="designFormVisible"
      width="30%"
      title="上传设计图"
      :close-on-click-modal="false"
    >
      <el-form
        ref="designForm"
        :model="designForm"
        label-width="100px"
      >
        <el-form-item
          label="文件路径"
          prop="product_design_path"
          :rules="[{ required: true, message: '请输入内容' }]"
        >
          <el-input
            v-model="designForm.product_design_path"
            type="textarea"
            :rows="6"
            placeholder="请输入文件路径"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <div style="font-size: 10px">
            注：请填写结果文件所在公司盘位置
          </div>
        </el-form-item>
        <el-divider />
        <div style="text-align: center">
          <el-button
            class="close-btn"
            @click="closedesignForm"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitResult"
          >
            确定
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
export default {
  props: ['changeColor', 'progress', 'getList'],
  data() {
    return {
      designFormVisible: false,
      designForm: {}
    };
  },
  methods: {
    async createProductDesign(val) {
      let body = val;
      body['mould_id'] = +this.$route.params.id;
      try {
        await this.$store.dispatch('mould/createProductDesign', body);
        this.designFormVisible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    showDesignForm() {
      this.designFormVisible = true;
    },
    closedesignForm() {
      this.designFormVisible = false;
    },
    submitResult() {
      this.$refs.designForm.validate((valid) => {
        if (valid) {
          this.createProductDesign(this.designForm);
        }
      });
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
