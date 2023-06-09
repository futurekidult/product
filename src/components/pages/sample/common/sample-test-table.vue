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
    <base-table
      :table-column="sampleTestTableColumn"
      :table-data="applyList"
      :operation-width="200"
      :pagination-visible="false"
    >
      <template #default="slotProps">
        <text-btn
          v-if="slotProps.row.review_state === 10"
          @handle-click="showReviewForm(slotProps.row.id)"
        >
          {{ reviewBtnContent }}
        </text-btn>
        <text-btn
          v-if="slotProps.row.review_state === 30 && type === 'apply'"
          @handle-click="showEditForm(slotProps.row.id)"
        >
          编辑
        </text-btn>
        <span
          v-if="slotProps.row.review_state === 30 && type === 'apply'"
          class="table-btn"
        >|</span>
        <text-btn
          v-if="slotProps.row.review_state !== 10"
          @handle-click="showViewForm(slotProps.row.id)"
        >
          查看
        </text-btn>
      </template>
    </base-table>

    <test-form
      v-if="testApplyVisible"
      :dialog-visible="testApplyVisible"
      title="申请样品测试"
      type="apply"
      :close-on-click-modal="false"
      @hide-dialog="closeTestForm"
    />

    <test-form
      v-if="applyReviewVisible"
      :id="testId"
      :dialog-visible="applyReviewVisible"
      title="申请样品测试评审"
      type="review"
      :close-on-click-modal="false"
      @hide-dialog="closeReviewForm"
    />

    <test-form
      v-if="resultVisible"
      :id="testId"
      :dialog-visible="resultVisible"
      title="查看"
      type="view"
      :close-on-click-modal="false"
      @hide-dialog="closeViewForm"
    />

    <test-supply
      v-if="testSupplyVisible"
      :id="+$route.params.id"
      :dialog-visible="testSupplyVisible"
      type="supplyment"
      title="补充测试内容"
      label="测试补充说明"
      prop="content"
      action="supplement create"
      :get-list="refreshTestSupply"
      :close-on-click-modal="false"
      @hide-dialog="closeTestForm"
    />

    <test-supply
      v-if="testSupplyReviewVisible"
      :update-id="supplyId"
      :dialog-visible="testSupplyReviewVisible"
      type="supplyment"
      title="测试补充内容评审"
      label="测试补充说明"
      prop="content"
      action="supplement review"
      :value="supplyItemValue"
      :get-list="refreshTestSupply"
      :get-quality="getQualityDetail"
      :close-on-click-modal="false"
      @hide-dialog="closeReviewForm"
    />

    <test-supply
      v-if="testSupplyViewVisible"
      :dialog-visible="testSupplyViewVisible"
      type="supplyment"
      title="测试补充内容"
      label="测试补充说明"
      prop="content"
      action="supplement view"
      :value="supplyItemValue"
      :close-on-click-modal="false"
      @hide-dialog="closeViewForm"
    />

    <el-dialog
      v-model="editSpecialistVisible"
      title="编辑"
      width="25%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editForm"
        :model="editForm"
      >
        <el-form-item
          label="请选择品质专员"
          prop="quality_specialist_id"
          :rules="[{ required: true, message: '请选择品质专员' }]"
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
import {
  getOrganizationList,
  setReviewStateColor
} from '../../../../utils/index';
import TestSupply from '../../../common/supply-dialog.vue';

export default {
  components: {
    TestForm,
    TestSupply
  },
  inject: ['refreshTestSupply', 'getQualityDetail'],
  props: [
    'type',
    'title',
    'label',
    'applyList',
    'buttonState',
    'btnContent',
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
      },
      testSupplyVisible: false,
      testSupplyReviewVisible: false,
      testSupplyViewVisible: false,
      supplyId: 0,
      supplyItemValue: '',
      sampleTestTableColumn: [
        { prop: 'id', label: this.label, width: 100 },
        {
          prop: 'creator',
          label: '创建人',
          width: 400
        },
        { prop: 'submit_time', label: '提交时间', width: 200 },
        { prop: 'review_finish_time', label: '评审完成时间', width: 200 },
        {
          prop: 'review_state',
          label: '状态',
          formatter: (row) => {
            return setReviewStateColor(row.review_state);
          },
          getSpecialProp: (row) => {
            return row.review_state_desc;
          }
        }
      ]
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
    async viewSupplement(id, type) {
      try {
        await this.$store.dispatch('sample/getSupplyItem', {
          params: {
            id
          }
        });
        if (type === 'review') {
          this.supplyId = id;
          this.supplyItemValue = this.$store.state.sample.supplyItem.content;
          this.testSupplyReviewVisible = true;
        } else {
          this.supplyItemValue = this.$store.state.sample.supplyItem;
          this.testSupplyViewVisible = true;
        }
      } catch (err) {
        return;
      }
    },
    showTestForm() {
      if (this.type === 'apply') {
        this.testApplyVisible = true;
      } else {
        this.testSupplyVisible = true;
      }
    },
    closeTestForm() {
      if (this.type === 'apply') {
        this.testApplyVisible = false;
      } else {
        this.testSupplyVisible = false;
      }
    },
    showReviewForm(id) {
      if (this.type === 'apply') {
        this.applyReviewVisible = true;
        this.testId = id;
      } else {
        this.viewSupplement(id, 'review');
      }
    },
    closeReviewForm() {
      if (this.type === 'apply') {
        this.applyReviewVisible = false;
      } else {
        this.testSupplyReviewVisible = false;
      }
    },
    showViewForm(id) {
      if (this.type === 'apply') {
        this.testId = id;
        this.resultVisible = true;
      } else {
        this.viewSupplement(id, 'view');
      }
    },
    closeViewForm() {
      if (this.type === 'apply') {
        this.resultVisible = false;
      } else {
        this.testSupplyViewVisible = false;
      }
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

<style scoped>
.center {
  align-items: center;
}
</style>
