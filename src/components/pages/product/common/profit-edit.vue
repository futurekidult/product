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
          v-for="(item, index) in editForm"
          :key="index"
        >
          <el-form-item
            :label="'平台' + (index + 1)"
            required
          >
            <el-input
              v-model="item.platform_desc"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'运营专员' + (index + 1)"
            :prop="`${index}.operations_specialist_id`"
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
  props: ['dialogVisible', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      editForm: {
        list: []
      }
    };
  },
  computed: {
    getSpecialist() {
      return this.$store.state.product.project.specialist;
    }
  },
  mounted() {
    this.getOperationsSpecialist();
  },
  methods: {
    async getOperationsSpecialist() {
      let params = {
        product_id: this.$route.params.productId,
        market: this.id
      };
      await this.$store.dispatch('product/project/getOperationsSpecialist', {
        params
      });
      this.editForm = this.$store.state.product.project.specialist;
    },
    async updateOperationsSpecialist(val) {
      let body = val;
      body['product_id'] = this.$route.params.productId;
      body['market'] = this.id;
      await this.$store.dispatch('product/project/getOperationsSpecialist', {
        body
      });
      this.visible = false;
    },
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.updateOperationsSpecialist(this.editForm);
        }
      });
    }
  }
};
</script>
