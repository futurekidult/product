<template>
  <div v-loading="$store.state.sample.proofingLoading">
    <div class="select-title">
      <span class="line">|</span> 打样信息
    </div>

    <div class="proofing-item">
      <div class="proofing-title">
        打样进度表
      </div>
      <el-button
        :disabled="JSON.stringify(progress) !== 40"
        type="primary"
        @click="showProofingCreate"
      >
        提交打样单
      </el-button>
    </div>

    <el-descriptions
      border
      :column="5"
      direction="vertical"
    >
      <el-descriptions-item label="创建人">
        {{ progress.creator }}
      </el-descriptions-item>
      <el-descriptions-item label="提交时间">
        {{ progress.submit_time }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div :class="changeColor(progress.state)">
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        label="操作"
        width="200px"
      >
        <div :class="progress.state === undefined ? 'hide' : ''">
          <el-button
            v-if="progress.state === 20"
            type="text"
            @click="showProofingApproval"
          >
            打样单审批
          </el-button>
          <el-button
            v-if="progress.state === 30"
            type="text"
            @click="showProofingEdit"
          >
            重新编辑
          </el-button>
          <el-button
            v-if="progress.state === 40"
            type="text"
            @click="showProofingView"
          >
            查看
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>

  <sample-form
    v-if="proofingVisible"
    :dialog-visible="proofingVisible"
    title="提交打样单"
    type="create"
    @hide-dialog="closeProofingCreate"
  />

  <sample-form
    v-if="proofingApprovalVisible"
    :dialog-visible="proofingApprovalVisible"
    title="打样单审批"
    type="approval"
    @hide-dialog="closeProofingApproval"
  />

  <sample-form
    v-if="proofingEditVisible"
    :dialog-visible="proofingEditVisible"
    title="重新编辑"
    type="edit"
    @hide-dialog="closeProofingEdit"
  />

  <sample-form
    v-if="proofingViewVisible"
    :dialog-visible="proofingViewVisible"
    title="查看"
    type="view"
    @hide-dialog="closeProofingView"
  />
</template>

<script>
import SampleForm from '../common/sample-form.vue';

export default {
  components: {
    SampleForm
  },
  props: ['progress'],
  data() {
    return {
      proofingVisible: false,
      proofingApprovalVisible: false,
      proofingEditVisible: false,
      proofingViewVisible: false
    };
  },

  methods: {
    showProofingCreate() {
      this.proofingVisible = true;
    },
    closeProofingCreate() {
      this.proofingVisible = false;
    },
    showProofingApproval() {
      this.proofingApprovalVisible = true;
    },
    closeProofingApproval() {
      this.proofingApprovalVisible = false;
    },
    showProofingEdit() {
      this.proofingEditVisible = true;
    },
    closeProofingEdit() {
      this.proofingEditVisible = false;
    },
    showProofingView() {
      this.proofingViewVisible = true;
    },
    closeProofingView() {
      this.proofingViewVisible = false;
    },
    changeColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
