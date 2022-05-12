<template>
  <el-tree
    :data="list"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />

  <el-form>
    <el-form-item label="产品名称">
      <el-input />
    </el-form-item>
    <el-form-item label="产品图片" />
    <el-form-item label="大品类">
      <el-input />
    </el-form-item>
    <el-form-item label="小品类">
      <el-input />
    </el-form-item>
    <el-form-item label="品牌">
      <el-input />
    </el-form-item>
    <el-form-item label="是否新品类">
      <el-radio label="1">
        是
      </el-radio>
      <el-radio label="0">
        否
      </el-radio>
    </el-form-item>
    <el-form-item label="是否新产品">
      <el-radio label="1">
        是
      </el-radio>
      <el-radio label="0">
        否
      </el-radio>
    </el-form-item>
    <div
      v-for="(item, index) in market"
      :key="index"
    >
      <el-form-item label="市场">
        <el-input />
      </el-form-item>
      <el-form-item label="平台">
        <!-- <el-checkbox-group>
          <el-checkbox
            v-for="(item, i) in "
            :key="i"
            :label="item.key"
          >
            {{ item.value }}
          </el-checkbox>
        </el-checkbox-group> -->
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
      market: {}
    };
  },
  methods: {
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
