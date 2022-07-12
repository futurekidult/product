<template>
  <div v-loading="$store.state.sample.testLoading">
    <div>
      <div class="select-title">
        <span class="line">|</span> 测试申请
      </div>

      <div class="proofing-item">
        <div class="proofing-title">
          样品测试申请进度表
        </div>
        <el-button
          type="primary"
          :disabled="buttonState === 0"
          @click="showApplyForm"
        >
          申请样品测试
        </el-button>
      </div>
      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="applyList"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60px"
        />
        <el-table-column
          label="创建人"
          prop="creator"
        />
        <el-table-column
          label="提交时间"
          prop="submit_time"
          width="200px"
        />
        <el-table-column
          label="评审完成时间"
          prop="review_finish_time"
          width="200px"
        />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.review_state)">
              {{ scope.row.review_state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.review_state === 10"
              type="primary"
              style="width: 150px"
              @click="showReviewForm(scope.row.id)"
            >
              样品测试申请单评审
            </el-button>
            <el-button
              v-if="scope.row.review_state === 30"
              type="text"
              @click="showEditForm(scope.row.id)"
            >
              编辑
            </el-button>
            <span
              v-if="scope.row.review_state === 30"
              class="table-btn"
            >|</span>
            <el-button
              v-if="scope.row.review_state !== 10"
              type="text"
              @click="showResultForm(scope.row.id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
          label="用户测试"
          name="user"
          v-if="hasUserTest"
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
            :user-list="userList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <test-form
    v-if="testApplyVisible"
    :dialog-visible="testApplyVisible"
    title="申请样品测试"
    type="apply"
    @hide-dialog="closeApplyForm"
  />

  <test-form
    v-if="applyReviewVisible"
    :id="testId"
    :dialog-visible="applyReviewVisible"
    title="申请样品测试评审"
    type="review"
    @hide-dialog="closeReviewForm"
  />

  <test-form
    v-if="resultVisible"
    :id="testId"
    :dialog-visible="resultVisible"
    title="查看"
    type="view"
    @hide-dialog="closeResultForm"
  />

  <el-dialog
    v-model="editSpecialistVisible"
    title="编辑"
    width="20%"
    @close="closeEditForm"
  >
    <el-form
      ref="editForm"
      :model="editForm"
    >
      <el-form-item
        label="请选择品质专员"
        prop="quality_specialist_id"
        :rules="[{ required: true, message: '想选择品质专员' }]"
      >
        <el-tree-select
          v-model="editForm.quality_specialist_id"
          :data="memberList"
          clearable
          :props="defaultProps"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button class="close-btn">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitQualitySpecialist"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import QualityTest from './test/quality-test.vue';
import AgencyTest from './test/agency-test.vue';
import UserTest from './test/user-test.vue';
import TestForm from '../common/test-form.vue';
import { changeTimestamp, formatterTime, getOrganizationList } from '../../../../utils';

export default {
  components: {
    QualityTest,
    AgencyTest,
    UserTest,
    TestForm
  },
  inject: ['getTest','getQualityDetail'],
  provide() {
    return {
      getUser: this.getUserTest,
      getList: this.getUserList
    };
  },
  props: ['applyList', 'buttonState','qualityProgress','qualityAttachment','qualitySubmitState','qualityId','qualityTestId', 'hasUserTest'],
  data() {
    return {
      activeName: 'quality',
      testApplyVisible: false,
      applyReviewVisible: false,
      resultVisible: false,
      editSpecialistVisible: false,
      editForm: {},
      testId: 0,
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
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      userList: [],
      isGetData: false
    };
  },
  mounted() {
     getOrganizationList().then( (res) => {
      this.memberList = res;
    });
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
    async getQualitySpecialist(id) {
      try {
        await this.$store.dispatch('sample/getQualitySpecialist', {
          params: {
            id
          }
        });
        this.editForm.quality_specialist_id =
          this.$store.state.sample.qualitySpecialist.quality_specialist_id;
      } catch (err) {
        return;
      }
    },
    async updateQualitySpecialist(val) {
      let body = val;
      body['id'] = this.testId;
      try {
        await this.$store.dispatch('sample/updateQualitySpecialist', body);
        this.editSpecialistVisible = false;
        this.getTest();
      } catch (err) {
        return;
      }
    },
    async getUserList(currentPage = 1, pageSize = 10) {
      try {
        await this.$store.dispatch('sample/user/getUserList', {
          params: {
            sample_id: +this.$route.params.id,
            current_page: currentPage,
            page_size: pageSize
          }
        });
        this.userList = this.$store.state.sample.user.userList;
        this.userList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.delivery_time = formatterTime(item.delivery_time);
          item.upload_time = formatterTime(item.upload_time);
        });
      } catch (err) {
        return;
      }
    },
    showApplyForm() {
      this.testApplyVisible = true;
    },
    closeApplyForm() {
      this.testApplyVisible = false;
    },
    showReviewForm(id) {
      this.applyReviewVisible = true;
      this.testId = id;
    },
    closeReviewForm() {
      this.applyReviewVisible = false;
    },
    showResultForm(id) {
      this.testId = id;
      this.resultVisible = true;
    },
    closeResultForm() {
      this.resultVisible = false;
    },
    showEditForm(id) {
      this.editSpecialistVisible = true;
      this.testId = id;
      this.getQualitySpecialist(id);
    },
    closeEditForm() {
      this.editSpecialistVisible = false;
    },
    submitQualitySpecialist() {
      this.updateQualitySpecialist(this.editForm);
    },
    changeCellColor(val) {
      if (val === 30) {
        return 'result-pass';
      } else if (val === 10) {
        return 'result-ing';
      } else {
        return 'result-fail';
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
        this.getUserList();
      }
      this.activeName = tab.props.name;
    }
  }
};
</script>
