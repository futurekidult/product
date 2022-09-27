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
      <el-descriptions-item
        v-if="progress.state === 20"
        label="操作"
      >
        <div
          v-if="progress.state === 20 || progress.state === 40"
          :class="progress.state === undefined ? 'hide' : ''"
        >
          <el-button
            v-if="progress.state !== 40"
            class="close-btn"
            @click="approvalPrototype(0)"
          >
            不通过
          </el-button>
          <el-button
            type="success"
            @click="approvalPrototype(1)"
          >
            通过
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="prototypeForm"
      label-width="100px"
      style="width: 50%; margin: 20px 0"
      :model="prototypeForm"
    >
      <el-form-item
        label="手板样图片"
        prop="prototype_file"
        :rules="[{ required: true, message: '请上传附件' }]"
      >
        <base-upload
          type="image"
          count="8"
          tag="手板样图片"
          url="prototype"
          :list="imgList"
          :is-disabled="isDisabled"
          @get-file="getUploadFile"
        />
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
      prototypeForm: {},
      imgList: this.attachment
    };
  },
  computed: {
    isDisabled() {
      return this.progress.state === 10 || this.progress.state === 30
        ? false
        : true;
    }
  },
  watch: {
    attachment(val) {
      this.imgList = val;
    }
  },
  methods: {
    async createPrototype(val) {
      let body = {
        mould_id: +this.$route.params.id,
        prototype_file: val
      };
      try {
        await this.$store.dispatch('mould/createPrototype', body);
        this.getList();
      } catch (err) {
        return;
      }
    },
    submitPrototypeForm() {
      this.prototypeForm.prototype_file = [];
      this.imgList.forEach((item) => {
        let { id } = item;
        this.prototypeForm.prototype_file.push(id);
      });
      this.$refs.prototypeForm.validate((valid) => {
        if (valid) {
          this.createPrototype(this.prototypeForm.prototype_file);
        }
      });
    },
    async approvalPrototype(val) {
      try {
        await this.$store.dispatch('mould/approvalPrototype', {
          mould_id: +this.$route.params.id,
          approval_result: val
        });
        this.getMould();
        this.getList();
      } catch (err) {
        return;
      }
    },
    getUploadFile(e) {
      this.imgList = e;
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
