<template>
  <el-dialog
    v-model="visible"
    title="新增测试用户"
    width="30%"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-scrollbar height="270px">
        <div
          v-for="(item, index) in userForm.list"
          :key="index"
        >
          <el-form-item
            :label="'用户姓名' + (index + 1)"
            :prop="`list.${index}.username`"
            :rules="formRules.username"
          >
            <el-input
              v-model="item.username"
              placeholder="请输入用户姓名"
              clearable
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            :label="'用户地址' + (index + 1)"
            :prop="`list.${index}.address`"
            :rules="formRules.address"
          >
            <el-input
              v-model="item.address"
              placeholder="请输入用户地址"
              clearable
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            :label="'邮编' + (index + 1)"
            :prop="`list.${index}.postcode`"
            :rules="formRules.postcode"
          >
            <el-input
              v-model="item.postcode"
              placeholder="请输入邮编"
              clearable
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            :label="'联系方式' + (index + 1)"
            :prop="`list.${index}.tel`"
            :rules="formRules.tel"
          >
            <el-input
              v-model="item.tel"
              placeholder="请输入联系方式"
              clearable
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            :label="'邮箱' + (index + 1)"
            :prop="`list.${index}.email`"
            :rules="formRules.email"
          >
            <el-input
              v-model="item.email"
              placeholder="请输入邮箱"
              clearable
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <base-delete
            :id="index"
            mode="test-user_btn"
            content="移除"
            :show="userForm.list.length > 1"
            :list="userForm.list"
            @get-list="getTestUserList"
          />
        </div>
      </el-scrollbar>
      <el-form-item>
        <el-button @click="addRow">
          + 新增用户信息
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
          @click="submitUser"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getUser'],
  props: ['dialogVisible'],
  emits: ['hide-dialog'],
  data() {
    const checkMail = (rule, value, callback) => {
      if (value) {
        if (value.indexOf('@') === -1) {
          return callback(new Error('该项必须包括@'));
        } else {
          callback();
        }
      } else {
        return callback(new Error('请输入邮箱'));
      }
    };
    return {
      visible: this.dialogVisible,
      formRules: {
        username: [
          {
            required: true,
            message: '请输入用户姓名'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入用户地址'
          }
        ],
        postcode: [
          {
            required: true,
            message: '请输入邮编'
          }
        ],
        tel: [
          {
            required: true,
            message: '请输入联系方式'
          }
        ],
        email: [
          {
            required: true,
            validator: checkMail
          }
        ]
      },
      userForm: { list: [{}] }
    };
  },
  methods: {
    async createUser(val) {
      let body = {
        sample_id: +this.$route.params.id,
        data: val
      };
      try {
        await this.$store.dispatch('sample/user/createUserTest', body);
        this.visible = false;
        this.getUser();
      } catch (err) {
        return;
      }
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    addRow() {
      this.userForm.list.push({});
    },
    submitUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.createUser(this.userForm.list);
        }
      });
    },
    getTestUserList(val) {
      this.userForm.list = val;
    }
  }
};
</script>
