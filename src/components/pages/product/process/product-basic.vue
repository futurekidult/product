<template>
  <el-tree
    :data="list"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />

  <el-form>
    <el-form-item label="产品名称" />
    <el-form-item label="产品图片" />
    <el-form-item label="大品类" />
    <el-form-item label="小品类" />
    <el-form-item label="品牌" />
    <el-form-item label="是否新品类" />
    <el-form-item label="是否新产品" />
    <el-form-item label="市场" />
    <el-form-item label="平台" />
  </el-form>
</template>

<script>
export default {
  props: ['id'],
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
      }
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
