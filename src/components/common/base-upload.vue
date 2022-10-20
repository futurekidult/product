<template>
  <el-upload
    action
    :show-file-list="false"
    :http-request="handleFileSuccess"
    :disabled="isDisabled"
  >
    <el-button
      type="primary"
      :disabled="isDisabled"
    >
      上传文件
    </el-button>
    <div
      v-if="type === 'image' || type === 'imageSingle'"
      class="attachment"
    >
      请上传 jpg/png/jepg等图片格式, 单个文件不超过 5MB
    </div>
    <div
      v-else
      class="attachment"
    >
      支持office文档格式,文件不能超过5MB
    </div>
  </el-upload>
  <div
    v-if="
      JSON.stringify(attachment) !== '{}' &&
        (type === 'file' || type === 'imageSingle')
    "
    class="attachment-list"
  >
    <div>{{ attachment.name }}</div>
    <div>
      <el-button
        v-if="!isDisabled"
        type="text"
        @click="deleteFile(attachment.id)"
      >
        删除
      </el-button>
      <span
        v-if="
          !isDisabled && (attachment.type === 12860 || type === 'imageSingle')
        "
        class="table-btn"
      >|</span>
      <el-button
        v-if="attachment.type === 12860 || type === 'imageSingle'"
        type="text"
        @click="previewOrDownload(attachment.id, attachment.name, 'preview')"
      >
        预览
      </el-button>
      <span
        v-if="isDisabled && attachment.type === 12860"
        class="table-btn"
      >|</span>
      <el-button
        v-if="isDisabled && (attachment.type === 12860 || type === 'file')"
        type="text"
        @click="previewOrDownload(attachment.id, attachment.name, 'download')"
      >
        下载
      </el-button>
    </div>
  </div>
  <div
    v-if="type === 'image'"
    class="image-list"
  >
    <div
      v-for="(item, index) in imgList"
      :key="index"
      class="image-item"
    >
      <div>
        {{ item.name }}
      </div>
      <div>
        <el-button
          v-if="!isDisabled"
          type="text"
          @click="deleteFile(item.id)"
        >
          删除
        </el-button>
        <span
          v-if="!isDisabled"
          class="table-btn"
        >|</span>
        <el-button
          type="text"
          @click="previewOrDownload(item.id, item.name, 'preview')"
        >
          预览
        </el-button>
      </div>
    </div>
  </div>
  <div
    v-if="type === 'file-list'"
    class="file-list"
  >
    <div
      v-for="item in fileArr"
      :key="item.id"
      class="file-item"
    >
      <div>
        {{ item.name }}
      </div>
      <div>
        <el-button
          v-if="!isDisabled"
          type="text"
          @click="deleteFile(item.id)"
        >
          删除
        </el-button>
        <span
          v-if="!isDisabled && item.type === 12860"
          class="table-btn"
        >|</span>
        <el-button
          v-if="item.type === 12860"
          type="text"
          @click="previewOrDownload(item.id, item.name, 'preview')"
        >
          预览
        </el-button>
        <span
          v-if="item.type === 12860 && isDisabled"
          class="table-btn"
        >|</span>
        <el-button
          v-if="isDisabled"
          type="text"
          @click="previewOrDownload(item.id, item.name, 'download')"
        >
          下载
        </el-button>
      </div>
    </div>
  </div>
  <view-dialog
    v-if="viewImgDialog"
    :link="imgLink"
    :visible="viewImgDialog"
    :close-on-click-modal="false"
    @hide-dialog="closeViewImg"
  />
</template>

<script>
import { previewOrDownloadFile, getFile } from '../../utils';
import ViewDialog from './view-dialog.vue';

export default {
  components: {
    ViewDialog
  },
  props: [
    'file',
    'isDisabled',
    'type',
    'list',
    'count',
    'tag',
    'fileList',
    'url'
  ],
  emits: ['get-file'],
  data() {
    return {
      attachment: this.file,
      imgList: this.list,
      viewImgDialog: false,
      imgLink: '',
      fileArr: this.fileList
    };
  },
  watch: {
    file(val) {
      this.attachment = val;
    },
    list(val) {
      this.imgList = val;
    },
    fileList(val) {
      this.fileArr = val;
    }
  },
  methods: {
    getEmitData() {
      let emitFile = null;
      if (this.type === 'file' || this.type === 'imageSingle') {
        emitFile = this.attachment;
      } else if (this.type === 'image') {
        emitFile = this.imgList;
      } else {
        emitFile = this.fileArr;
      }
      return emitFile;
    },
    async handleFileSuccess(e) {
      let condition =
        this.type === 'file' || this.type === 'file-list'
          ? e.file.type.indexOf('application') > -1 ||
            e.file.type === 'text/csv'
          : e.file.type.indexOf('image') > -1 && e.file.type !== 'image/gif';
      if (e.file.size > 5 * 1024 * 1024) {
        this.$message.warning('附件大小超过限制，请重新上传！');
      } else if (condition) {
        if (
          (this.type === 'image' && this.imgList.length > this.count) ||
          (this.type === 'file-list' && this.fileArr.length > this.count)
        ) {
          this.$message.warning(`最多传${+this.count + 1}个`);
        } else {
          this.$store.commit('setUploadState', false);
          let form = getFile(e);
          try {
            await this.$store.dispatch('uploadFile', form);
            let result = {
              id: this.$store.state.fileRes.id,
              name: this.$store.state.fileRes.file_name,
              type: this.$store.state.fileRes.type
            };
            if (this.$store.state.uploadState) {
              if (this.type === 'file' || this.type === 'imageSingle') {
                this.attachment = result;
              } else if (this.type === 'image') {
                this.imgList.push(result);
              } else {
                this.fileArr.push(result);
              }
              this.$emit('get-file', this.getEmitData());
            }
          } catch (err) {
            return;
          }
        }
      } else {
        this.$message.warning(`上传的${this.tag}格式有误！`);
      }
    },
    deleteFile(id) {
      if (this.type === 'file' || this.type === 'imageSingle') {
        this.attachment = {};
      } else if (this.type === 'image') {
        this.imgList.splice(
          this.imgList.findIndex((e) => {
            return e.id === id;
          }),
          1
        );
      } else {
        this.fileArr.splice(
          this.fileArr.findIndex((e) => {
            return e.id === id;
          }),
          1
        );
      }
      this.$emit('get-file', this.getEmitData());
    },
    async previewOrDownload(id, name, type) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', {
          params: { id },
          url: this.url
        });
        if (this.$store.state.attachmentState) {
          if (type === 'download') {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'download');
          } else {
            if (this.type !== 'image' && this.type !== 'imageSingle') {
              previewOrDownloadFile(
                this.$store.state.viewLink,
                name,
                'preview'
              );
            } else {
              this.viewImgDialog = true;
              this.imgLink = this.$store.state.viewLink;
            }
          }
        }
      } catch (err) {
        return;
      }
    },
    closeViewImg() {
      this.viewImgDialog = false;
    }
  }
};
</script>

<style scoped>
.image-list,
.file-list {
  background: #f6f6f6;
  width: 100%;
  padding: 0 10px;
  margin-top: 10px;
}

.image-item,
.file-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
