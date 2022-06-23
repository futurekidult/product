<template>
  <el-table
    border
    stripe
    empty-text="无数据"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :data="userList"
  >
    <el-table-column
      label="序号"
      type="index"
      width="60px"
    />
    <el-table-column
      label="创建人"
      prop="creator"
    />
    <el-table-column
      label="创建时间"
      prop="create_time"
      width="200px"
    />
    <el-table-column
      label="寄样完成时间"
      prop="delivery_time"
      width="200px"
    />
    <el-table-column
      label="结果上传时间"
      prop="upload_time"
      width="200px"
    />
    <el-table-column
      label="用户姓名"
      prop="username"
    />
    <el-table-column
      label="是否已寄样"
      prop="is_delivered_desc"
    />
    <el-table-column label="测试状态">
      <template #default="scope">
        <div :class="changeCellColor(scope.row.state)">
          {{ scope.row.state_desc }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="测试结果文件"
      prop="test_result_file"
      width="150px"
    >
      <template #default="scope">
        <div style="display: flex">
          <el-upload
            action
            :show-file-list="false"
            :http-request="handleFileSuccess"
          >
            <el-button
              v-if="
                JSON.stringify(scope.row.test_result_file) === '{}' &&
                  scope.row.button_state.is_upload === 0
              "
              type="text"
            >
              上传
            </el-button>
          </el-upload>
          <div v-if="JSON.stringify(scope.row.test_result_file) !== '{}'">
            <el-button
              type="text"
              @click="showViewFile(scope.row.test_result_file.id)"
            >
              预览
            </el-button>
          </div>
          <div v-if="scope.row.button_state.is_upload === 1">
            <span class="table-btn">|</span>
            <el-button
              type="text"
              @click="
                download(
                  scope.row.test_result_file.id,
                  scope.row.test_result_file.name
                )
              "
            >
              下载
            </el-button>
          </div>
          <div
            v-if="
              JSON.stringify(scope.row.test_result_file) !== '{}' &&
                scope.row.button_state.is_upload === 0
            "
          >
            <span class="table-btn">|</span>
            <el-button
              type="text"
              @click="deleteFile"
            >
              删除
            </el-button>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="350px"
    >
      <template #default="scope">
        <el-button
          :disabled="scope.row.is_delivered_desc === '是'"
          @click="deliverSample(scope.row.user_test_apply_id, scope.row.id)"
        >
          样品已寄送
        </el-button>
        <el-button
          :disabled="JSON.stringify(scope.row.test_result_file) !== '{}'"
          @click="showResultForm(scope.row.user_test_apply_id)"
        >
          {{
            JSON.stringify(scope.row.test_result_file) === '{}'
              ? '上传结果'
              : '已上传'
          }}
        </el-button>
        <el-button @click="showViewUserForm(scope.row.user_test_apply_id)">
          查看信息
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="user-item">
    <el-button
      style="margin: 15px 0"
      @click="showUserForm"
    >
      + 新增测试用户
    </el-button>

    <base-pagination
      :length="userList.length"
      :get-list="getUserList"
    />
  </div>
  <user-form
    v-if="userVisible"
    :dialog-visible="userVisible"
    @hide-dialog="closeUserForm"
  />

  <sample-result
    v-if="resultFormVisible"
    :id="testUserId"
    :dialog-visible="resultFormVisible"
    :get-list="getUserList"
    @hide-dialog="closeResultForm"
  />

  <view-user
    v-if="viewUserVisible"
    :id="viewUserid"
    :dialog-visible="viewUserVisible"
    @hide-dialog="closeViewUserForm"
  />
</template>

<script>
import UserForm from './user-form.vue';
import SampleResult from './sample-result.vue';
import ViewUser from './view-user.vue';
import {
  downloadFile,
  formatterTime,
  getFile,
  previewFile
} from '../../../../utils';

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
      userList: [],
      resultFormVisible: false,
      testUserId: 0,
      viewUserVisible: false,
      viewUserid: 0,
      file: {}
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList(currentPage = 1, pageSize = 10) {
      try {
        await this.$store.dispatch('sample/user/getUserList', {
          params: {
            sample_id: +this.$route.params.id,
            current_page: currentPage,
            page_size: pageSize
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
    async handleFileSuccess(e) {
      this.$store.commit('setUploadState', false);
      let form = getFile(e);
      try {
        await this.$store.dispatch('uploadFile', form);
        if (this.$store.state.uploadState) {
          this.show = true;
          this.file = {
            id: this.$store.state.fileRes.id,
            name: this.$store.state.fileRes.file_name,
            type: this.$store.state.fileRes.type
          };
          this.getUserList();
        }
      } catch (err) {
        return;
      }
    },
    async download(id, name) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          downloadFile(this.$store.state.viewLink, name);
        }
      } catch (err) {
        return;
      }
    },
    async showViewFile(id) {
      this.$store.commit('setAttachmentState', false);
      try {
        await this.$store.dispatch('getViewLink', { params: { id } });
        if (this.$store.state.attachmentState) {
          previewFile(this.$store.state.viewLink);
        }
      } catch (err) {
        return;
      }
    },
    deleteFile() {
      this.file = {};
    },
    showResultForm(id) {
      this.resultFormVisible = true;
      this.testUserId = id;
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
      this.viewUserid = id;
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
    }
  }
};
</script>
