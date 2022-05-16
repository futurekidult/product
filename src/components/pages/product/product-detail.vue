<template>
  <div>
    <router-view />
    <div v-if="isParent">
      <div class="border">
        <base-tag
          mode="warning"
          type="tag"
        >
          <span>{{ productBase.state_desc }}</span>
        </base-tag>

        <el-descriptions
          v-loading="$store.state.product.baseLoading"
          :title="productBase.name"
          :column="4"
        >
          <el-descriptions-item>
            <template #label>
              关联需求
            </template>
            <el-button type="text">
              查看
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="产品定位">
            {{ productBase.positioning_desc }}
          </el-descriptions-item>
          <el-descriptions-item label="项目经理">
            {{ productBase.manager_desc }}
          </el-descriptions-item>
          <el-descriptions-item label="项目管理员">
            {{ productBase.administrator_desc }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="border">
        <el-tabs
          v-model="activeName"
          v-loading="$store.state.product.detailLoading"
        >
          <el-tab-pane
            label="基本信息"
            name="basic"
          >
            <product-basic />
          </el-tab-pane>
          <el-tab-pane
            label="项目成员"
            name="member"
          >
            <related-member />
          </el-tab-pane>
          <el-tab-pane
            label="项目调研"
            name="survey"
          >
            <product-survey />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 20"
            label="项目立项"
            name="project"
          >
            <project-setup />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="定价信息"
            name="price"
          >
            <product-price :change-color="changeCellColor" />
          </el-tab-pane>
          <el-tab-pane
            label="专利排查"
            name="patent"
          >
            <product-patent />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="模具信息"
            name="mould"
          >
            <mould-message />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="样品信息"
            name="sample"
          >
            <sample-message />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="测试问题"
            name="test"
          >
            <question-all />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="下单信息"
            name="order"
          >
            <product-order />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="包材设计"
            name="package"
          >
            <product-package :change-color="changeCellColor" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import ProductBasic from './process/product-basic.vue';
import RelatedMember from './process/related-member.vue';
import ProductSurvey from './process/product-survey.vue';
import ProjectSetup from './process/project-setup.vue';
import ProductPrice from './process/product-price.vue';
import ProductPatent from './process/product-patent.vue';
import SampleMessage from './process/sample-message.vue';
import MouldMessage from './process/mould-message.vue';
import QuestionAll from './process/question-all.vue';
import ProductOrder from './process/product-order.vue';
import ProductPackage from './process/product-package.vue';

export default {
  components: {
    ProductBasic,
    RelatedMember,
    ProductSurvey,
    ProjectSetup,
    ProductPrice,
    ProductPatent,
    MouldMessage,
    SampleMessage,
    QuestionAll,
    ProductOrder,
    ProductPackage
  },
  props: ['productId'],
  data() {
    return {
      status: 2,
      activeName: 'basic',
      id: 0,
      productBase: {}
    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'order detail';
    }
  },
  mounted() {
    this.getProductBase();
  },
  methods: {
    async getProductBase() {
      await this.$store.dispatch('product/getProductBase', {
        params: {
          id: +this.$route.params.productId
        }
      });
      this.productBase = this.$store.state.product.productBase;
    },
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    }
  }
};
</script>
