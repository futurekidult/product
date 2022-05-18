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
        {{ progress.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="开模费用">
        {{ progress.cost }}
      </el-descriptions-item>
      <el-descriptions-item label="说明">
        {{ progress.illustration_text }}
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ progress.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="开模工厂">
        {{ progress.mould_factory }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div
          :class="
            changeColor(progress.state !== undefined ? progress.state : '')
          "
        >
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <div v-if="progress.state === 20 || progress.state === 40">
          <el-button
            v-if="progress.state !== 40"
            class="close-btn"
            @click="approvalMakingMould(progress.id, 0)"
          >
            不通过
          </el-button>
          <el-button
            type="success"
            :disabled="progress.state === 40"
            @click="approvalMakingMould(progress.id, 1)"
          >
            通过
          </el-button>
        </div>
        <div v-if="progress.state === 30">
          <el-button
            type="text"
            @click="
              editMakingMould(
                progress.id,
                progress.cost,
                progress.mould_factory,
                progress.estimated_finish_time,
                progress.illustration_text
              )
            "
          >
            编辑
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
    :get-list="getList"
    @hide-dialog="closeApplyForm"
  />

  <mould-form
    v-if="editFormVisible"
    title="编辑"
    :dialog-visible="editFormVisible"
    :edit-form="editForm"
    type="edit"
    :get-list="getList"
    @hide-dialog="closeEditForm"
  />
</template>

<script>
import MouldForm from '../common/mould-form.vue';
import { formatterTime } from '../../../../utils/index.js';

export default {
  components: {
    MouldForm
  },
  inject: ['getMould'],
  props: ['progress', 'changeColor', 'getList'],
  data() {
    return {
      applyFormVisible: false,
      editFormVisible: false,
      editForm: {}
    };
  },
  methods: {
    showApplyForm() {
      this.applyFormVisible = true;
    },
    closeApplyForm() {
      this.applyFormVisible = false;
    },
    editMakingMould(
      id,
      cost,
      mouldFactory,
      estimatedFinishTime,
      illustrationText
    ) {
      this.editFormVisible = true;
      this.editForm = {
        id,
        cost,
        mould_factory: mouldFactory,
        estimated_finish_time: formatterTime(estimatedFinishTime),
        illustration_text: illustrationText
      };
    },
    closeEditForm() {
      this.editFormVisible = false;
    },
    async approvalMakingMould(id, result) {
      let body = {
        id,
        approval_result: result
      };
      await this.$store.dispatch('mould/approvalMakingMould', body);
      this.getMould();
    }
  }
};
</script>
