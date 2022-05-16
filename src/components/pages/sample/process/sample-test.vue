<template>
  <div
    v-loading="$store.state.sample.testLoading"
    class="border"
  >
    <div class="select-title">
      <span class="line">|</span> 测试申请
    </div>

    <div class="proofing-item">
      <div class="proofing-title">
        样品测试申请进度表
      </div>
      <el-button
        type="primary"
        :disabled="buttonState === 0 "
        @click="showApplyForm"
      >
        申请样品测试
      </el-button>
    </div>
    <el-table
      border
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
      />
      <el-table-column
        label="评审完成时间"
        prop="review_finish_time"
      />
      <el-table-column
        label="状态"
        prop="review_state_desc"
      />
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

  <div class="border">
    <div class="select-title">
      <span class="line">|</span> 测试详情
    </div>
    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane
        label="品质测试"
        name="quality"
      >
        <quality-test />
      </el-tab-pane>
      <el-tab-pane
        label="机构测试"
        name="agency"
      >
        <agency-test />
      </el-tab-pane>
      <el-tab-pane
        label="用户测试"
        name="user"
      >
        <user-test />
      </el-tab-pane>
    </el-tabs>
  </div>

  <test-form
    v-if="testApplyVisible"
    :dialog-visible="testApplyVisible"
    title=" 申请样品测试"
    type="apply"
    @hide-dialog="closeApplyForm"
  />

  <test-form
    v-if="applyReviewVisible"
    :id="testId"
    :dialog-visible="applyReviewVisible"
    title=" 申请样品测试评审"
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
        <el-select
          v-model="editForm.quality_specialist_id"
          placeholder="请选择品质专员"
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

export default {
  components: {
    QualityTest,
    AgencyTest,
    UserTest,
    TestForm
  },
  data() {
    return {
      activeName: 'quality',
      testApplyVisible: false,
      applyReviewVisible: false,
      resultVisible: false,
      editSpecialistVisible: false,
      editForm: {},
      applyList: [],
      buttonState: 1,
      testId: 0
    };
  },
  mounted() {
    this.getProgress();
  },
  methods: {
    async getProgress() {
      await this.$store.dispatch('sample/getTestProgress', {
        params: {
          sample_id: +this.$route.params.id
        }
      });
      this.applyList = this.$store.state.sample.testProgress.list;
      this.buttonState = this.$store.state.sample.testProgress.button_state;
    },
    async getQualitySpecialist(id) {
      await this.$store.dispatch('sample/getQualitySpecialist', {
        params: {
          id
        }
      });
      this.editForm.quality_specialist_id =
        this.$store.state.sample.qualitySpecialist.quality_specialist_id;
    },
    async updateQualitySpecialist(val) {
      let body = val;
      body['id'] = this.testId;
      await this.$store.dispatch('sample/updateQualitySpecialist', body);
      this.editSpecialistVisible = false;
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
    }
  }
};
</script>
