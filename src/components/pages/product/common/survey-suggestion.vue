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
    <base-table
      :table-data="suggestion.list"
      :pagination="pagination"
      :length="suggestion.total"
      :table-column="tableColumn"
      @change-pagination="changePagination"
    >
      <template #default="slotProps">
        <text-btn
          :disabled="disabled"
          @handle-click="deleteSuggestionItem(slotProps.row.id)"
        >
          删除
        </text-btn>
        <span class="table-btn">|</span>
        <text-btn
          :disabled="disabled"
          @handle-click="
            updateSuggestionItem(slotProps.row.id, slotProps.row.suggestion)
          "
        >
          编辑
        </text-btn>
      </template>
    </base-table>
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
      suggestion: {},
      pagination: JSON.parse(JSON.stringify(this.$global.pagination)),
      tableColumn: [
        {
          label: 'ID',
          prop: 'id',
          width: 100
        },
        {
          label: '提交人',
          prop: 'creator',
          width: 100
        },
        {
          label: '提交时间',
          prop: 'create_time',
          width: 200
        },
        {
          label: '意见内容',
          prop: 'suggestion'
        }
      ]
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
    async getSurveySuggestion() {
      let params = {
        ...this.pagination,
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
    },
    changePagination(pagination) {
      this.pagination = pagination;
      this.getSurveySuggestion();
    }
  }
};
</script>
