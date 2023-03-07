<template>
  <div>
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
      <base-table
        :table-data="surveyApply"
        :pagination-visible="false"
        :table-column="tableColumn"
      >
        <template #default="slotProps">
          <text-btn
            v-if="slotProps.row.state === 10"
            @handle-click="showReviewForm(slotProps.row.id)"
          >
            用户调研需求评审
          </text-btn>
          <text-btn
            v-else
            @handle-click="showViewReviewForm(slotProps.row.id)"
          >
            查看用户调研需求
          </text-btn>
        </template>
      </base-table>
      <div v-if="buttonState.apply === 0">
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
            v-if="progress.state === 10 && !progress.actual_start_time"
            label="实际调研开始时间"
            width="200px"
          >
            <text-btn @handle-click="showSetTime">
              填写时间
            </text-btn>
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
            <div :class="setSurveyScheduleStateColor(progress.state)">
              {{ progress.state_desc }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item
            v-if="progress.state === 40"
            label="操作"
            width="200px"
          >
            <text-btn
              :disabled="progress.state === 50"
              @handle-click="confirmUserSurvey(progress.id)"
            >
              用户调研结果确认
            </text-btn>
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
                v-if="progress.state < 40"
                type="success"
                :disabled="buttonState.review_pass === 0"
                @click="approvalPass"
              >
                通过
              </el-button>
            </div>
          </div>
        </div>
        <el-form
          ref="form"
          :model="form"
          :rules="form.rules"
        >
          <el-table
            border
            stripe
            empty-text="无数据"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            :data="form.planList"
          >
            <el-table-column
              fixed
              label="序号"
              width="100"
              type="index"
            />
            <el-table-column
              fixed
              label="事项"
              min-width="250"
            >
              <template #default="scope">
                <el-form-item
                  v-if="
                    progress.state === 10 ||
                      progress.state === 30 ||
                      (progress.state === 40 && !scope.row.id)
                  "
                  :prop="'planList.' + scope.$index + '.proceeding'"
                  :rules="form.rules.proceeding"
                >
                  <el-select
                    v-model="scope.row.proceeding"
                    placeholder="请选择"
                    clearable
                    @clear="clearDetail(scope.row.proceeding)"
                  >
                    <el-option
                      v-for="item in planOptions"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
                <span v-else>{{ scope.row.proceeding_desc }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed
              label="细节内容"
              min-width="300"
            >
              <template #default="scope">
                <el-form-item
                  v-if="
                    progress.state === 10 ||
                      progress.state === 30 ||
                      (progress.state === 40 && !scope.row.id)
                  "
                  :prop="'planList.' + scope.$index + '.detail'"
                  :rules="form.rules.detail"
                >
                  <el-select
                    v-model="scope.row.detail"
                    placeholder="请选择"
                    clearable
                    @focus="selectProceeding(scope.row.proceeding)"
                  >
                    <el-option
                      v-for="item in detailOptions[Number(scope.row.proceeding)]
                        .children"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <span v-else>{{ scope.row.detail_desc }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="执行人"
              width="150"
            >
              <template #default="scope">
                <el-form-item
                  v-if="
                    progress.state === 10 ||
                      progress.state === 30 ||
                      (progress.state === 40 && !scope.row.id)
                  "
                  :prop="'planList.' + scope.$index + '.operator_id'"
                  :rules="form.rules.operator_id"
                >
                  <el-tree-select
                    v-model="scope.row.operator_id"
                    :data="memberList"
                    clearable
                    filterable
                    :props="defaultProps"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.operator_desc }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="计划完成时间"
              width="250"
            >
              <template #default="scope">
                <el-form-item
                  v-if="
                    progress.state === 10 ||
                      progress.state === 30 ||
                      (progress.state === 40 && !scope.row.id)
                  "
                  :prop="'planList.' + scope.$index + '.estimated_finish_time'"
                  :rules="form.rules.estimated_finish_time"
                >
                  <el-date-picker
                    v-model="scope.row.estimated_finish_time"
                    type="datetime"
                    placeholder="请选择时间"
                    :default-time="$global.defaultTime"
                    :disabled-date="setDisabledDate"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.estimated_finish_time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="实际完成时间"
              width="250"
              prop="actual_finish_time"
            />
            <el-table-column
              label="状态"
              width="100"
            >
              <template #default="scope">
                <div :class="changeTableCellColor(scope.row.state)">
                  {{ scope.row.state_desc }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="结果附件"
              min-width="150"
            >
              <template
                v-if="progress.state >= 40"
                #default="scope"
              >
                <div
                  v-if="
                    scope.row.has_approval_process === 1 ||
                      scope.row.proceeding === 1
                  "
                  style="display: flex"
                >
                  <div v-if="JSON.stringify(scope.row.attachment) === '{}'">
                    <el-upload
                      action
                      :show-file-list="false"
                      :http-request="
                        (e) =>
                          handleFileSuccess(
                            e,
                            scope.row.attachment,
                            scope.row.id
                          )
                      "
                    >
                      <text-btn> 上传 </text-btn>
                    </el-upload>
                  </div>
                  <div
                    v-if="
                      (scope.row.state >= 40 || scope.row.state === 20) &&
                        scope.row.attachment.type === 12860
                    "
                  >
                    <text-btn
                      @handle-click="
                        previewOrDownload(
                          scope.row.attachment.id,
                          scope.row.attachment.name,
                          'preview'
                        )
                      "
                    >
                      预览
                    </text-btn>
                    <span class="table-btn">|</span>
                  </div>
                  <div
                    v-if="
                      JSON.stringify(scope.row.attachment) !== '{}' &&
                        (scope.row.state === 10 || scope.row.state === 30)
                    "
                  >
                    <text-btn @handle-click="deleteFile(scope.row.id)">
                      删除
                    </text-btn>
                    <span class="table-btn">|</span>
                    <text-btn
                      v-if="scope.row.attachment.type === 12860"
                      @handle-click="
                        previewOrDownload(
                          scope.row.attachment.id,
                          scope.row.attachment.name,
                          'preview'
                        )
                      "
                    >
                      预览
                    </text-btn>
                    <span
                      v-if="scope.row.attachment.type === 12860"
                      class="table-btn"
                    >|</span>
                  </div>
                  <div v-if="JSON.stringify(scope.row.attachment) !== '{}'">
                    <text-btn
                      @handle-click="
                        previewOrDownload(
                          scope.row.attachment.id,
                          scope.row.attachment.name,
                          'download'
                        )
                      "
                    >
                      下载
                    </text-btn>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="是否审批环节"
              prop="has_approval_process_desc"
              min-width="120"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template #default="scope">
                <div
                  v-if="
                    scope.row.state === 20 ||
                      (scope.row.state >= 40 &&
                        scope.row.has_approval_process === 1)
                  "
                >
                  <el-button
                    v-if="scope.row.state === 20"
                    @click="approvalItemFail(scope.row.id)"
                  >
                    不通过
                  </el-button>
                  <el-button
                    type="success"
                    style="width: 60px"
                    :disabled="scope.row.state >= 40"
                    @click="approvalItemPass(scope.row.id)"
                  >
                    通过
                  </el-button>
                </div>
                <div v-else>
                  <text-btn
                    v-if="
                      progress.state === 10 ||
                        progress.state === 30 ||
                        (progress.state === 40 && !scope.row.id)
                    "
                    @handle-click="deletePlanItem(scope.$index + 1)"
                  >
                    删除
                  </text-btn>
                  <el-button
                    v-if="
                      buttonState.plan === 0 &&
                        buttonState.review_pass === 0 &&
                        (scope.row.state === 10 || scope.row.state === 30)
                    "
                    @click="editOperator(scope.row.id, scope.row.operator_id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="
                      buttonState.plan === 0 &&
                        buttonState.review_pass === 0 &&
                        scope.row.state !== 20 &&
                        scope.row.id
                    "
                    type="primary"
                    style="width: 60px"
                    :disabled="scope.row.state >= 40"
                    @click="finishItem(scope.row.id)"
                  >
                    完成
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-button
          style="margin: 15px 0"
          :disabled="progress.state === 50 || progress.state === 20"
          @click="addSurveyPlan"
        >
          + 新增调研计划
        </el-button>
        <el-button
          v-if="buttonState.review_pass === 0 && buttonState.plan === 0"
          style="margin: 15px; width: 128px"
          :disabled="progress.state === 50"
          @click="addSurveyPlanItem"
        >
          提交
        </el-button>
      </div>
    </div>

    <survey-suggestion
      v-if="progress.state === 50"
      :ids="$store.state.product.survey.user.ids"
      type="user-survey"
    />

    <survey-form
      v-if="isVisible"
      :id="progress.id"
      :dialog-visible="isVisible"
      form-title="用户调研申请"
      type="apply"
      :close-on-click-modal="false"
      @hide-dialog="closeApplyForm"
    />

    <survey-form
      v-if="isReviewVisible"
      :id="applyId"
      :dialog-visible="isReviewVisible"
      form-title="用户调研需求评审"
      type="review"
      :close-on-click-modal="false"
      @hide-dialog="closeReviewForm"
    />

    <survey-form
      v-if="isViewReviewVisible"
      :id="viewId"
      :dialog-visible="isViewReviewVisible"
      form-title="查看用户调研需求"
      type="view"
      :close-on-click-modal="false"
      @hide-dialog="closeViewReviewForm"
    />

    <el-dialog
      v-model="operatorVisible"
      title="编辑"
      width="25%"
      :close-on-click-modal="false"
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
          <el-tree-select
            v-model="editForm.operator"
            :data="memberList"
            clearable
            filterable
            :props="defaultProps"
          />
        </el-form-item>
        <el-divider />
        <div style="text-align: right">
          <el-button
            class="close-btn"
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
      width="30%"
      :close-on-click-modal="false"
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
            style="width: 100%"
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
  </div>
</template>

<script>
import {
  getFile,
  timestamp,
  setDisabledDate,
  getOrganizationList,
  setReviewStateColor,
  previewOrDownloadFile,
  setSurveyScheduleStateColor
} from '../../../../../utils';
import SurveyForm from '../../common/survey-form.vue';
import SurveySuggestion from '../../common/survey-suggestion.vue';

export default {
  components: {
    SurveyForm,
    SurveySuggestion
  },
  inject: ['getBase'],
  props: [
    'buttonState',
    'planList',
    'progress',
    'surveyApply',
    'length',
    'getList',
    'userId'
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
      detailOptions: [],
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      viewId: 0,
      form: {
        rules: {
          proceeding: [{ required: true, message: '请选择' }],
          detail: [{ required: true, message: '请选择' }],
          operator_id: [{ required: true, message: '请选择' }],
          estimated_finish_time: [{ required: true, message: '请选择日期' }]
        },
        planList: this.planList
      },
      tableColumn: [
        {
          label: '调研申请ID',
          prop: 'id',
          width: 100,
          fixed: 'left'
        },
        {
          label: '申请人',
          prop: 'applicant_desc'
        },
        {
          label: '提交时间',
          prop: 'review_finish_time',
          width: 200
        },
        {
          label: '评审完成时间',
          prop: 'create_time',
          width: 200
        },
        {
          label: '评审状态',
          prop: 'state',
          fixed: 'right',
          formatter: (row) => {
            return setReviewStateColor(row.state);
          },
          getSpecialProp: (row) => {
            return row.state_desc;
          }
        }
      ]
    };
  },
  watch: {
    planList(val) {
      this.form.planList = val;
    }
  },
  mounted() {
    this.getParams();
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
    setDisabledDate,
    setSurveyScheduleStateColor,
    async getParams() {
      if (localStorage.getItem('params')) {
        this.planOptions = JSON.parse(
          localStorage.getItem('params')
        ).user_survey.plan;
        for (let key in this.planOptions) {
          let index = this.planOptions[key].key;
          this.detailOptions[index] = this.planOptions[key];
        }
      } else {
        try {
          await this.$store.dispatch('getSystemParameters');
          this.getParams();
        } catch (err) {
          return;
        }
      }
      this.planOptions.push({ key: 0, value: '请选择', disabled: true });
      this.detailOptions[0] = {
        children: [
          {
            key: '',
            value: ''
          }
        ]
      };
    },
    async submitUserSurveyPlan(body) {
      try {
        await this.$store.dispatch(
          'product/survey/user/submitUserSurveyPlan',
          body
        );
        this.getList();
      } catch (err) {
        return;
      }
    },
    async addActualStarttime(val) {
      let body = {
        actual_start_time: timestamp(val)
      };
      body['product_id'] = +this.$route.params.productId;
      body['survey_schedule_id'] = this.progress.id;
      try {
        await this.$store.dispatch(
          'product/survey/user/addActualStarttime',
          body
        );
        this.setTimeVisible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async approvalUserSurveyPlan(val) {
      let body = {
        approval_result: val
      };
      body['product_id'] = +this.$route.params.productId;
      body['survey_schedule_id'] = this.progress.id;
      try {
        await this.$store.dispatch(
          'product/survey/user/approvalUserSurveyPlan',
          body
        );
        this.getList();
      } catch (err) {
        return;
      }
    },
    async UpdatePlanOperator(val) {
      let body = {
        plan_id: val,
        user_id: this.editForm.operator
      };
      try {
        await this.$store.dispatch(
          'product/survey/user/UpdatePlanOperator',
          body
        );
        this.operatorVisible = false;
        this.getList();
      } catch (err) {
        return;
      }
    },
    async getUserSurveyResult(val) {
      let body = {
        product_id: +this.$route.params.productId,
        survey_schedule_id: val
      };
      try {
        await this.$store.dispatch(
          'product/survey/user/confirmUserSurvey',
          body
        );
        this.getList();
        this.getBase();
      } catch (err) {
        return;
      }
    },
    async finishSurveyItem(val) {
      let body = {
        product_id: +this.$route.params.productId,
        plan_id: val
      };
      try {
        await this.$store.dispatch(
          'product/survey/user/finishChildSurveyPlan',
          body
        );
        this.getList();
      } catch (err) {
        return;
      }
    },
    async approvalSurveyItem(val, result) {
      let body = {
        plan_id: val,
        result
      };
      try {
        await this.$store.dispatch(
          'product/survey/user/approvalChildSurveyPlan',
          body
        );
        this.getList();
      } catch (err) {
        return;
      }
    },
    async updateUserSurveyPlan(body) {
      try {
        await this.$store.dispatch(
          'product/survey/user/updateUserSurveyPlan',
          body
        );
        this.getList();
      } catch (err) {
        return;
      }
    },
    async addUserSurveyPlan(val) {
      let body = {
        product_id: +this.$route.params.productId,
        survey_schedule_id: this.progress.id,
        plan: val
      };
      try {
        await this.$store.dispatch(
          'product/survey/user/addUserSurveyPlan',
          body
        );
        this.getList();
        this.addItem.length = 0;
      } catch (err) {
        this.addItem.length = 0;
        return;
      }
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
    showViewReviewForm(id) {
      this.isViewReviewVisible = true;
      this.viewId = id;
    },
    closeViewReviewForm() {
      this.isViewReviewVisible = false;
    },
    addSurveyPlan() {
      let row = {
        id: null,
        proceeding: 0,
        operator_id: this.userId
      };
      this.form.planList.push(row);
    },
    deletePlanItem(id) {
      this.form.planList.splice(id - 1, 1);
    },
    editOperator(id, operator) {
      this.operatorVisible = true;
      this.planId = id;
      this.editForm.operator = operator;
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          let planArr = JSON.parse(JSON.stringify(this.form.planList));
          planArr.forEach((item) => {
            item.estimated_finish_time = timestamp(item.estimated_finish_time);
            if (item.actual_finish_time) {
              item.actual_finish_time = timestamp(item.actual_finish_time);
            }
          });
          let val = {
            product_id: +this.$route.params.productId,
            survey_schedule_id: this.progress.id,
            plan: planArr
          };
          if (this.progress.state !== 30) {
            this.submitUserSurveyPlan(val);
          } else {
            this.updateUserSurveyPlan(val);
          }
        }
      });
    },
    addSurveyPlanItem() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          for (let i = this.length; i < this.form.planList.length; i++) {
            this.addItem.push(this.form.planList[i]);
          }
          if (this.addItem.length !== 0) {
            let itemArr = JSON.parse(JSON.stringify(this.addItem));
            itemArr.forEach((item) => {
              item.estimated_finish_time = timestamp(
                item.estimated_finish_time
              );
            });
            this.addUserSurveyPlan(itemArr);
          } else {
            this.$message.warning('用户调研计划表无数据提交！');
          }
        }
      });
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
    clearDetail(id) {
      this.form.planList.map((item) => {
        if (item.proceeding === id) {
          item.detail = '';
        }
      });
    },
    async handleFileSuccess(e, attachment, id) {
      if (e.file.size > 5 * 1024 * 1024) {
        this.$message.warning('附件大小超过限制，请重新上传！');
      } else if (
        e.file.type.indexOf('application') > -1 ||
        e.file.type === 'text/csv'
      ) {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            attachment['id'] = this.$store.state.fileRes.id;
            attachment['name'] = this.$store.state.fileRes.file_name;
            attachment['type'] = this.$store.state.fileRes.type;
            await this.$store.dispatch(
              'product/survey/user/updatePlanResultAttachment',
              { plan_id: id, attachment: this.$store.state.fileRes.id }
            );
            this.getList();
          }
        } catch (err) {
          return;
        }
      } else {
        this.$message.warning('上传的附件格式有误！');
      }
    },
    async previewOrDownload(id, name, type) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', {
          params: { id },
          url: 'user-survey-report'
        });
        if (this.$store.state.attachmentState) {
          if (type === 'download') {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'download');
          } else {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'preview');
          }
        }
      } catch (err) {
        return;
      }
    },
    async deleteFile(id) {
      try {
        await this.$store.dispatch(
          'product/survey/user/updatePlanResultAttachment',
          { plan_id: id }
        );
        this.getList();
      } catch (err) {
        return;
      }
    },
    changeTableCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    selectProceeding(val) {
      if (val === 0 || val === '') {
        this.$message.warning('请选择事项！');
      }
    }
  }
};
</script>
