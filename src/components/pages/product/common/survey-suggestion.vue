<template>
  <section>
    <section class="suggestion-item">
      <div class="survey-title">
        评论及意见
      </div>
      <el-button
        :disabled="disabled"
        type="primary"
        @click="createSuggestionItem"
      >
        提交意见
      </el-button>
    </section>
    <el-table
      border
      stripe
      empty-text="无数据"
      :data="suggestion.list"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        label="ID"
        width="100"
        prop="id"
      />
      <el-table-column
        label="提交人"
        width="100"
        prop="creator"
      />
      <el-table-column
        label="提交时间"
        width="200"
      >
        <template #default="scope">
          {{ formatterTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        label="意见内容"
        prop="suggestion"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template #default="scope">
          <el-button
            type="text"
            :disabled="disabled"
            @click="deleteSuggestionItem(scope.row.id)"
          >
            删除
          </el-button>
          <span class="table-btn">|</span>
          <el-button
            type="text"
            :disabled="disabled"
            @click="updateSuggestionItem(scope.row.id, scope.row.suggestion)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="suggestion.total"
      :current-page="currentPage"
      :page-num="pageSize"
      @change-size="changePageSize"
      @change-page="changeCurrentPage"
    />

    <delete-dialog
      v-if="deleteDialogVisible"
      :id="deleteId"
      :dialog-visible="deleteDialogVisible"
      dialog-content="是否确认删除该意见"
      type="suggestion delete"
      :survey-type="type"
      :ids="ids"
      :get-list="getSurveySuggestion"
      :close-on-click-modal="false"
      @hide-dialog="closeDeleteDialog"
    />

    <suggestion-dialog
      v-if="createDialogVisible"
      :dialog-visible="createDialogVisible"
      :ids="ids"
      :type="type"
      action="suggestion create"
      title="提交意见"
      label="意见内容"
      prop="suggestion"
      :get-list="getSurveySuggestion"
      :close-on-click-modal="false"
      @hide-dialog="closeCreateDialog"
    />

    <suggestion-dialog
      v-if="updateDialogVisible"
      :dialog-visible="updateDialogVisible"
      :ids="ids"
      :type="type"
      :update-id="updateId"
      action="suggestion update"
      title="修改提交意见"
      label="意见内容"
      prop="suggestion"
      :get-list="getSurveySuggestion"
      :value="currentSuggestionValue"
      :close-on-click-modal="false"
      @hide-dialog="closeUpdateDialog"
    />
  </section>
</template>

<script>
import { formatterTime } from '../../../../utils';
import DeleteDialog from '../../../common/confirm-dialog.vue';
import SuggestionDialog from '../../../common/supply-dialog.vue';

export default {
  components: {
    DeleteDialog,
    SuggestionDialog
  },
  props: ['ids', 'type'],
  data() {
    return {
      deleteDialogVisible: false,
      createDialogVisible: false,
      updateDialogVisible: false,
      currentSuggestionValue: '',
      deleteId: 0,
      updateId: 0,
      currentPage: 1,
      pageSize: 10,
      suggestion: {}
    };
  },
  computed: {
    disabled() {
      return this.suggestion.edit_state === 0;
    }
  },
  mounted() {
    this.getSurveySuggestion();
  },
  methods: {
    formatterTime,
    deleteSuggestionItem(id) {
      this.deleteId = id;
      this.deleteDialogVisible = true;
    },
    closeDeleteDialog() {
      this.deleteDialogVisible = false;
    },
    createSuggestionItem() {
      this.createDialogVisible = true;
    },
    closeCreateDialog() {
      this.createDialogVisible = false;
    },
    updateSuggestionItem(id, value) {
      this.updateId = id;
      this.currentSuggestionValue = value;
      this.updateDialogVisible = true;
    },
    closeUpdateDialog() {
      this.updateDialogVisible = false;
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getSurveySuggestion();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getSurveySuggestion();
    },
    async getSurveySuggestion() {
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        survey_schedule_id: this.ids.survey_schedule_id,
        survey_id: this.ids.survey_id
      };
      try {
        await this.$store.dispatch('product/survey/getSurveySuggestion', {
          params,
          type: this.type
        });
        this.suggestion = this.$store.state.product.survey.suggestion;
      } catch (err) {
        return;
      }
    }
  }
};
</script>
