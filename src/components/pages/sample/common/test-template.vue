<template>
  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :data="questionList"
  >
    <el-table-column
      label="序号"
      width="100px"
      type="index"
    />
    <el-table-column
      label="问题名称"
      prop="name"
    />
    <el-table-column
      label="问题描述"
      prop="consequence_text"
    />
    <el-table-column
      label="创建人"
      prop="creator"
    />
    <el-table-column
      label="创建时间"
      prop="create_time"
    />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          v-if="state !== 1"
          type="text"
          @click="
            showEditQuestions(
              scope.row.id,
              scope.row.name,
              scope.row.consequence_text
            )
          "
        >
          编辑
        </el-button>
        <el-button
          v-else
          type="text"
          @click="recordProblem(scope.row.id)"
        >
          记录问题
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-button
    style="margin: 15px 0"
    :disabled="state === 1 ? true : false"
    @click="showAddQuestions"
  >
    + 新增测试问题
  </el-button>

  <question-form
    v-if="addQuestionsVisible"
    :id="testId"
    :dialog-visible="addQuestionsVisible"
    title="新增测试问题"
    :type="type"
    :get-list="getTestQuestion"
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
    @hide-dialog="closeEditQuestions"
  />
</template>

<script>
import QuestionForm from './question-form.vue';
import QuestionEdit from './question-edit.vue';

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
      question: {}
    };
  },
  mounted() {
    this.getTestQuestion();
  },
  methods: {
    async getTestQuestion() {
      let params = {
        sample_id: +this.$route.params.id,
        current_page: 1,
        page_size: 10
      };
      if (this.type === 'quality') {
        await this.$store.dispatch('sample/quality/getTestQuestion', {
          params
        });
        this.questionList = this.$store.state.sample.quality.testQuestion.list;
      } else if (this.type === 'agency') {
        await this.$store.dispatch('sample/agency/getTestQuestion', {
          params
        });
        this.questionList = this.$store.state.sample.agency.testQuestion.list;
      } else {
        await this.$store.dispatch('sample/user/getTestQuestion', {
          params
        });
        this.questionList = this.$store.state.sample.user.testQuestion.list;
      }
    },
    async recordTestProblem(id) {
      let body = {
        problem_id: id
      };
      await this.$store.dispatch('sample/recordTestProblem', body);
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
    }
  }
};
</script>
