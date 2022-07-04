<template>
  <el-table
    border
    stripe
    empty-text="无数据"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :data="questionList"
  >
    <el-table-column
      label="序号"
      width="60px"
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
          :disabled="scope.row.is_record === 1"
          type="text"
          @click="recordProblem(scope.row.id)"
        >
          记录问题
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="sample-item">
    <el-button
      style="margin: 15px 0"
      :disabled="state === 1"
      @click="showAddQuestions"
    >
      + 新增测试问题
    </el-button>

    <base-pagination
      :length="total"
      :get-list="getTestQuestion"
    />
  </div>

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
      total:0
    };
  },
  mounted() {
    this.getTestQuestion();
  },
  methods: {
    async getTestQuestion(currentPage = 1, pageSize = 10) {
      let params = {
        sample_id: +this.$route.params.id,
        current_page: currentPage,
        page_size: pageSize
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
        await this.$store.dispatch(`sample/${this.type}/recordTestProblem`, body);
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
    }
  }
};
</script>
