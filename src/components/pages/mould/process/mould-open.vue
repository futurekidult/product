<template>
  <section
    v-loading="$store.state.mould.makingMouldLoading"
    class="progress-table"
  >
    <div class="open-mould_item">
      <div class="open-title">
        开模确认进度表
      </div>
      <el-button
        type="primary"
        @click="showApplyForm"
      >
        开模申请
      </el-button>
    </div>
    <el-descriptions
      border
      :column="8"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ isUndefined(progress.principal) }}
      </el-descriptions-item>
      <el-descriptions-item label="开模费用">
        {{ isUndefined(progress.cost) }}
      </el-descriptions-item>
      <el-descriptions-item label="说明">
        {{ isUndefined(progress.illustration_text) }}
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ isUndefined(progress.estimated_finish_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="开模工厂">
        {{ isUndefined(progress.mould_factory) }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ isUndefined(progress.actual_finish_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div
          :class="
            changeColor(progress.state !== undefined ? progress.state : '')
          "
        >
          {{ isUndefined(progress.state_desc) }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <div v-if="progress.state === 20">
          <el-button
            v-if="progress.state !== 40"
            class="close-button"
          >
            不通过
          </el-button>
          <el-button
            type="success"
            :disabled="progress.state === 40"
          >
            通过
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </section>

  <mould-form
    v-if="applyFormVisible"
    title="申请开模"
    :dialog-visible="applyFormVisible"
    type="create"
    @hide-dialog="closeApplyForm"
  />
</template>

<script>
import MouldForm from '../common/mould-form.vue';

export default {
  components: {
    MouldForm
  },
  props: ['progress', 'isUndefined', 'changeColor'],
  data() {
    return {
      applyFormVisible: false
    };
  },
  methods: {
    showApplyForm() {
      this.applyFormVisible = true;
    },
    closeApplyForm() {
      this.applyFormVisible = false;
    }
  }
};
</script>
