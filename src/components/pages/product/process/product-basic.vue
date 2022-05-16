<template>
  <el-tree
    :data="list"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />

  <el-form
    :model="productForm"
    label-width="100px"
    style="width: 50%"
  >
    <el-form-item label="产品名称">
      <el-input
        v-model="productForm.name"
        disabled
      />
    </el-form-item>
    <el-form-item label="产品图片">
      <el-upload
        action=""
        :show-file-list="false"
      >
        <el-button
          type="primary"
          disabled
        >
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item style="margin-bottom: 18px">
      <div
        v-for="(item, i) in attachment"
        :key="i"
        class="attachment-list"
      >
        <div>
          {{ item.name }}
        </div>
        <el-button type="text">
          下载
        </el-button>
      </div>
    </el-form-item>
    <el-form-item label="大品类">
      <el-input
        v-model="productForm.big_category_desc"
        disabled
      />
    </el-form-item>
    <el-form-item label="小品类">
      <el-input
        v-model="productForm.small_category_desc"
        disabled
      />
    </el-form-item>
    <el-form-item label="品牌">
      <el-input
        v-model="productForm.brand"
        disabled
      />
    </el-form-item>
    <el-form-item label="是否新品类">
      <el-radio
        v-for="item in options"
        :key="item.value"
        v-model="productForm.is_new_category"
        :label="item.value"
        disabled
      >
        {{ item.label }}
      </el-radio>
    </el-form-item>
    <el-form-item label="是否新产品">
      <el-radio
        v-for="item in options"
        :key="item.value"
        v-model="productForm.is_new_product"
        :label="item.value"
        disabled
      >
        {{ item.label }}
      </el-radio>
    </el-form-item>
    <div
      v-for="(item, index) in productForm.market"
      :key="index"
    >
      <el-form-item :label="'市场' + (index + 1)">
        <el-input
          v-model="item.id"
          disabled
        />
      </el-form-item>
      <el-form-item
        v-model="item.id"
        :label="'平台' + (index + 1)"
      >
        <el-checkbox-group v-model="item.platform">
          <el-checkbox
            v-for="(content, i) in platform"
            :key="i"
            :label="content.key"
            disabled
          >
            {{ content.value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          name: '经营管理中心',
          children: [
            {
              id: 1,
              name: 'IT部',
              children: [
                {
                  id: 1,
                  name: '技术组'
                },
                {
                  id: 1,
                  name: '产品组'
                }
              ],
              member_list: [
                {
                  user_id: 1,
                  name: '李四',
                  title: '职位'
                },
                {
                  user_id: 1,
                  name: '李四',
                  title: '职位'
                }
              ]
            }
          ],
          member_list: [
            {
              user_id: 1,
              name: '张三',
              title: '职位'
            },
            {
              user_id: 1,
              name: '张三',
              title: '职位'
            }
          ]
        },
        {
          id: 1,
          name: '新业务中心',
          children: [
            {
              id: 1,
              name: '独立站',
              children: [],
              member_list: [
                {
                  user_id: 1,
                  name: '张三',
                  title: '职位'
                },
                {
                  user_id: 1,
                  name: '张三',
                  title: '职位'
                }
              ]
            }
          ],
          member_list: [
            {
              user_id: 1,
              name: '张三',
              title: '职位'
            },
            {
              user_id: 1,
              name: '张三',
              title: '职位'
            }
          ]
        }
      ],
      defaultProps: {
        children: this.childrenFunc,
        label: 'name'
      },
      base: {
        name: '产品名称',
        images: [
          {
            id: 1,
            type: 1,
            name: '图片1.jpg'
          },
          {
            id: 2,
            type: 1,
            name: '图片2.jpg'
          },
          {
            id: 3,
            type: 1,
            name: '图片3.jpg'
          }
        ],
        big_category_id: 1,
        big_category_desc: '大品类',
        small_category_id: 10,
        small_category_desc: '小品类',
        brand: '品牌',
        is_new_category: 1,
        is_new_product: 1,
        market: [
          {
            id: 1,
            name: '市场名',
            platform: [10, 20]
          },
          {
            id: 2,
            name: '市场名1',
            platform: [10, 20]
          }
        ]
      },
      market: [
        {
          key: 1,
          value: '美国'
        },
        {
          key: 2,
          value: '英国'
        },
        {
          key: 3,
          value: '欧盟'
        },
        {
          key: 4,
          value: '日本'
        }
      ],
      platform: [
        {
          key: 1,
          value: 'Amazon'
        },
        {
          key: 2,
          value: 'Lowe\'s'
        },
        {
          key: 3,
          value: 'Wayfair'
        },
        {
          key: 4,
          value: 'Walmart'
        },
        {
          key: 5,
          value: 'Homedepot'
        }
      ],
      productForm: {},
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      attachment: []
    };
  },
  mounted() {
    this.getProductDetail();
  },
  methods: {
    async getProductDetail() {
      await this.$store.dispatch('product/getProductDetail', {
        params: {
          id: +this.$route.params.productId
        }
      });
      this.productForm = this.$store.state.product.productDetail;
      this.attachment = this.productForm.images;
    },
    handleNodeClick(data) {
      console.log(data);
    },
    childrenFunc(data) {
      if (data.member_list) {
        for (const item of data.member_list) {
          data.children.push(item);
        }
      }
      return data.children;
    }
  }
};
</script>
