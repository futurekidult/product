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
    <div class="form-item">
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
    </div>
    <el-form-item
      label="品牌"
      style="width: 50%"
    >
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
      <el-form-item
        :label="'市场' + (index + 1)"
        style="width: 50%"
      >
        <el-select
          v-model="item.id"
          disabled
        >
          <el-option
            v-for="content in market"
            :key="content.key"
            :label="content.value"
            :value="content.key"
          />
        </el-select>
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
  props: ['attachment', 'productForm'],
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
      market: [],
      platform: [],
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    async getParams() {
      if (localStorage.getItem('params')) {
        let { demand } = JSON.parse(localStorage.getItem('params'));
        this.market = demand.market;
        this.platform = demand.platform;
      } else {
        await this.$store.dispatch('getSystemParameters');
        this.getParams();
      }
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
