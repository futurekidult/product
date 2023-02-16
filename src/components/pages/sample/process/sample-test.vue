<template>
  <div v-loading="$store.state.sample.testLoading">
    <div>
      <div class="select-title">
        <span class="line">|</span> 测试申请
      </div>

      <test-apply-table
        type="apply"
        label="测试申请ID"
        review-btn-content="样品测试申请评审"
        title="样品测试申请进度表"
        btn-content="申请样品测试"
        :apply-list="applyList"
        :button-state="buttonState"
      />

      <test-apply-table
        type="supply"
        label="测试补充ID"
        review-btn-content="测试补充内容评审"
        title="测试需求补充进度表"
        btn-content="补充测试内容"
        :apply-list="supply.list"
        :button-state="supply.button_state"
      />
    </div>

    <div
      v-if="JSON.stringify(qualityProgress) !== '{}'"
      style="margin-top: 20px"
    >
      <div class="select-title">
        <span class="line">|</span> 测试详情
      </div>
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="品质测试"
          name="quality"
        >
          <quality-test
            v-if="activeName === 'quality'"
            :id="qualityId"
            :test-id="qualityTestId"
            :progress="qualityProgress"
            :attachment="qualityAttachment"
            :submit-state="qualitySubmitState"
            :get-progress="getQualityDetail"
            :change-color="changeColor"
          />
        </el-tab-pane>
        <el-tab-pane
          label="机构测试"
          name="agency"
        >
          <agency-test
            v-if="activeName === 'agency' && isGetData"
            :id="agencyId"
            :test-id="agencyTestId"
            :progress="agencyProgress"
            :attachment="agencyAttachment"
            :submit-state="agencySubmitState"
            :get-progress="getAgencyTest"
            :agency-value="agencyValue"
            :change-color="changeColor"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="hasUserTest"
          label="用户测试"
          name="user"
        >
          <user-test
            v-if="activeName === 'user'"
            :id="userId"
            :test-id="userTestId"
            :progress="userProgress"
            :attachment="userAttachment"
            :submit-state="userSubmitState"
            :get-progress="getUserTest"
            :button-state="userButtonState"
            :apply-list="userApplyList"
            :change-color="changeColor"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import QualityTest from './test/quality-test.vue';
import AgencyTest from './test/agency-test.vue';
import UserTest from './test/user-test.vue';
import { changeTimestamp } from '../../../../utils';
import TestApplyTable from '../common/sample-test-table.vue';

export default {
  components: {
    QualityTest,
    AgencyTest,
    UserTest,
    TestApplyTable
  },
  inject: ['getTest', 'getQualityDetail', 'getTestSupply'],
  provide() {
    return {
      getUser: this.getUserTest
    };
  },
  props: [
    'applyList',
    'buttonState',
    'qualityProgress',
    'qualityAttachment',
    'qualitySubmitState',
    'qualityId',
    'qualityTestId',
    'hasUserTest'
  ],
  data() {
    return {
      activeName: 'quality',
      agencyProgress: {},
      agencyAttachment: {},
      agencySubmitState: 0,
      agencyId: 0,
      agencyValue: -1,
      isAgency: -1,
      userProgress: {},
      userAttachment: {},
      userSubmitState: 0,
      userId: 0,
      userApplyList: [],
      userButtonState: 0,
      agencyTestId: 0,
      userTestId: 0,
      isGetData: false
    };
  },
  computed: {
    supply() {
      return this.getTestSupply().supply;
    }
  },
  methods: {
    async getAgencyTest() {
      this.$store.commit('sample/agency/setAgencyLoading', true);
      try {
        await this.$store.dispatch('sample/agency/getAgencyTest', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        let { agencyTest } = this.$store.state.sample.agency;
        this.agencyProgress = agencyTest.test_schedule;
        this.agencyAttachment = agencyTest.test_result_file;
        this.agencySubmitState = agencyTest.is_submit;
        this.agencyId = agencyTest.test_apply_id;
        this.agencyValue = agencyTest.is_agency;
        this.agencyTestId = agencyTest.id;
        changeTimestamp(this.agencyProgress, 'actual_finish_time');
        this.isGetData = true;
      } catch (err) {
        this.$store.commit('sample/agency/setAgencyLoading', false);
        return;
      }
    },
    async getUserTest() {
      this.$store.commit('sample/user/setUserLoading', true);
      try {
        await this.$store.dispatch('sample/user/getUserTest', {
          params: {
            sample_id: +this.$route.params.id
          }
        });
        let { userTest } = this.$store.state.sample.user;
        this.userProgress = userTest.test_schedule;
        this.userButtonState = userTest.button_state;
        this.userId = userTest.test_apply_id;
        this.userSubmitState = userTest.is_submit;
        this.userAttachment = userTest.test_result_file;
        this.userTestId = userTest.id;
        this.userApplyList = userTest.user_test_apply;
        this.userApplyList.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'submit_time');
          changeTimestamp(item, 'review_finish_time');
          item.user_experience_duration = `${item.user_experience_duration}天`;
        });
        changeTimestamp(this.userProgress, 'actual_finish_time');
      } catch (err) {
        this.$store.commit('sample/user/setUserLoading', false);
        return;
      }
    },
    changeColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    handleClick(tab) {
      if (tab.props.name === 'quality') {
        this.getQualityDetail();
      } else if (tab.props.name === 'agency') {
        this.getAgencyTest();
      } else {
        this.getUserTest();
      }
      this.activeName = tab.props.name;
    }
  }
};
</script>
