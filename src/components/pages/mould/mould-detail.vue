<template>
  <div v-loading="$store.state.mould.mouldLoading">
    <div class="border">
      <el-descriptions
        :title="mould.name"
        :column="2"
      >
        <el-descriptions-item label="创建人">
          {{ mould.creator }}
        </el-descriptions-item>
        <el-descriptions-item label="开模工厂">
          {{ mould.mould_factory }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="border">
      <div class="select-title">
        <span class="line">|</span> 模具流程
      </div>

      <div class="progress-title">
        模具流程进度表
      </div>

      <el-descriptions
        :column="4"
        direction="vertical"
        border
      >
        <el-descriptions-item label="采购员">
          {{ progress.purchase_specialist }}
        </el-descriptions-item>
        <el-descriptions-item label="计划完成时间">
          {{ progress.estimated_finish_time }}
        </el-descriptions-item>
        <el-descriptions-item label="实际完成时间">
          {{ progress.actual_finish_time }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <div :class="changeColor(progress.state)">
            {{ progress.state_desc }}
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <mould-process :change-color="changeColor" />
    </div>
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';
import MouldProcess from './process/mould-process.vue';

export default {
  components: {
    MouldProcess
  },
  provide() {
    return {
      getMould: this.getMould
    };
  },
  props: ['id'],
  data() {
    return {
      mould: {},
      progress: {}
    };
  },
  mounted() {
    this.getMould();
  },
  methods: {
    async getMould() {
      this.$store.commit('mould/setMouldLoading', true);
      try {
        await this.$store.dispatch('mould/getMould', {
          params: {
            id: +this.$route.params.id
          }
        });
        this.mould = this.$store.state.mould.mould;
        this.progress = this.mould.mould_schedule;
        this.progress.estimated_finish_time = formatterTime(
          this.progress.estimated_finish_time
        );
        this.progress.actual_finish_time = formatterTime(
          this.progress.actual_finish_time
        );
      } catch (err) {
        return;
      }
    },
    changeColor(val) {
      if (val === 40) {
        return 'result-pass';
      } else if (val === 30) {
        return 'result-fail';
      } else {
        return 'result-ing';
      }
    }
  }
};
</script>
