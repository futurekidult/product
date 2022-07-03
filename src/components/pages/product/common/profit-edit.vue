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
            <el-tree-select
              v-model="item.operations_specialist_id"
              :data="memberList"
              clearable
              filterable
              :props="defaultProps"
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
import { getOrganizationList } from '../../../../utils';
export default {
  props: ['dialogVisible', 'id'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      editForm: {
        list: []
      },
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
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
    getOrganizationList().then( (res) => {
      this.memberList = res;
    });
  },
  methods: {
    async getOperationsSpecialist() {
      let params = {
        product_id: this.$route.params.productId,
        market: this.id
      };
      try {
        await this.$store.dispatch('product/project/getOperationsSpecialist', {
          params
        });
        this.editForm = this.$store.state.product.project.specialist;
      } catch (err) {
        return;
      }
    },
    async updateOperationsSpecialist(val) {
      let body = {};
      body['specialists'] = val;
      body['product_id'] = +this.$route.params.productId;
      body['market'] = this.id;
      try {
        await this.$store.dispatch('product/project/updateOperationsSpecialist', body);
        this.visible = false;
      } catch (err) {
        return;
      }
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
