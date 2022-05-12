<template>
  <el-table
    border
    empty-text="无数据"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :data="userList"
  >
    <el-table-column
      label="序号"
      type="index"
      width="80px"
    />
    <el-table-column
      label="创建人"
      prop="creator"
    />
    <el-table-column
      label="创建时间"
      prop="create_time"
    />
    <el-table-column
      label="寄样完成时间"
      prop="delivery_time"
    />
    <el-table-column
      label="结果上传时间"
      prop="upload_time"
    />
    <el-table-column
      label="用户姓名"
      prop="username"
    />
    <el-table-column
      label="是否已寄样"
      prop="is_delivered_desc"
    />
    <el-table-column
      label="测试状态"
      prop="state_desc"
    />
    <el-table-column
      label="测试结果文件"
      prop="test_result_file"
    >
      <el-button type="text">
        下载
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        预览
      </el-button>
    </el-table-column>
    <el-table-column
      label="操作"
      width="400px"
    >
      <template #default="scope">
        <el-button
          :disabled="scope.row.is_delivered_desc === '是' ? true : false"
          @click="deliverSample(scope.row.user_test_apply_id)"
        >
          样品已寄送
        </el-button>
        <el-button
          :disabled="
            JSON.stringify(scope.row.test_result_file) === '{}' ? false : true
          "
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

  <el-button
    style="margin: 15px 0"
    @click="showUserForm"
  >
    + 新增测试用户
  </el-button>

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
  />
</template>

<script>
import UserForm from './user-form.vue';
import SampleResult from './sample-result.vue';
import ViewUser from './view-user.vue';

export default {
  components: {
    UserForm,
    SampleResult,
    ViewUser
  },
  data() {
    return {
      userVisible: false,
      userList: [],
      resultFormVisible: false,
      testUserId: 0,
      viewUserVisible: false,
      viewUserid: 0
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      await this.$store.dispatch('sample/user/getUserList', {
        params: {
          sample_id: +this.$route.params.id,
          current_page: 1,
          page_size: 10
        }
      });
      this.userList = this.$store.state.sample.user.userList;
    },
    async deliverSample(val) {
      let body = {
        user_test_apply_id: val,
        is_delivered: 1
      };
      await this.$store.dispatch('sample/user/deliverSample', body);
      this.getUserList();
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
    }
  }
};
</script>
