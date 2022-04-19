<template>
  <el-dialog
    v-model="visible"
    title="编辑"
    width="30%"
    @close="cancel"
  >
    <el-form
      ref="editForm"
      :model="editForm"
      label-width="110px"
    >
      <el-scrollbar height="300px">
        <div
          v-for="(item, index) in editForm.list"
          :key="index"
        >
          <el-form-item
            :label="'平台' + (index + 1)"
            required
          >
            <el-input v-model="item.platform_desc" />
          </el-form-item>
          <el-form-item
            :label="'运营专员' + (index + 1)"
            :prop="`list.${index}.operations_specialist_id`"
            :rules="[{ required: true, message: '请选择运营专员' }]"
          >
            <el-select
              v-model="item.operations_specialist_id"
              placeholder="请选择运营专员"
              clearable
            />
          </el-form-item>
          <el-divider />
        </div>
      </el-scrollbar>
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitEditForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      editForm: {
        list: []
      }
    };
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
