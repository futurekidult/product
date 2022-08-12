<template>
  <div class="border">
    <div class="detail-title">
      {{ demandDetail.name }}  
      <div class="tag-position">
        <base-tag
          class="tag"
          :mode="changeColor(demandDetail.state)"
        >
          {{ demandDetail.state_desc }}
        </base-tag>
      </div>
    </div>

    <el-descriptions :column="4">
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
</template>

<script>
import { formatterTime } from '../../../../utils';

export default {
  data() {
    return {
      demandDetail: {}
    }
  },
  mounted() {
    this.getDemandDetail();
  },
  methods: {
    async getDemandDetail() {
      try {
        this.$store.commit('demand/setDemandDetailLoading', true);
        await this.$store.dispatch('demand/getDemandDetail', {
          params: {
            demand_id: +this.$route.params.id
          }
        });
        this.demandDetail = this.$store.state.demand.demandDetail;
        this.demandDetail.create_time = formatterTime(
          this.demandDetail.create_time
        );
      } catch (err) {
        this.$store.commit('demand/setDemandDetailLoading', false);
        return;
      }
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
    toProductDetail(id) {
      if(this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    }
  }
}
</script>