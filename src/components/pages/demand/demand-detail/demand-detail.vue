<template>
  <div>
    <div v-loading="$store.state.demand.demandDetailLoading">
      <div class="border">
        <div class="detail-title">
          {{ demandDetail.name }}
          <div class="tag-position">
            <base-tag
              class="tag"
              :mode="changeDemandColor(demandDetail.state)"
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

      <div class="border">
        <div class="select-title">
          <div><span class="line">|</span> 需求信息</div>
        </div>
        <demand-form type="detail" />
      </div>
    </div>
  </div>
</template>

<script>
import DemandForm from '../common/demand-form.vue';
import { changeDemandColor } from '../../../../utils/index';

export default {
  components: {
    DemandForm
  },
  props: ['id'],
  computed: {
    demandDetail() {
      return this.$store.state.demand.demandDetail;
    }
  },
  methods: {
    changeDemandColor,
    toProductDetail(id) {
      if (this.$store.state.menuData.links.indexOf('/product-list') > -1) {
        this.$router.push(`/product-list/${id}`);
        this.$store.commit('setEntry', 'detail');
      } else {
        this.$message.error('无权限访问');
      }
    }
  }
};
</script>
