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
          :progress="designProgress"
          :get-list="getProductDesign"
        />
      </el-tab-pane>
      <el-tab-pane
        label="手板样"
        name="prototype"
      >
        <sample-mould
          :progress="prototypeProgress"
          :get-list="getPrototype"
          :attachment="attachment"
        />
      </el-tab-pane>
      <el-tab-pane
        label="开模"
        name="mould-open"
      >
        <mould-open
          :progress="makingMould"
          :get-list="getMakingMould"
          :button-state="buttonState"
          :attachment="mouldAttachment"
        />
      </el-tab-pane>
      <el-tab-pane
        label="试模"
        name="mould-test"
      >
        <mould-test
          :progress="testingMould"
          :get-list="getTestingMould"
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
import { changeTimestamp, setEntry } from '../../../../utils/index';

export default {
  components: {
    MouldDesign,
    SampleMould,
    MouldOpen,
    MouldTest
  },
  data() {
    return {
      designProgress: {},
      prototypeProgress: {},
      attachment: [],
      makingMould: {},
      testingMould: {},
      buttonState: 0,
      mouldAttachment: {}
    };
  },
  mounted() {
    setEntry('setActiveTab', 'design');
    this.getRequest(this.$store.state.activeTab);
  },
  methods: {
    async getProductDesign() {
      this.$store.commit('mould/setDesignLoading', true);
      try {
        await this.$store.dispatch('mould/getProductDesign', {
          params: {
            mould_id: +this.$route.params.id
          }
        });
        this.designProgress = this.$store.state.mould.designProgress;
        changeTimestamp(this.designProgress, 'actual_finish_time');
      } catch (err) {
        this.$store.commit('mould/setDesignLoading', false);
        return;
      }
    },
    async getPrototype() {
      this.$store.commit('mould/setPrototypeLoading', true);
      try {
        await this.$store.dispatch('mould/getPrototype', {
          params: {
            mould_id: +this.$route.params.id
          }
        });
        this.prototypeProgress = this.$store.state.mould.prototypeProgress;
        changeTimestamp(this.prototypeProgress, 'actual_finish_time');
        this.attachment = this.prototypeProgress.prototype_file;
      } catch (err) {
        this.$store.commit('mould/setPrototypeLoading', false);
        return;
      }
    },
    async getMakingMould() {
      this.$store.commit('mould/setMakingMouldLoading', true);
      try {
        await this.$store.dispatch('mould/getMakingMould', {
          params: {
            mould_id: +this.$route.params.id
          }
        });
        this.makingMould = this.$store.state.mould.makingMouldProgress;
        this.mouldAttachment = this.makingMould.agreement_file || {};
        this.buttonState = this.makingMould.button_state;
        changeTimestamp(this.makingMould, 'actual_finish_time');
        changeTimestamp(this.makingMould, 'estimated_finish_time');
      } catch (err) {
        this.$store.commit('mould/setMakingMouldLoading', false);
        return;
      }
    },
    async getTestingMould() {
      this.$store.commit('mould/setTestingMouldLoading', true);
      try {
        await this.$store.dispatch('mould/getTestingMould', {
          params: {
            mould_id: +this.$route.params.id
          }
        });
        this.testingMould = this.$store.state.mould.testingMouldProgress;
        changeTimestamp(this.testingMould, 'actual_finish_time');
      } catch (err) {
        this.$store.commit('mould/setTestingMouldLoading', false);
        return;
      }
    },
    getRequest(val) {
      switch (val) {
        case 'design':
          this.getProductDesign();
          break;
        case 'prototype':
          this.getPrototype();
          break;
        case 'mould-open':
          this.getMakingMould();
          break;
        case 'mould-test':
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
