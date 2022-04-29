<template>
  <div class="apply-item">
    <div class="survey-title">
      调研申请表
    </div>
    <el-button
      :disabled="buttonState.apply === 1 ? false : true"
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
    />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          v-if="scope.row.state === 10"
          type="text"
          @click="showReviewForm"
        >
          用户调研需求评审
        </el-button>
        <el-button
          v-else
          type="text"
          @click="showReviewForm"
        >
          查看用户调研需求
        </el-button>
      </template>
    </el-table-column>
  </el-table>
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
        {{ getProgress.principal_desc }}
      </el-descriptions-item>
      <el-descriptions-item
        label="计划完成时间"
        width="200px"
      >
        {{ getProgress.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="!timeShow"
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
        {{ getProgress.actual_start_time }}
      </el-descriptions-item>
      <el-descriptions-item
        label="实际完成时间"
        width="200px"
      >
        {{ getProgress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item
        label="状态"
        width="200px"
      >
        {{ getProgress.state_desc }}
      </el-descriptions-item>
      <el-descriptions-item
        label="操作"
        width="200px"
      >
        <el-button v-if="confirmVisible">
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
          :disabled="buttonState.plan === 0 ? true : false"
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
            v-if="buttonState.review === 0"
            class="close-btn"
            @click="approvalFail"
          >
            不通过
          </el-button>
          <el-button
            type="primary"
            style="background: #379f0d; border: 1px solid #379f0d"
            :disabled="buttonState.review === 1 ? true : false"
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
        width="100px"
        type="index"
      />
      <el-table-column label="事项">
        <template #default="scope">
          <el-select
            v-if="show"
            v-model="scope.row.proceeding"
          />
          <span v-else>{{ scope.row.proceeding }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="细节内容"
        width="200px"
      >
        <template #default="scope">
          <el-select
            v-if="show"
            v-model="scope.row.detail"
          />
          <span v-else>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行人">
        <template #default="scope">
          <el-select
            v-if="show"
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
            v-if="show"
            v-model="scope.row.estimated_finish_time"
            type="datetime"
            placeholder="请选择时间"
          />
          <span v-else>{{ scope.row.estimated_finish_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实际完成时间"
        width="250px"
        prop="actual_finish_time"
      />
      <el-table-column
        label="状态"
        prop="state_desc"
      />
      <el-table-column label="结果附件">
        <template #default="scope">
          <div
            v-if="
              scope.row.has_approval_process === '是' ||
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
        prop="has_approval_process"
      />
      <el-table-column
        label="操作"
        width="200px"
      >
        <template #default="scope">
          <div v-if="scope.row.has_approval_process === '是'">
            <el-button
              v-if="scope.row.state === 1"
              type="text"
            >
              不通过
            </el-button>
            <el-button
              type="text"
              :disabled="scope.row.state !== 1 ? true : false"
            >
              通过
            </el-button>
          </div>
          <div v-else>
            <el-button
              v-if="buttonState.plan === 1 && buttonState.review === 0"
              type="text"
              @click="deletePlanItem(scope.$index + 1)"
            >
              删除
            </el-button>
            <el-button
              v-if="
                buttonState.plan === 0 &&
                  buttonState.review === 1 &&
                  scope.row.state === 1
              "
              type="text"
              @click="editOperator(scope.$index + 1)"
            >
              编辑
            </el-button>
            <el-button
              v-if="buttonState.review === 1"
              type="text"
              :disabled="scope.row.state !== 1 ? true : false"
              @click="finishItem(scope.$index + 1)"
            >
              完成
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      style="margin: 15px 0"
      :disabled="buttonState.plan === 0 ? true : false"
      @click="addSurveyPlan"
    >
      + 新增调研计划
    </el-button>
  </div>
  <survey-form
    v-if="isVisible"
    :dialog-visible="isVisible"
    form-title="用户调研申请"
    type="apply"
    @hide-dialog="closeApplyForm"
  />

  <survey-form
    v-if="isReviewVisible"
    :dialog-visible="isReviewVisible"
    form-title="用户调研需求评审"
    type="review"
    @hide-dialog="closeReviewForm"
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
        <el-input v-model="editForm.operator" />
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
import SurveyForm from '../../common/survey-form.vue';
export default {
  components: {
    SurveyForm
  },
  data() {
    return {
      isVisible: false,
      isReviewVisible: false,
      buttonState: this.$store.state.product.survey.user.buttonState,
      planList: this.$store.state.product.survey.user.planList,
      show: true,
      confirmVisible: false,
      row: {
        proceeding: '',
        detail: '',
        operator: '',
        estimatedFinishTime: '',
        actualFinishTime: '',
        state: ''
      },
      editForm: {},
      operatorVisible: false,
      timeShow: false,
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
      surveyApply: this.$store.state.product.survey.user.surveyApply
    };
  },
  computed: {
    getProgress() {
      return this.$store.state.product.survey.user.progress;
    }
  },
  created() {
    this.isEdit();
  },
  methods: {
    isEdit() {
      if (this.buttonState.plan === 0 && this.buttonState.review === 1) {
        this.show = false;
      }
    },
    showApplyForm() {
      this.isVisible = true;
    },
    closeApplyForm() {
      this.isVisible = false;
    },
    showReviewForm() {
      this.isReviewVisible = true;
    },
    closeReviewForm() {
      this.isReviewVisible = false;
    },
    addSurveyPlan() {
      this.planList.push(this.row);
      this.show = true;
    },
    deletePlanItem(id) {
      this.tableData.splice(id - 1, 1);
    },
    editOperator(id) {
      this.operatorVisible = true;
      console.log(id);
    },
    closeEdit() {
      this.operatorVisible = false;
    },
    submitEdit() {
      this.$refs.operatorForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    finishItem(id) {
      console.log(id);
    },
    submitPlan() {
      this.show = false;
      this.buttonState.plan = 0;
    },
    approvalFail() {
      this.show = true;
      this.buttonState.plan = 1;
    },
    approvalPass() {
      this.show = false;
      this.buttonState.review = 1;
      this.confirmVisible = true;
    },
    showSetTime() {
      this.setTimeVisible = true;
    },
    submitTimeForm() {
      this.$refs.timeForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        } else {
          this.timeShow = true;
          this.setTimeVisible = false;
        }
      });
    },
    closeTimeForm() {
      this.setTimeVisible = false;
    }
  }
};
</script>
