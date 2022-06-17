<template>
  <el-dialog
    v-model="visible"
    width="25%"
    :title="title"
    @close="cancel"
  >
    <el-form
      ref="questionForm"
      label-width="100px"
      :model="questionForm"
      :rules="questionRules"
    >
      <el-scrollbar height="220px">
        <div
          v-for="(item, index) in questionForm.list"
          :key="index"
        >
          <el-form-item
            :label="'问题名称' + (index + 1)"
            :prop="`list.${index}.name`"
            :rules="questionRules.name"
          >
            <el-input
              v-model="item.name"
              placeholder="请输入问题"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'后果描述' + (index + 1)"
            :prop="`list.${index}.consequence_text`"
            :rules="questionRules.consequence_text"
          >
            <el-input
              v-model="item.consequence_text"
              placeholder="请输入问题描述"
              type="textarea"
              :rows="6"
              clearable
            />
          </el-form-item>
        </div>
      </el-scrollbar>
      <el-form-item>
        <el-button
          style="margin: 15px 0"
          @click="addRow"
        >
          + 新增
        </el-button>
        <el-button
          v-if="questionForm.list.length > 1"
          style="margin: 15px"
          type="danger"
          @click="deleteRow"
        >
          - 删除
        </el-button>
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitQuestionList"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['id', 'dialogVisible', 'title', 'getList', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      questionForm: { list: [{}] },
      questionRules: {
        name: [
          {
            required: true,
            message: '请输入问题'
          }
        ],
        consequence_text: [
          {
            required: true,
            message: '请输入问题描述'
          }
        ]
      }
    };
  },
  methods: {
    async createTestQuestion(val) {
      let body = {
        problem: val,
        test_apply_id: this.id
      };
      if (this.type === 'quality') {
        try {
          await this.$store.dispatch('sample/quality/createTestQuestion', body);
        } catch (err) {
          return;
        }
      } else if (this.type === 'agency') {
        try {
          await this.$store.dispatch('sample/agency/createTestQuestion', body);
        } catch (err) {
          return;
        }
      } else {
        try {
          await this.$store.dispatch('sample/user/createTestQuestion', body);
        } catch (err) {
          return;
        }
      }
      this.visible = false;
      this.getList();
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    addRow() {
      this.questionForm.list.push({});
    },
    deleteRow() {
      this.questionForm.list.pop();
    },
    submitQuestionList() {
      this.$refs.questionForm.validate((valid) => {
        if (valid) {
          this.createTestQuestion(this.questionForm.list);
        }
      });
    }
  }
};
</script>
