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
            setStateColor(progress.state !== undefined ? progress.state : '')
          "
        >
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="progress.state !== 40 && progress.state !== undefined"
        label="操作"
      >
        <div>
          <div v-if="progress.state === 20 || progress.state === 40">
            <el-button
              class="close-btn"
              @click="approvalTestingMould(progress.mould_id, 0)"
            >
              不通过
            </el-button>
            <el-button
              type="success"
              @click="approvalTestingMould(progress.mould_id, 1)"
            >
              通过
            </el-button>
          </div>
          <text-btn
            v-else
            @handle-click="confirmTestingMould(progress.mould_id)"
          >
            完成
          </text-btn>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </section>
</template>

<script>
import { setStateColor } from '../../../../utils';

export default {
  inject: ['getMould'],
  props: ['progress', 'getList'],
  methods: {
    setStateColor,
    async approvalTestingMould(id, result) {
      let body = {
        mould_id: id,
        approval_result: result
      };
      try {
        await this.$store.dispatch('mould/approvalTestingMould', body);
        this.getMould();
        this.getList();
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
        this.getList();
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
