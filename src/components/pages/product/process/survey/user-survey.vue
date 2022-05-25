<template>
  <div v-loading="$store.state.product.survey.user.userLoading">
    <div class="apply-item">
      <div class="survey-title">
        调研申请表
      </div>
      <el-button
        :disabled="buttonState.apply !== 1"
        @click="showApplyForm"
      >
        用户调研申请
      </el-button>
    </div>

    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="surveyApply"
    >
      <el-table-column
        label="序号"
        type="index"
        width="60px"
      />
      <el-table-column
        label="申请人"
        prop="applicant_desc"
      />
      <el-table-column
        label="提交时间"
        prop="create_time"
      />
      <el-table-column
        label="评审完成时间"
        prop="review_finish_time"
      />
      <el-table-column
        label="评审状态"
        prop="state_desc"
      >
        <template #default="scope">
          <div :class="changeCellColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.state === 10"
            type="text"
            @click="showReviewForm(scope.row.id)"
          >
            用户调研需求评审
          </el-button>
          <el-button
            v-else
            type="text"
            @click="showViewReviewForm(scope.row.id)"
          >
            查看用户调研需求
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <div class="survey-title">
        调研进度表
      </div>

      <el-descriptions
        border
        direction="vertical"
        :column="6"
      >
        <el-descriptions-item
          label="调研负责人"
          width="200px"
        >
          {{ progress.principal_desc }}
        </el-descriptions-item>
        <el-descriptions-item
          label="计划完成时间"
          width="200px"
        >
          {{ progress.estimated_finish_time }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="progress.actual_start_time === 0"
          label="实际调研开始时间"
          width="200px"
        >
          <el-button
            type="text"
            @click="showSetTime"
          >
            填写时间
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          v-else
          label="实际调研开始时间"
          width="200px"
        >
          {{ progress.actual_start_time }}
        </el-descriptions-item>
        <el-descriptions-item
          label="实际完成时间"
          width="200px"
        >
          {{ progress.actual_finish_time }}
        </el-descriptions-item>
        <el-descriptions-item
          label="状态"
          width="200px"
        >
          <div :class="changeColor(progress.state)">
            {{ progress.state_desc }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item
          label="操作"
          width="200px"
        >
          <el-button
            v-if="buttonState.review_pass === 0"
            @click="confirmUserSurvey(progress.id)"
          >
            用户调研结果确认
          </el-button>
        </el-descriptions-item>
      </el-descriptions>

      <div
        class="apply-item"
        style="margin: 10px 0"
      >
        <div class="survey-title">
          用户调研计划表
        </div>
        <div style="display: flex; align-items: center">
          <el-button
            :disabled="buttonState.plan === 0"
            type="primary"
            @click="submitPlan"
          >
            提交计划
          </el-button>
          <div
            v-if="buttonState.plan === 0"
            style="margin-left: 12px"
          >
            <el-button
              v-if="buttonState.review_no_pass === 1"
              class="close-btn"
              @click="approvalFail"
            >
              不通过
            </el-button>
            <el-button
              type="primary"
              style="background: #379f0d; border: 1px solid #379f0d"
              :disabled="buttonState.review_pass === 0"
              @click="approvalPass"
            >
              通过
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="planList"
      >
        <el-table-column
          label="序号"
          width="60px"
          type="index"
        />
        <el-table-column
          label="事项"
          width="200px"
        >
          <template #default="scope">
            <el-select
              v-if="buttonState.plan === 1"
              v-model="scope.row.proceeding"
              placeholder="请选择"
              clearable
              @clear="clearDetail(scope.row.id)"
            >
              <el-option
                v-for="item in planOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <span v-else>{{ scope.row.proceeding_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="细节内容"
          width="300px"
        >
          <template #default="scope">
            <el-select
              v-if="buttonState.plan === 1"
              v-model="scope.row.detail"
              placeholder="请选择"
            >
              <el-option
                v-for="item in detailOptions[scope.row.proceeding].children"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <span v-else>{{ scope.row.detail_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="执行人"
          width="100px"
        >
          <template #default="scope">
            <el-select
              v-if="buttonState.plan === 1"
              v-model="scope.row.operator_desc"
            />
            <span v-else>{{ scope.row.operator_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划完成时间"
          width="250px"
        >
          <template #default="scope">
            <el-date-picker
              v-if="buttonState.plan === 1"
              v-model="scope.row.estimated_finish_time"
              type="datetime"
              placeholder="请选择时间"
            />
            <span v-else>{{ scope.row.estimated_finish_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="实际完成时间"
          width="200px"
          prop="actual_finish_time"
        />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="changeCellColor(scope.row.state)">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="结果附件"
          width="150px"
        >
          <template #default="scope">
            <div
              v-if="
                scope.row.has_approval_process === 1 ||
                  scope.row.proceeding === 1
              "
            >
              <div v-if="!scope.row.attachment">
                <el-button type="text">
                  点击上传
                </el-button>
              </div>
              <div v-if="scope.row.state !== 1">
                <el-button type="text">
                  预览
                </el-button>
                <span class="table-btn">|</span>
                <el-button type="text">
                  下载
                </el-button>
              </div>
              <div
                v-if="
                  scope.row.attachment &&
                    scope.row.state === 1 &&
                    buttonState.plan === 0
                "
              >
                <el-button type="text">
                  预览
                </el-button>
                <span class="table-btn">|</span>
                <el-button type="text">
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="是否审批环节"
          prop="has_approval_process_desc"
        />
        <el-table-column
          label="操作"
          width="200px"
        >
          <template #default="scope">
            <div v-if="scope.row.has_approval_process === 1">
              <el-button
                v-if="scope.row.state === 10"
                type="text"
                @click="approvalItemFail(scope.row.id)"
              >
                不通过
              </el-button>
              <el-button
                type="text"
                :disabled="scope.row.state !== 10"
                @click="approvalItemPass(scope.row.id)"
              >
                通过
              </el-button>
            </div>
            <div v-else>
              <el-button
                v-if="buttonState.plan === 1"
                type="text"
                @click="deletePlanItem(scope.$index + 1)"
              >
                删除
              </el-button>
              <el-button
                v-if="
                  buttonState.plan === 0 &&
                    buttonState.review_pass === 0 &&
                    scope.row.state === 10
                "
                type="text"
                @click="editOperator(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                :disabled="scope.row.state !== 10"
                @click="finishItem(scope.row.id)"
              >
                完成
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        style="margin: 15px 0"
        :disabled="buttonState.plan === 0"
        @click="addSurveyPlan"
      >
        + 新增调研计划
      </el-button>
      <el-button
        v-if="buttonState.review_pass === 0"
        style="margin: 15px; width: 128px"
        @click="addSurveyPlanItem"
      >
        提交
      </el-button>
    </div>
  </div>

  <survey-form
    v-if="isVisible"
    :id="progress.id"
    :dialog-visible="isVisible"
    form-title="用户调研申请"
    type="apply"
    @hide-dialog="closeApplyForm"
  />

  <survey-form
    v-if="isReviewVisible"
    :id="applyId"
    :dialog-visible="isReviewVisible"
    form-title="用户调研需求评审"
    type="review"
    @hide-dialog="closeReviewForm"
  />

  <survey-form
    v-if="isViewReviewVisible"
    :dialog-visible="isViewReviewVisible"
    form-title="查看用户调研需求"
    type="view"
    @hide-dialog="closeViewReviewForm"
  />

  <el-dialog
    v-model="operatorVisible"
    title="编辑"
    width="20%"
  >
    <el-form
      ref="operatorForm"
      :model="editForm"
      :rules="editRules"
    >
      <el-form-item
        label="执行人"
        prop="operator"
      >
        <el-input
          v-model="editForm.operator"
          clearable
          placeholder="请输入执行人"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          type="primary"
          @click="closeEdit"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitEdit"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="setTimeVisible"
    title="操作"
    width="20%"
  >
    <el-form
      ref="timeForm"
      :model="timeForm"
    >
      <el-form-item
        label="实际调研开始时间"
        prop="actualStartTime"
        :rules="[{ required: true, message: '请选择时间 ' }]"
      >
        <el-date-picker
          v-model="timeForm.actualStartTime"
          type="datetime"
          placeholder="请选择时间"
          clearable
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeTimeForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitTimeForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { timestamp } from '../../../../../utils';
import SurveyForm from '../../common/survey-form.vue';

export default {
  components: {
    SurveyForm
  },
  props: [
    'changeColor',
    'buttonState',
    'planList',
    'progress',
    'surveyApply',
    'length',
    'getList'
  ],
  data() {
    return {
      isVisible: false,
      isReviewVisible: false,
      isViewReviewVisible: false,
      editForm: {},
      operatorVisible: false,
      editRules: {
        operator: [
          {
            required: true,
            message: '请输入执行人'
          }
        ]
      },
      setTimeVisible: false,
      list: [],
      timeForm: {},
      applyId: 0,
      planId: 0,
      addItem: [],
      planOptions: [],
      proceedingId: 0,
      detailOptions: []
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    getParams() {
      if (localStorage.getItem('params')) {
        this.planOptions = JSON.parse(
          localStorage.getItem('params')
        ).user_survey.plan;
        this.planOptions.push({ key: 0, value: '请选择' });
        let { plan } = JSON.parse(localStorage.getItem('params')).user_survey;
        for (let key in plan) {
          let index = plan[key].key;
          this.detailOptions[index] = plan[key];
        }
      }
      this.detailOptions[0] = {
        children: [
          {
            key: 0,
            value: ''
          }
        ]
      };
    },
    async submitUserSurveyPlan(val) {
      let body = {};
      body['product_id'] = +this.$route.params.productId;
      body['plan'] = val;
      body['survey_schedule_id'] = this.progress.id;
      await this.$store.dispatch(
        'product/survey/user/submitUserSurveyPlan',
        body
      );
    },
    async addActualStarttime(val) {
      let body = {
        actual_start_time: val
      };
      body['product_id'] = +this.$route.params.productId;
      body['survey_schedule_id'] = this.progress.id;
      await this.$store.dispatch(
        'product/survey/user/addActualStarttime',
        body
      );
      this.setTimeVisible = false;
    },
    async approvalUserSurveyPlan(val) {
      let body = {
        approval_result: val
      };
      body['product_id'] = +this.$route.params.productId;
      body['survey_schedule_id'] = this.progress.id;
      await this.$store.dispatch(
        'product/survey/user/approvalUserSurveyPlan',
        body
      );
      this.getList();
    },
    async UpdatePlanOperator(val) {
      let body = {
        plan_id: val,
        user_id: this.editForm.operator
      };
      await this.$store.dispatch(
        'product/survey/user/UpdatePlanOperator',
        body
      );
      this.operatorVisible = false;
      this.getList();
    },
    async getUserSurveyResult(val) {
      let body = {
        product_id: +this.$route.params.productId,
        survey_schedule_id: val
      };
      await this.$store.dispatch('product/survey/user/confirmUserSurvey', body);
      this.getList();
    },
    async finishSurveyItem(val) {
      let body = {
        product_id: +this.$route.params.productId,
        plan_id: val
      };
      await this.$store.dispatch(
        'product/survey/user/finishChildSurveyPlan',
        body
      );
      this.getList();
    },
    async approvalSurveyItem(val, result) {
      let body = {
        plan_id: val,
        result
      };
      await this.$store.dispatch(
        'product/survey/user/approvalChildSurveyPlan',
        body
      );
      this.getList();
    },
    async updateUserSurveyPlan(val) {
      let body = {
        product_id: +this.$route.params.productId,
        survey_schedule_id: this.progress.id,
        plan: val
      };
      await this.$store.dispatch(
        'product/survey/user/updateUserSurveyPlan',
        body
      );
      this.getList();
    },
    async addUserSurveyPlan(val) {
      let body = {
        product_id: +this.$route.params.productId,
        survey_schedule_id: this.progress.id,
        plan: val
      };
      await this.$store.dispatch('product/survey/user/addUserSurveyPlan', body);
      this.getList();
    },
    showApplyForm() {
      this.isVisible = true;
    },
    closeApplyForm() {
      this.isVisible = false;
    },
    showReviewForm(id) {
      this.isReviewVisible = true;
      this.applyId = id;
    },
    closeReviewForm() {
      this.isReviewVisible = false;
    },
    showViewReviewForm() {
      this.isViewReviewVisible = true;
    },
    closeViewReviewForm() {
      this.isViewReviewVisible = false;
    },
    addSurveyPlan() {
      let row = {
        proceeding: 0
      };
      this.planList.push(row);
    },
    deletePlanItem(id) {
      this.planList.splice(id - 1, 1);
    },
    editOperator(id) {
      this.operatorVisible = true;
      this.planId = id;
    },
    closeEdit() {
      this.operatorVisible = false;
    },
    submitEdit() {
      this.$refs.operatorForm.validate((valid) => {
        if (valid) {
          this.UpdatePlanOperator(this.planId);
        }
      });
    },
    finishItem(id) {
      this.finishSurveyItem(id);
    },
    submitPlan() {
      this.planList.forEach((item) => {
        item.estimated_finish_time = timestamp(item.estimated_finish_time);
        item.actual_finish_time = timestamp(item.actual_finish_time);
      });
      if (
        this.buttonState.plan === 1 &&
        this.buttonState.review_no_pass === 1
      ) {
        this.submitUserSurveyPlan(this.planList);
      } else if (this.buttonState.review_no_pass === 0) {
        this.updateUserSurveyPlan(this.planList);
      }
      this.getList();
    },
    addSurveyPlanItem() {
      for (let i = this.length; i < this.planList.length; i++) {
        this.addItem.push(this.planList[i]);
      }
      this.addItem.forEach((item) => {
        item.estimated_finish_time = timestamp(item.estimated_finish_time);
      });
      this.addUserSurveyPlan(this.addItem);
    },
    approvalFail() {
      this.approvalUserSurveyPlan(0);
    },
    approvalPass() {
      this.approvalUserSurveyPlan(1);
    },
    showSetTime() {
      this.setTimeVisible = true;
    },
    submitTimeForm() {
      this.$refs.timeForm.validate((valid) => {
        if (valid) {
          this.addActualStarttime(this.timeForm.actualStartTime);
        }
      });
    },
    closeTimeForm() {
      this.setTimeVisible = false;
    },
    confirmUserSurvey(id) {
      this.getUserSurveyResult(id);
    },
    approvalItemPass(id) {
      this.approvalSurveyItem(id, 1);
    },
    approvalItemFail(id) {
      this.approvalSurveyItem(id, 0);
    },
    changeCellColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else if (val === 20) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    clearDetail(id) {
      this.planList.map((item) => {
        if (item.id === id) {
          item.detail = '';
        }
      });
    }
  }
};
</script>
