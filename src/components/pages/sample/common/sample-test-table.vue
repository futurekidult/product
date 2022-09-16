<template>
  <section>
    <div class="proofing-item center">
      <div class="proofing-title">
        {{ title }}
      </div>
      <el-button
        type="primary"
        :disabled="buttonState === 0"
        @click="showTestForm"
      >
        {{ btnContent }}
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
            type="text"
            @click="showReviewForm(scope.row.id)"
          >
            {{ reviewBtnContent }}
          </el-button>
          <el-button
            v-if="scope.row.review_state === 30 && type === 'apply'"
            type="text"
            @click="showEditForm(scope.row.id)"
          >
            编辑
          </el-button>
          <span
            v-if="scope.row.review_state === 30 && type === 'apply'"
            class="table-btn"
          >|</span>
          <el-button
            v-if="scope.row.review_state !== 10"
            type="text"
            @click="showViewForm(scope.row.id)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
          <el-button
            class="close-btn"
            @click="closeEditForm"
          >
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
  </section>
</template>

<script>
import TestForm from '../common/test-form.vue';
import { getOrganizationList } from '../../../../utils/index';

export default {
  components: {
    TestForm
  },
  props: [
    'applyList',
    'buttonState',
    'title',
    'btnContent',
    'type',
    'reviewBtnContent'
  ],
  data() {
    return {
      testApplyVisible: false,
      applyReviewVisible: false,
      resultVisible: false,
      editSpecialistVisible: false,
      editForm: {},
      testId: 0,
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      }
    };
  },
  mounted() {
    getOrganizationList().then((res) => {
      this.memberList = res;
    });
  },
  methods: {
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
    showTestForm() {
      if (this.type === 'apply') {
        this.testApplyVisible = true;
      }
    },
    closeApplyForm() {
      this.testApplyVisible = false;
    },
    showReviewForm(id) {
      if (this.type === 'apply') {
        this.applyReviewVisible = true;
        this.testId = id;
      }
    },
    closeReviewForm() {
      this.applyReviewVisible = false;
    },
    showViewForm(id) {
      if (this.type === 'apply') {
        this.testId = id;
        this.resultVisible = true;
      }
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
    }
  }
};
</script>

<style scoped>
.center {
  align-items: center;
}
</style>
