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

      <el-table
        border
        stripe
        empty-text="无数据"
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
              v-if="progress.state === 40"
              :disabled="progress.state === 50"
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
                v-if=" progress.state < 40"
                type="success"
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
          stripe
          empty-text="无数据"
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
                v-if="(progress.state === 10 || progress.state === 30) || (progress.state ===40 && !scope.row.id)"
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
                v-if="(progress.state === 10 || progress.state === 30) || (progress.state ===40 && !scope.row.id)"
                v-model="scope.row.detail"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in detailOptions[Number(scope.row.proceeding)].children"
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
              <el-tree-select
                v-if="(progress.state === 10 || progress.state === 30) || (progress.state ===40 && !scope.row.id)"
                v-model="scope.row.operator_id"
                :data="memberList"
                clearable
                filterable
                :props="defaultProps"
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
                v-if="(progress.state === 10 || progress.state === 30) || (progress.state ===40 && !scope.row.id)"
                v-model="scope.row.estimated_finish_time"
                type="datetime"
                placeholder="请选择时间"
                :default-time="defaultTime"
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
              <div :class="changeTableCellColor(scope.row.state)">
                {{ scope.row.state_desc }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="结果附件"
            width="150px"
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
                      (e) => handleFileSuccess(e, scope.row.attachment, scope.row.id)
                    "
                  >
                    <el-button type="text">
                      上传
                    </el-button>
                  </el-upload>
                </div>
                <div v-if="(scope.row.state >= 40 || scope.row.state === 20) && scope.row.attachment.type === 12860">
                  <el-button
                    type="text"
                    @click="showViewFile(scope.row.attachment.id)"
                  >
                    预览
                  </el-button>
                  <span
                    class="table-btn"
                  >|</span>
                </div>
                <div
                  v-if="
                    JSON.stringify(scope.row.attachment) !== '{}' &&
                      (scope.row.state === 10 || scope.row.state === 30)
                  "
                >
                  <el-button
                    v-if="scope.row.attachment.type === 12860"
                    type="text"
                    @click="showViewFile(scope.row.attachment.id)"
                  >
                    预览
                  </el-button>
                  <span 
                    v-if="scope.row.attachment.type === 12860" 
                    class="table-btn"  
                  >|</span>
                  <el-button
                    type="text"
                    @click="deleteFile(scope.row.id)"
                  >
                    删除
                  </el-button>
                  <span 
                    class="table-btn"
                  >|</span>
                </div>
                <div v-if="JSON.stringify(scope.row.attachment) !== '{}'">
                  <el-button
                    type="text"
                    @click="
                      download(
                        scope.row.attachment.id,
                        scope.row.attachment.name
                      )
                    "
                  >
                    下载
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
              <div v-if="scope.row.state === 20 || (scope.row.state >= 40 && scope.row.has_approval_process === 1)">
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
                <el-button
                  v-if="(progress.state === 10 || progress.state === 30) || (progress.state ===40 && !scope.row.id)"
                  @click="deletePlanItem(scope.$index + 1)"
                >
                  删除
                </el-button>
                <el-button
                  v-if="
                    buttonState.plan === 0 &&
                      buttonState.review_pass === 0 &&
                      (scope.row.state === 10 || scope.row.state === 30)
                  "
                  @click="editOperator(scope.row.id,scope.row.operator_id)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="
                    buttonState.plan === 0 &&
                      buttonState.review_pass === 0 &&
                      scope.row.state !== 20 && scope.row.id
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
      :id="viewId"
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
  </div>
</template>

<script>
import {
  downloadFile,
  getFile,
  getOrganizationList,
  previewFile,
  timestamp
} from '../../../../../utils';
import SurveyForm from '../../common/survey-form.vue';

export default {
  components: {
    SurveyForm
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
      defaultTime: new Date(2000,1,1,23,59,59)
    };
  },
  mounted() {
    this.getParams();
     getOrganizationList().then( (res) => {
      this.memberList = res;
    });
  },
  methods: {
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
      this.planOptions.push({ key: 0, value: '请选择' });
      this.detailOptions[0] = {
        children: [
          {
            key: 0,
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
      this.planList.push(row);
    },
    deletePlanItem(id) {
      this.planList.splice(id - 1, 1);
    },
    editOperator(id,operator) {
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
      let planArr = JSON.parse(JSON.stringify(this.planList));
      planArr.forEach((item) => {
        item.estimated_finish_time = timestamp(item.estimated_finish_time);
        if(item.actual_finish_time) {
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
    },
    addSurveyPlanItem() {
     for (let i = this.length; i < this.planList.length; i++) {
       this.addItem.push(this.planList[i]);
      }
     if( this.addItem.length !== 0) {
      let itemArr = JSON.parse(JSON.stringify(this.addItem));
       itemArr.forEach((item) => {
          item.estimated_finish_time = timestamp(item.estimated_finish_time);
       });
      this.addUserSurveyPlan(itemArr);
     } else {
      this.$message.warning('用户调研计划表无数据提交！')
     }
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
      } else if (val === 30) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    clearDetail(id) {
      this.planList.map((item) => {
        if (item.proceeding === id) {
          item.detail = '';   
        }
      });
    },
    async handleFileSuccess(e, attachment, id) {
      if(e.file.type.indexOf('application') > -1 || e.file.type === 'text/csv') {
        this.$store.commit('setUploadState', false);
        let form = getFile(e);
        try {
          await this.$store.dispatch('uploadFile', form);
          if (this.$store.state.uploadState) {
            attachment['id'] = this.$store.state.fileRes.id;
            attachment['name'] = this.$store.state.fileRes.file_name;
            attachment['type'] = this.$store.state.fileRes.type;
            await this.$store.dispatch('product/survey/user/updatePlanResultAttachment',{ plan_id: id, attachment: this.$store.state.fileRes.id });
            this.getList();
          }
        } catch (err) {
          return;
        }
      } else {
        this.$message.error('上传的附件格式有误！');
      } 
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          downloadFile(this.$store.state.viewLink, name);
        }
      } catch (err) {
        return;
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          previewFile(this.$store.state.viewLink);
        }
      } catch (err) {
        return;
      }
    },
    async deleteFile(id) {
      try {
        await this.$store.dispatch('product/survey/user/updatePlanResultAttachment',{ plan_id: id });
        this.getList();
      } catch (err) {
        return ;
      }
    },
    changeColor(val) {
      if (val === 10 || val === 20) {
        return 'result-ing';
      } else if (val >= 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
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
    }
  }
};
</script>
