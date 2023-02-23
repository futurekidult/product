<template>
  <div>
    <base-table
      :table-column="$global.userTemplateTableColumn"
      :table-data="userList"
      :operation-width="250"
      :pagination="pagination"
      :length="$store.state.sample.user.total"
      @change-pagination="changeUserTemplatePagination"
    >
      <template #operation="slotProps">
        <div style="display: flex">
          <div
            v-if="
              JSON.stringify(slotProps.row.test_result_file) !== '{}' &&
                slotProps.row.test_result_file.type === 12860
            "
          >
            <text-btn
              @handle-click="
                previewOrDownload(
                  slotProps.row.test_result_file.id,
                  slotProps.row.test_result_file.name,
                  'preview'
                )
              "
            >
              预览
            </text-btn>
          </div>
          <div v-if="slotProps.row.button_state.is_upload === 1">
            <span
              v-if="slotProps.row.test_result_file.type === 12860"
              class="table-btn"
            >|</span>
            <text-btn
              @handle-click="
                previewOrDownload(
                  slotProps.row.test_result_file.id,
                  slotProps.row.test_result_file.name,
                  'download'
                )
              "
            >
              下载
            </text-btn>
          </div>
        </div>
      </template>
      <template #default="slotProps">
        <text-btn
          :disabled="slotProps.row.is_delivered_desc === '是'"
          @handle-click="
            deliverSample(slotProps.row.user_test_apply_id, slotProps.row.id)
          "
        >
          样品已寄送
        </text-btn>
        <span class="table-btn">|</span>
        <text-btn
          :disabled="JSON.stringify(slotProps.row.test_result_file) !== '{}'"
          @handle-click="
            showResultForm(slotProps.row.user_test_apply_id, slotProps.row.id)
          "
        >
          {{
            JSON.stringify(slotProps.row.test_result_file) === '{}'
              ? '上传结果'
              : '已上传'
          }}
        </text-btn>
        <span class="table-btn">|</span>
        <text-btn @handle-click="showViewUserForm(slotProps.row.id)">
          查看信息
        </text-btn>
      </template>
    </base-table>
    <div class="user-item">
      <el-button
        style="margin: 15px 0"
        @click="showUserForm"
      >
        + 新增测试用户
      </el-button>
    </div>
    <user-form
      v-if="userVisible"
      :dialog-visible="userVisible"
      :close-on-click-modal="false"
      @hide-dialog="closeUserForm"
    />

    <sample-result
      v-if="resultFormVisible"
      :id="testUserId"
      :user-id="userId"
      :dialog-visible="resultFormVisible"
      :get-list="getUserList"
      :close-on-click-modal="false"
      @hide-dialog="closeResultForm"
    />

    <view-user
      v-if="viewUserVisible"
      :id="viewUserId"
      :dialog-visible="viewUserVisible"
      :close-on-click-modal="false"
      @hide-dialog="closeViewUserForm"
    />
  </div>
</template>

<script>
import UserForm from './user-form.vue';
import SampleResult from './sample-result.vue';
import ViewUser from './view-user.vue';
import { previewOrDownloadFile, formatterTime } from '../../../../utils';

export default {
  components: {
    UserForm,
    SampleResult,
    ViewUser
  },
  provide() {
    return {
      getUser: this.getUserList
    };
  },
  data() {
    return {
      userVisible: false,
      resultFormVisible: false,
      testUserId: 0,
      viewUserVisible: false,
      viewUserId: 0,
      userId: 0,
      userList: [],
      pagination: JSON.parse(JSON.stringify(this.$global.pagination))
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      try {
        await this.$store.dispatch('sample/user/getUserList', {
          params: {
            sample_id: +this.$route.params.id,
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size
          }
        });
        this.userList = this.$store.state.sample.user.userList;
        this.userList.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.delivery_time = formatterTime(item.delivery_time);
          item.upload_time = formatterTime(item.upload_time);
        });
      } catch (err) {
        return;
      }
    },
    async deliverSample(testId, userId) {
      let body = {
        user_test_apply_id: testId,
        is_delivered: 1,
        user_id: userId
      };
      try {
        await this.$store.dispatch('sample/user/deliverSample', body);
        this.getUserList();
      } catch (err) {
        return;
      }
    },
    async previewOrDownload(id, name, type) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
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
    },
    showResultForm(id, userId) {
      this.resultFormVisible = true;
      this.testUserId = id;
      this.userId = userId;
    },
    closeResultForm() {
      this.resultFormVisible = false;
    },
    showUserForm() {
      this.userVisible = true;
    },
    closeUserForm() {
      this.userVisible = false;
    },
    showViewUserForm(id) {
      this.viewUserVisible = true;
      this.viewUserId = id;
    },
    closeViewUserForm() {
      this.viewUserVisible = false;
    },
    changeCellColor(val) {
      if (val === 30) {
        return 'result-pass';
      } else {
        return 'result-ing';
      }
    },
    changeUserTemplatePagination(pagination) {
      this.pagination = pagination;
      this.getUserList();
    }
  }
};
</script>
