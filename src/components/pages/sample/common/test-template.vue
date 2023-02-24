<template>
  <section>
    <base-table
      :table-column="testTemplateTableColumn"
      :table-data="questionList"
      :operation-width="100"
      :pagination="pagination"
      :length="total"
      @change-pagination="changeTestTemplatePagination"
    >
      <template #default="slotProps">
        <text-btn
          v-if="state !== 1"
          @handle-click="
            showEditQuestions(
              slotProps.row.id,
              slotProps.row.name,
              slotProps.row.consequence_text
            )
          "
        >
          编辑
        </text-btn>
        <text-btn
          v-else
          :disabled="slotProps.row.is_record === 1"
          @handle-click="recordProblem(slotProps.row.id)"
        >
          记录问题
        </text-btn>
      </template>
    </base-table>
    <div class="sample-item">
      <el-button
        style="margin: 15px 0"
        :disabled="state === 1"
        @click="showAddQuestions"
      >
        + 新增测试问题
      </el-button>
    </div>

    <question-form
      v-if="addQuestionsVisible"
      :id="testId"
      :dialog-visible="addQuestionsVisible"
      title="新增测试问题"
      :type="type"
      :get-list="getTestQuestion"
      :close-on-click-modal="false"
      @hide-dialog="closeAddQuestions"
    />

    <question-edit
      v-if="editQuestionsVisible"
      :id="questionId"
      :question="question"
      :dialog-visible="editQuestionsVisible"
      title="编辑"
      :type="type"
      :get-list="getTestQuestion"
      :close-on-click-modal="false"
      @hide-dialog="closeEditQuestions"
    />
  </section>
</template>

<script>
import QuestionForm from './question-form.vue';
import QuestionEdit from './question-edit.vue';
import { formatterTime } from '../../../../utils';

export default {
  components: {
    QuestionForm,
    QuestionEdit
  },
  props: ['type', 'state', 'testId'],
  data() {
    return {
      addQuestionsVisible: false,
      editQuestionsVisible: false,
      questionList: [],
      questionId: 0,
      question: {},
      total: 0,
      testTemplateTableColumn: [
        { prop: 'id', label: '测试问题ID', width: 100 },
        {
          prop: 'name',
          label: '问题名称',
          min_width: 150
        },
        { prop: 'consequence_text', label: '问题描述', min_width: 150 },
        { prop: 'creator', label: '创建人', width: 200 },
        { prop: 'create_time', label: '创建时间', width: 200 }
      ],
      pagination: JSON.parse(JSON.stringify(this.$global.pagination))
    };
  },
  mounted() {
    this.getTestQuestion();
  },
  methods: {
    async getTestQuestion() {
      let params = {
        ...this.pagination,
        sample_id: +this.$route.params.id
      };
      try {
        await this.$store.dispatch(`sample/${this.type}/getTestQuestion`, {
          params
        });
        if (this.type === 'quality') {
          let quality = this.$store.state.sample.quality.testQuestion;
          this.questionList = quality.list;
          this.total = quality.total;
        } else if (this.type === 'agency') {
          let agency = this.$store.state.sample.agency.testQuestion;
          this.questionList = agency.list;
          this.total = agency.total;
        } else {
          let user = this.$store.state.sample.user.testQuestion;
          this.questionList = user.list;
          this.total = user.total;
        }
        this.questionList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
        });
      } catch (err) {
        return;
      }
    },
    async recordTestProblem(id) {
      let body = {
        problem_id: id
      };
      try {
        await this.$store.dispatch(
          `sample/${this.type}/recordTestProblem`,
          body
        );
      } catch (err) {
        return;
      }
    },
    showAddQuestions() {
      this.addQuestionsVisible = true;
    },
    closeAddQuestions(val) {
      this.addQuestionsVisible = val;
    },
    showEditQuestions(id, name, consequence_text) {
      this.editQuestionsVisible = true;
      this.questionId = id;
      this.question = {
        name,
        consequence_text
      };
    },
    closeEditQuestions(val) {
      this.editQuestionsVisible = val;
    },
    recordProblem(id) {
      this.recordTestProblem(id);
    },
    changeTestTemplatePagination(pagination) {
      this.pagination = pagination;
      this.getTestQuestion();
    }
  }
};
</script>
