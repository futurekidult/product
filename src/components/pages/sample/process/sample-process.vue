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
        :quality-progress="qualityProgress"
        :quality-attachment="qualityAttachment"
        :quality-submit-state="qualitySubmitState"
        :quality-id="qualityId"
        :quality-test-id="qualityTestId"
        :has-user-test="hasUserTest"
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
      getTest: this.getTestProgress,
      getQualityDetail: this.getQualityDetail,
      getTestSupply: () => {
        return {
          supply: this.testSupply
        };
      },
      refreshTestSupply: this.getTestSupply,
      getTestResultSchedule: () => {
        return {
          id: this.testResultId,
          test_result_schedule: this.qualityRestResultSchedule
        };
      }
    };
  },
  data() {
    return {
      sampleDetail: {},
      proofingProgress: {},
      applyList: [],
      buttonState: 0,
      qualityProgress: {},
      qualityAttachment: {},
      qualitySubmitState: 0,
      qualityRestResultSchedule: {},
      qualityId: 0,
      progress: {},
      qualityTestId: 0,
      hasUserTest: 0,
      testSupply: {}
      testResultId: 0
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
      this.$store.commit('sample/setDetailLoading', true);
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
        this.$store.commit('sample/setDetailLoading', false);
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
        if (
          this.proofingProgress.submit_time !== undefined &&
          this.proofingProgress.actual_finish_time !== undefined
        ) {
          changeTimestamp(this.proofingProgress, 'submit_time');
          changeTimestamp(this.proofingProgress, 'actual_finish_time');
        }
      } catch (err) {
        this.$store.commit('sample/setProofingLoading', false);
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
        this.hasUserTest = testProgress.is_user_test;
        this.applyList.forEach((item) => {
          changeTimestamp(item, 'submit_time');
          changeTimestamp(item, 'review_finish_time');
        });
      } catch (err) {
        this.$store.commit('sample/setTestLoading', false);
        return;
      }
    },
    async getTestSupply() {
      try {
        await this.$store.dispatch('sample/getTestSupply', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        this.testSupply = this.$store.state.sample.supply;
      } catch (err) {
        return;
      }
    },
    async getQualityDetail() {
      this.$store.commit('sample/quality/setQualityLoading', true);
      try {
        await this.$store.dispatch('sample/quality/getQualityDetail', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        let { qualityDetail } = this.$store.state.sample.quality;
        this.testResultId = qualityDetail.id;
        this.qualityProgress = qualityDetail.test_schedule;
        this.qualityAttachment = qualityDetail.test_result_file;
        this.qualityRestResultSchedule = qualityDetail.test_result_schedule;
        this.qualitySubmitState = qualityDetail.is_submit;
        this.qualityId = qualityDetail.test_apply_id;
        this.qualityTestId = qualityDetail.id;
      if (this.qualityProgress.actual_finish_time !== undefined) {
          changeTimestamp(this.qualityProgress, 'actual_finish_time');
        }
      } catch (err) {
        this.$store.commit('sample/quality/setQualityLoading', false);
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
          this.getTestSupply();
          this.getQualityDetail();
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
