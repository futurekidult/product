<template>
  <div style="margin: 20px 0">
    <el-tabs
      v-model="activeName"
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
          :is-undefined="isUndefined"
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
          :is-undefined="isUndefined"
          :get-list="getPrototype"
          :attachment="attachment"
        />
      </el-tab-pane>
      <el-tab-pane
        label="开模"
        name="open"
      >
        <mould-open
          :change-color="changeColor"
          :progress="makingMould"
          :is-undefined="isUndefined"
          :get-list="getMakingMould"
        />
      </el-tab-pane>
      <el-tab-pane
        label="试模"
        name="test"
      >
        <mould-test
          :change-color="changeColor"
          :progress="testingMould"
          :is-undefined="isUndefined"
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
      activeName: 'design',
      designProgress: {},
      prototypeProgress: {},
      attachment: [],
      makingMould: {},
      testingMould: {}
    };
  },
  mounted() {
    this.getProductDesign();
  },
  methods: {
    async getProductDesign() {
      await this.$store.dispatch('mould/getProductDesign', {
        params: {
          mould_id: +this.$route.params.id
        }
      });
      this.designProgress = this.$store.state.mould.designProgress;
    },
    async getPrototype() {
      await this.$store.dispatch('mould/getPrototype', {
        params: {
          mould_id: +this.$route.params.id
        }
      });
      this.prototypeProgress = this.$store.state.mould.prototypeProgress;
      this.attachment = this.prototypeProgress.prototype_file;
    },
    async getMakingMould() {
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
    handleClick(tab) {
      if (tab.props.name === 'design') {
        this.$store.commit('mould/setDesignLoading', true);
        this.getProductDesign();
      } else if (tab.props.name === 'prototype') {
        this.$store.commit('mould/setPrototypeLoading', true);
        this.getPrototype();
      } else if (tab.props.name === 'open') {
        this.$store.commit('mould/setMakingMouldLoading', true);
        this.getMakingMould();
      } else {
        this.$store.commit('mould/setTestingMouldLoading', true);
        this.getTestingMould();
      }
    },
    isUndefined(val) {
      if (val !== undefined) {
        return val;
      }
    }
  }
};
</script>
