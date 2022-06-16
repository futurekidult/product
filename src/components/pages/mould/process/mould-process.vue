<template>
  <div style="margin: 20px 0">
    <el-tabs
      v-model="$store.state.activeTab"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="产品结构/外观设计图"
        name="design"
      >
        <mould-design
          :change-color="changeColor"
          :progress="designProgress"
          :get-list="getProductDesign"
        />
      </el-tab-pane>
      <el-tab-pane
        label="手板样"
        name="prototype"
      >
        <sample-mould
          :change-color="changeColor"
          :progress="prototypeProgress"
          :get-list="getPrototype"
          :attachment="attachment"
        />
      </el-tab-pane>
      <el-tab-pane
        label="开模"
        name="mouldopen"
      >
        <mould-open
          :change-color="changeColor"
          :progress="makingMould"
          :get-list="getMakingMould"
        />
      </el-tab-pane>
      <el-tab-pane
        label="试模"
        name="mouldtest"
      >
        <mould-test
          :change-color="changeColor"
          :progress="testingMould"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MouldDesign from './model-design.vue';
import SampleMould from './sample.vue';
import MouldOpen from './mould-open.vue';
import MouldTest from './mould-test.vue';
import { formatterTime } from '../../../../utils/index';

export default {
  components: {
    MouldDesign,
    SampleMould,
    MouldOpen,
    MouldTest
  },
  props: ['changeColor'],
  data() {
    return {
      designProgress: {},
      prototypeProgress: {},
      attachment: [],
      makingMould: {},
      testingMould: {}
    };
  },
  mounted() {
    if (this.$store.state.entry !== 'workbench') {
      this.$store.commit('setActiveTab', 'design');
    }
    this.getRequest(this.$store.state.activeTab);
  },
  methods: {
    async getProductDesign() {
      this.$store.commit('mould/setDesignLoading', true);
      await this.$store.dispatch('mould/getProductDesign', {
        params: {
          mould_id: +this.$route.params.id
        }
      });
      this.designProgress = this.$store.state.mould.designProgress;
      this.designProgress.actual_finish_time = formatterTime(
        this.designProgress.actual_finish_time
      );
    },
    async getPrototype() {
      this.$store.commit('mould/setPrototypeLoading', true);
      await this.$store.dispatch('mould/getPrototype', {
        params: {
          mould_id: +this.$route.params.id
        }
      });
      this.prototypeProgress = this.$store.state.mould.prototypeProgress;
      this.prototypeProgress.actual_finish_time = formatterTime(
        this.prototypeProgress.actual_finish_time
      );
      this.attachment = this.prototypeProgress.prototype_file;
    },
    async getMakingMould() {
      this.$store.commit('mould/setMakingMouldLoading', true);
      await this.$store.dispatch('mould/getMakingMould', {
        params: {
          mould_id: +this.$route.params.id
        }
      });
      this.makingMould = this.$store.state.mould.makingMouldProgress;
      this.makingMould.actual_finish_time = formatterTime(
        this.makingMould.actual_finish_time
      );
      this.makingMould.estimated_finish_time = formatterTime(
        this.makingMould.estimated_finish_time
      );
    },
    async getTestingMould() {
      this.$store.commit('mould/setTestingMouldLoading', true);
      await this.$store.dispatch('mould/getTestingMould', {
        params: {
          mould_id: +this.$route.params.id
        }
      });
      this.testingMould = this.$store.state.mould.testingMouldProgress;
      this.testingMould.actual_finish_time = formatterTime(
        this.testingMould.actual_finish_time
      );
    },
    getRequest(val) {
      switch (val) {
        case 'design':
          this.getProductDesign();
          break;
        case 'prototype':
          this.getPrototype();
          break;
        case 'mouldopen':
          this.getMakingMould();
          break;
        case 'mouldtest':
          this.getTestingMould();
          break;
        default:
      }
    },
    handleClick(tab) {
      this.getRequest(tab.props.name);
    }
  }
};
</script>
