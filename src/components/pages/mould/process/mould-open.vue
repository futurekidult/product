<template>
  <section
    v-loading="$store.state.mould.makingMouldLoading"
    class="progress-table"
  >
    <div class="open-mould_item">
      <div class="open-title">
        开模确认进度表
      </div>
      <el-button
        :disabled="buttonState === 0"
        type="primary"
        @click="showApplyForm"
      >
        开模申请
      </el-button>
    </div>
    <el-descriptions
      border
      :column="9"
      direction="vertical"
    >
      <el-descriptions-item label="任务负责人">
        {{ progress.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="开模费用">
        {{ progress.cost }}
      </el-descriptions-item>
      <el-descriptions-item
        label="说明"
        width="150px"
      >
        <el-popover
          placement="bottom-start"
          trigger="hover"
          :content="progress.illustration_text"
          effect="dark"
        >
          <template #reference>
            <div
              style="
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ progress.illustration_text }}
            </div>
          </template>
        </el-popover>
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ progress.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="开模工厂">
        {{ progress.mould_factory }}
      </el-descriptions-item>
      <el-descriptions-item label="协议附件">
        <span v-if="visible">
          <el-button
            type="text"
            @click="
              previewOrDownload(
                progress.agreement_file.id,
                progress.agreement_file.name,
                'preview'
              )
            "
          >
            预览
          </el-button>
          <span class="table-btn">|</span>
        </span>
        <el-button
          type="text"
          @click="
            previewOrDownload(
              progress.agreement_file.id,
              progress.agreement_file.name,
              'download'
            )
          "
        >
          下载
        </el-button>
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
        v-if="progress.state === 20 || progress.state === 30"
        label="操作"
      >
        <div :class="progress.state === undefined ? 'hide' : ''">
          <div v-if="progress.state === 20 || progress.state === 40">
            <el-button
              v-if="progress.state !== 40"
              class="close-btn"
              @click="approvalMakingMould(progress.id, 0)"
            >
              不通过
            </el-button>
            <el-button
              type="success"
              :disabled="progress.state === 40"
              @click="approvalMakingMould(progress.id, 1)"
            >
              通过
            </el-button>
          </div>
          <div v-if="progress.state === 30">
            <el-button
              type="text"
              @click="
                editMakingMould(
                  progress.id,
                  progress.cost,
                  progress.mould_factory,
                  progress.estimated_finish_time,
                  progress.illustration_text
                )
              "
            >
              编辑
            </el-button>
          </div>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <mould-form
      v-if="applyFormVisible"
      title="申请开模"
      :dialog-visible="applyFormVisible"
      type="create"
      :get-list="getList"
      :attachment="agreementAttachment"
      :close-on-click-modal="false"
      @hide-dialog="closeApplyForm"
    />
    <mould-form
      v-if="editFormVisible"
      title="编辑"
      :dialog-visible="editFormVisible"
      :edit-form="editForm"
      type="edit"
      :get-list="getList"
      :attachment="agreementAttachment"
      :close-on-click-modal="false"
      @hide-dialog="closeEditForm"
    />
  </section>
</template>

<script>
import MouldForm from '../common/mould-form.vue';
import { previewOrDownloadFile } from '../../../../utils';

export default {
  components: {
    MouldForm
  },
  inject: ['getMould'],
  props: ['progress', 'changeColor', 'getList', 'buttonState', 'attachment'],
  data() {
    return {
      applyFormVisible: false,
      editFormVisible: false,
      editForm: {},
      agreementAttachment: {},
      visible: false
    };
  },
  watch: {
    attachment(val) {
      this.agreementAttachment = val;
    },
    progress(val) {
      if (val.agreement_file) {
        if (val.agreement_file.type === 12860) {
          this.visible = true;
        }
      }
    }
  },
  methods: {
    showApplyForm() {
      this.applyFormVisible = true;
    },
    closeApplyForm() {
      this.applyFormVisible = false;
    },
    editMakingMould(
      id,
      cost,
      mouldFactory,
      estimatedFinishTime,
      illustrationText
    ) {
      this.editFormVisible = true;
      this.editForm = {
        id,
        cost,
        mould_factory: mouldFactory,
        estimated_finish_time: estimatedFinishTime,
        illustration_text: illustrationText
      };
    },
    closeEditForm() {
      this.editFormVisible = false;
    },
    async approvalMakingMould(id, result) {
      let body = {
        id,
        approval_result: result
      };
      try {
        await this.$store.dispatch('mould/approvalMakingMould', body);
        this.getMould();
        this.getList();
      } catch (err) {
        return;
      }
    },
    async previewOrDownload(id, name, type) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', {
          params: { id },
          url: 'mould-agreement'
        });
        if (this.$store.state.attachmentState) {
          if (type === 'download') {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'download');
          } else {
            previewOrDownloadFile(this.$store.state.viewLink, name, 'preview');
          }
        }
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
