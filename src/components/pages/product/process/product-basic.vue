<template>
  <el-tree
    :data="list"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
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
