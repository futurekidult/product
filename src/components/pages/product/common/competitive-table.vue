<template>
  <el-collapse class="collapse-item">
    <el-collapse-item title="竞品信息">
      <el-scrollbar height="440px">
        <el-form
          :model="productForm"
          label-width="100px"
        >
          <div
            v-for="(item, index) in productForm.competitive_product"
            :key="index"
          >
            <el-form-item
              :label="'竞品图片' + (index + 1)"
              :prop="`competitive_product.${index}.images`"
            >
              <el-upload
                action
                :show-file-list="false"
                :http-request="(e) => handleCProductImageSuccess(e, index)"
                :limit="9"
              >
                <el-button
                  type="primary"
                  disabled
                >
                  点击上传
                </el-button>
              </el-upload>
              <div class="attachment">
                请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
              </div>
            </el-form-item>
            <el-form-item>
              <div
                v-for="(image, idx) in productForm.competitive_product[index]
                  .images"
                :key="idx"
                class="attachment-list"
              >
                <div>
                  {{ image.name }}
                </div>
                <el-button
                  type="text"
                  @click="showViewDialog(image.id)"
                >
                  预览
                </el-button>
              </div>
            </el-form-item>
            <el-form-item
              :label="'竞品链接' + (index + 1)"
              :prop="`competitive_product.${index}.link`"
            >
              <el-input
                v-model="item.link"
                type="textarea"
                :rows="6"
                disabled
              />
            </el-form-item>
            <el-form-item
              :label="'竞品参数' + (index + 1)"
              :prop="`competitive_product.${index}.parameter`"
            >
              <el-input
                v-model="item.parameter"
                type="textarea"
                :rows="6"
                disabled
              />
            </el-form-item>
            <el-form-item
              :label="'对标理由' + (index + 1)"
              :prop="`competitive_product.${index}.benchmarking_reason`"
            >
              <el-input
                v-model="item.benchmarking_reason"
                type="textarea"
                :rows="6"
                disabled
              />
            </el-form-item>
          </div>
        </el-form>
      </el-scrollbar>
    </el-collapse-item>
  </el-collapse>

  <view-dialog
    v-if="viewImgDialog"
    :link="imgLink"
    :visible="viewImgDialog"
    @hide-dialog="closeViewDialog"
  />
</template>

<script>
import ViewDialog from '../../../common/view-dialog.vue';

export default {
  components: {
    ViewDialog
  },
  props: ['productForm'],
  data() {
    return {
      imgLink: '',
      viewImgDialog: false
    };
  },
  methods: {
    async showViewDialog(id) {
      this.$store.commit('setAttachmentState', false);
      await this.$store.dispatch('getViewLink', { params: { id } });
      if (this.$store.state.attachmentState) {
        this.viewImgDialog = true;
        this.imgLink = this.$store.state.viewLink;
      }
    },
    closeViewDialog() {
      this.viewImgDialog = false;
    }
  }
};
</script>
