<template>
  <el-tabs
    v-model="$store.state.activeTab"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="基本信息"
      name="base"
    >
      <sample-basic
        :sample-detail="sampleDetail"
        :get-list="getSampleDetail"
        :change-color="changeCellColor"
      />
    </el-tab-pane>
    <el-tab-pane
      label="打样单"
      name="proofing"
    >
      <proofing-list :progress="proofingProgress" />
    </el-tab-pane>
    <el-tab-pane
      label="样品测试"
      name="test"
    >
      <sample-test
        :apply-list="applyList"
        :button-state="buttonState"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import SampleBasic from './samplie-basic.vue';
import ProofingList from './proofing-list.vue';
import SampleTest from './sample-test.vue';
import { changeTimestamp } from '../../../../utils/index.js';

export default {
  components: {
    SampleBasic,
    ProofingList,
    SampleTest
  },
  provide() {
    return {
      getProofing: this.getProofingProgress,
      getTest: this.getTestProgress
    };
  },
  data() {
    return {
      sampleDetail: {},
      proofingProgress: {},
      applyList: [],
      buttonState: 0
    };
  },
  mounted() {
    if (this.$store.state.entry !== 'workbench') {
      this.$store.commit('setActiveTab', 'base');
    }
    this.getRequest(this.$store.state.activeTab);
  },
  methods: {
    async getSampleDetail() {
      this.$store.commit('sample/setBaseLoading', true);
      try {
        await this.$store.dispatch('sample/getSampleDetail', {
          params: {
            id: +this.$route.params.id
          }
        });
        this.sampleDetail = this.$store.state.sample.sampleDetail;
        changeTimestamp(this.sampleDetail, 'estimated_finish_time');
        changeTimestamp(this.sampleDetail, 'actual_finish_time');
      } catch (err) {
        return;
      }
    },
    async getProofingProgress() {
      this.$store.commit('sample/setProofingLoading', true);
      try {
        await this.$store.dispatch('sample/getProofingProgress', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        this.proofingProgress = this.$store.state.sample.proofingProgress;
        changeTimestamp(this.proofingProgress, 'submit_time');
        changeTimestamp(this.proofingProgress, 'actual_finish_time');
      } catch (err) {
        return;
      }
    },
    async getTestProgress() {
      this.$store.commit('sample/setTestLoading', true);
      try {
        await this.$store.dispatch('sample/getTestProgress', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        let { testProgress } = this.$store.state.sample;
        this.applyList = testProgress.list;
        this.buttonState = testProgress.button_state;
        this.applyList.forEach((item) => {
          changeTimestamp(item, 'submit_time');
          changeTimestamp(item, 'review_finish_time');
        });
      } catch (err) {
        return;
      }
    },
    getRequest(val) {
      switch (val) {
        case 'base':
          this.getSampleDetail();
          break;
        case 'proofing':
          this.getProofingProgress();
          break;
        case 'test':
          this.getTestProgress();
          break;
        default:
      }
    },
    handleClick(tab) {
      this.getRequest(tab.props.name);
    },
    changeCellColor(val) {
      if (val === 30 || val === 1) {
        return 'result-pass';
      } else if (val === 20 || val === 10) {
        return 'result-ing';
      } else {
        return 'result-ignore';
      }
    }
  }
};
</script>
