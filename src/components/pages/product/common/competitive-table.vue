<template>
  <el-collapse class="collapse-item">
    <el-collapse-item title="竞品信息">
      <el-scrollbar height="440px">
        <el-form
          :model="productForm"
          label-width="100px"
        >
          <div
            v-for="(item, index) in productForm.competitive_product"
            :key="index"
            class="form-item_width"
          >
            <el-form-item
              :label="'竞品图片' + (index + 1)"
              :prop="`competitive_product.${index}.images`"
            >
              <base-upload
                type="image"
                :is-disabled="true"
                :list="productForm.competitive_product[index].images"
                tag="竞品图片"
                count="8"
                url="solution-competitive-img"
              />
            </el-form-item>
            <el-form-item
              :label="'竞品链接' + (index + 1)"
              :prop="`competitive_product.${index}.link`"
            >
              <el-input
                v-model="item.link"
                type="textarea"
                :rows="6"
                disabled
              />
            </el-form-item>
            <el-form-item
              :label="'竞品参数' + (index + 1)"
              :prop="`competitive_product.${index}.parameter`"
            >
              <el-input
                v-model="item.parameter"
                type="textarea"
                :rows="6"
                disabled
              />
            </el-form-item>
            <el-form-item
              :label="'对标理由' + (index + 1)"
              :prop="`competitive_product.${index}.benchmarking_reason`"
            >
              <el-input
                v-model="item.benchmarking_reason"
                type="textarea"
                :rows="6"
                disabled
              />
            </el-form-item>
          </div>
        </el-form>
      </el-scrollbar>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  props: ['productForm']
};
</script>
