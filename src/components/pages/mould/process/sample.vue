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
          action
          :show-file-list="false"
          :http-request="handleImgSuccess"
          :disabled="isDisabled"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
          >
            点击上传
          </el-button>
        </el-upload>
        <div class="attachment">
          请上传 jpg/png/jepg等图片格式, 单个文件不超过 5MB
        </div>
      </el-form-item>
      <el-form-item>
        <div
          v-for="(item, index) in imgList"
          :key="index"
          class="attachment-list"
        >
          <div>
            {{ item.name }}
          </div>
          <div style="display: flex">
            <el-button
              type="text"
              @click="showViewDialog(item.id)"
            >
              预览
            </el-button>
            <div v-if="!isDisabled">
              <span class="table-btn">|</span>
              <el-button
                type="text"
                @click="deleteImg(item.id)"
              >
                删除
              </el-button>
            </div>
          </div>
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

  <view-dialog
    v-if="viewImgDialog"
    :link="imgLink"
    :visible="viewImgDialog"
    @hide-dialog="closeViewDialog"
  />
</template>

<script>
import { getFile } from '../../../../utils';
import ViewDialog from '../../../common/view-dialog.vue';

export default {
  components: {
    ViewDialog
  },
  inject: ['getMould'],
  props: ['changeColor', 'progress', 'getList', 'attachment'],
  data() {
    return {
      prototypeForm: {},
      imgList: this.attachment,
      viewImgDialog: false,
      imgLink: ''
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
    async handleImgSuccess(e) {
      if(e.file.type.indexOf('image') > -1) {
         if (this.imgList.length > 8) {
          this.$message.error('附件最多传9张');
        } else {
          this.$store.commit('setUploadState', false);
          let form = getFile(e);
          try {
            await this.$store.dispatch('uploadFile', form);
            if (this.$store.state.uploadState) {
              this.res = this.$store.state.fileRes;
              this.imgList.push({
                id: this.res.id,
                name: this.res.file_name,
                type: this.res.type
              });
            }
          } catch (err) {
            return;
          }
        }
      } else {
        this.$message.error('上传的图片格式有误！');
      }
    }, 
    async showViewDialog(id) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          this.viewImgDialog = true;
          this.imgLink = this.$store.state.viewLink;
        }
      } catch (err) {
        return;
      }
    },
    closeViewDialog() {
      this.viewImgDialog = false;
    },
    deleteImg(id) {
      this.imgList.splice(
        this.imgList.findIndex((e) => {
          return e.id === id;
        }),
        1
      );
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
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
