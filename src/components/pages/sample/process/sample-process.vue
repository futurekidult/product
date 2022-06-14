<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="基本信息"
      name="basic"
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
import { formatterTime } from '../../../../utils/index.js';

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
      activeName: 'basic',
      sampleDetail: {},
      proofingProgress: {},
      applyList: [],
      buttonState: 0
    };
  },
  mounted() {
    this.getSampleDetail();
  },
  methods: {
    async getSampleDetail() {
      this.$store.commit('sample/setBaseLoading', true);
      await this.$store.dispatch('sample/getSampleDetail', {
        params: {
          id: +this.$route.params.id
        }
      });
      this.sampleDetail = this.$store.state.sample.sampleDetail;
      this.sampleDetail.estimated_finish_time = formatterTime(
        this.sampleDetail.estimated_finish_time
      );
      this.sampleDetail.actual_finish_time = formatterTime(
        this.sampleDetail.actual_finish_time
      );
    },
    async getProofingProgress() {
      this.$store.commit('sample/setProofingLoading', true);
      await this.$store.dispatch('sample/getProofingProgress', {
        params: {
          sample_id: +this.$route.params.id
        }
      });
      this.proofingProgress = this.$store.state.sample.proofingProgress;
      this.proofingProgress.submit_time = formatterTime(
        this.proofingProgress.submit_time
      );
      this.proofingProgress.actual_finish_time = formatterTime(
        this.proofingProgress.actual_finish_time
      );
    },
    async getTestProgress() {
      this.$store.commit('sample/setTestLoading', true);
      await this.$store.dispatch('sample/getTestProgress', {
        params: {
          sample_id: +this.$route.params.id
        }
      });
      this.applyList = this.$store.state.sample.testProgress.list;
      this.buttonState = this.$store.state.sample.testProgress.button_state;
      this.applyList.forEach((item) => {
        item.submit_time = formatterTime(item.submit_time);
        item.review_finish_time = formatterTime(item.review_finish_time);
      });
    },
    handleClick(tab) {
      if (tab.props.name === 'basic') {
        this.getSampleDetail();
      } else if (tab.props.name === 'proofing') {
        this.getProofingProgress();
      } else {
        this.getTestProgress();
      }
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
