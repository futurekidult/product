<template>
  <div v-loading="$store.state.supplier.supplierDetailLoading">
    <div class="border">
      <base-tag
        :mode="mode"
        type="tag"
      >
        {{ supplierDetail.state_desc }}
      </base-tag>
      <div class="supplier-item">
        <el-descriptions
          :title="supplierDetail.name"
          :column="2"
          style="width: 70%"
        >
          <el-descriptions-item label="创建人:">
            {{ supplierDetail.creator }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间:">
            {{ supplierDetail.create_time }}
          </el-descriptions-item>
        </el-descriptions>
        <section v-if="supplierDetail.state === 10">
          <el-button
            class="close - btn"
            @click="approvalSupplier(0)"
          >
            不通过
          </el-button>
          <el-button
            type="success"
            @click="approvalSupplier(1)"
          >
            通过
          </el-button>
        </section>
      </div>
    </div>

    <supplier-form type="review" />
  </div>
</template>

<script>
import { formatterTime } from '../../../utils';
import SupplierForm from './common/supplier-form.vue';
export default {
  components: {
    SupplierForm
  },
  props: ['id'],
  data() {
    return {
      supplierDetail: {},
      mode: ''
    };
  },
  mounted() {
    this.getSupplierDetail();
  },
  methods: {
    async getSupplierDetail() {
      this.$store.commit('supplier/setSupplierDetailLoading', true);
      try {
        await this.$store.dispatch('supplier/getSupplierDetail', {
          params: {
            id: +this.$route.params.id
          }
        });
        this.supplierDetail = this.$store.state.supplier.supplierDetail;
        this.supplierDetail.create_time = formatterTime(
          this.supplierDetail.create_time
        );
        if (this.supplierDetail.state === 10) {
          this.mode = 'warning';
        } else if (this.supplierDetail.state === 20) {
          this.mode = 'danger';
        } else {
          this.mode = 'success';
        }
      } catch (err) {
        return;
      }
    },
    async approvalSupplier(val) {
      let body = {
        id: +this.$route.params.id,
        approval_result: val
      };
      try {
        await this.$store.dispatch('supplier/approvalSupplier', body);
        this.getSupplierDetail();
      } catch (err) {
        return;
      }
    }
  }
};
</script>
