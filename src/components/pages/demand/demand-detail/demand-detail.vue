<template>
  <div v-loading="$store.state.demand.demandDetailLoading">
    <div class="border">
      <base-tag
        class="tag"
        :mode="changeColor(demandDetail.state)"
      >
        {{ demandDetail.state_desc }}
      </base-tag>

      <el-descriptions
        :title="demandDetail.name"
        :column="4"
      >
        <el-descriptions-item
          v-if="demandDetail.state === 30"
          label="关联产品:"
        >
          <el-button
            type="text"
            @click="toProductDetail(demandDetail.product_id)"
          >
            查看
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="创建人:">
          {{ demandDetail.creator_desc }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间:">
          {{ demandDetail.create_time }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="border">
      <div
        class="select-title"
        :class="demandDetail.state === 20 ? 'review-msg' : ''"
      >
        <div><span class="line">|</span> 需求信息</div>
        <div v-if="demandDetail.state === 20">
          <el-button
            v-if="!show"
            type="text"
            @click="showForm"
          >
            展开内容
          </el-button>
          <el-button
            v-else
            type="text"
            @click="show = !show"
          >
            收起内容
          </el-button>
        </div>
      </div>
      <demand-form
        v-if="(show && demandDetail.state === 20) || demandDetail.state !== 20"
        type="detail"
      />

      <demand-review v-if="demandDetail.state === 20" />
    </div>
  </div>
</template>

<script>
import { formatterTime } from '../../../../utils';
import DemandForm from '../common/demand-form.vue';
import DemandReview from '../demand-detail/demand-review/demand-review.vue';

export default {
  components: {
    DemandForm,
    DemandReview
  },
  props: ['id'],
  data() {
    return {
      demandDetail: {},
      show: false
    };
  },
  created() {
    this.getDemandDetail();
  },
  methods: {
    async getDemandDetail() {
      await this.$store.dispatch('demand/getDemandDetail', {
        params: {
          demand_id: +this.$route.params.id
        }
      });
      this.demandDetail = this.$store.state.demand.demandDetail;
      this.demandDetail.create_time = formatterTime(
        this.demandDetail.create_time
      );
    },
    toProductDetail(id) {
      this.$router.push(`/product-list/${id}`);
    },
    changeColor(val) {
      if (val === 20) {
        return 'warning';
      } else if (val === 30) {
        return 'success';
      } else {
        return 'danger';
      }
    },
    showForm() {
      this.show = !this.show;
      this.$store.commit('demand/setDemandDetailLoading', true);
    }
  }
};
</script>

<style scoped>
.review-msg {
  display: flex;
  justify-content: space-between;
  background: #f6f6f6;
  padding: 15px;
}
</style>
