<template>
  <section
    v-loading="$store.state.mould.protoytpeLoading"
    class="progress-table"
  >
    <div class="prototype-title">
      手板样确认进度表
    </div>

    <el-descriptions
      border
      :column="5"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ progress.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <div
          :class="
            changeColor(progress.state !== undefined ? progress.state : '')
          "
        >
          {{ progress.state_desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <div v-if="progress.state === 20 || progress.state === 40">
          <el-button
            v-if="progress.state !== 40"
            class="close-btn"
            @click="approvalPrototype(0)"
          >
            不通过
          </el-button>
          <el-button
            type="success"
            :disabled="progress.state === 40"
            @click="approvalPrototype(1)"
          >
            通过
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="prototypeForm"
      label-width="80px"
      style="width: 50%; margin: 20px 0"
      :model="prototypeForm"
    >
      <el-form-item
        label="上传附件"
        prop="prototype_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <el-upload
          action=""
          :show-file-list="false"
          :on-success="handleSuccessFile"
          :limit="9"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          支持office文档格式,文档不超过5MB
        </div>
      </el-form-item>
      <el-form-item v-if="progress.prototype_file !== []">
        <div
          v-for="(item, index) in attachment"
          :key="index"
          class="attachment-list"
        >
          <div>
            {{ item.name }}
          </div>
          <el-button
            v-if="!isDisabled"
            type="text"
            @click="deleteFile(item.id)"
          >
            删除
          </el-button>
          <el-button
            v-else
            type="text"
          >
            下载
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="!isDisabled"
          type="primary"
          @click="submitPrototypeForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  inject: ['getMould'],
  props: ['changeColor', 'progress', 'getList', 'attachment'],
  data() {
    return {
      prototypeForm: {}
    };
  },
  computed: {
    isDisabled() {
      if (this.progress.state === 10 || this.progress.state === 30) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    async createPrototype(val) {
      let body = {
        mould_id: +this.$route.params.id,
        prototype_file: val
      };
      await this.$store.dispatch('mould/createPrototype', body);
      this.getList();
    },
    handleSuccessFile(file, fileList) {
      this.attachment.push({
        id: file.id,
        name: fileList.name
      });
      this.prototypeForm.prototype_file = this.attachment;
    },
    submitPrototypeForm() {
      this.$refs.prototypeForm.validate((valid) => {
        if (valid) {
          this.createPrototype(this.prototypeForm.prototype_file);
        }
      });
    },
    deleteFile(id) {
      this.attachment.splice(
        this.attachment.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
      this.prototypeForm.prototype_file = this.attachment;
    },
    async approvalPrototype(val) {
      await this.$store.dispatch('mould/approvalPrototype', {
        mould_id: +this.$route.params.id,
        approval_result: val
      });
      this.getMould();
    }
  }
};
</script>
