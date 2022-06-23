<template>
  <section
    v-loading="$store.state.mould.testingMouldLoading"
    class="progress-table"
  >
    <div class="test-title">
      试模确认进度表
    </div>

    <el-descriptions
      :column="4"
      direction="vertical"
      border
    >
      <el-descriptions-item label="任务负责人">
        {{ progress.principal }}
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
        <div :class="progress.state === undefined ? 'hide' : ''">
          <div v-if="progress.state === 20 || progress.state === 40">
            <el-button
              v-if="progress.state !== 40"
              class="close-btn"
              @click="approvalTestingMould(progress.mould_id, 0)"
            >
              不通过
            </el-button>
            <el-button
              :disabled="progress.state === 40"
              type="success"
              @click="approvalTestingMould(progress.mould_id, 1)"
            >
              通过
            </el-button>
          </div>
          <el-button
            v-if="progress.state === 30"
            type="primary"
            @click="confirmTestingMould(progress.mould_id)"
          >
            完成
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </section>
</template>

<script>
export default {
  inject: ['getMould'],
  props: ['changeColor', 'progress'],
  methods: {
    async approvalTestingMould(id, result) {
      let body = {
        id,
        approval_result: result
      };
      try {
        await this.$store.dispatch('mould/approvalTestingMould', body);
        this.getMould();
      } catch (err) {
        return;
      }
    },
    async confirmTestingMould(id) {
      try {
        await this.$store.dispatch('mould/confirmTestingMould', {
          mould_id: id
        });
        this.getMould();
      } catch (err) {
        return;
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
