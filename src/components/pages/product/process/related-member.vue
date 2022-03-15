<template>
  <el-button
    type="primary"
    @click="toAdd"
  >
    新增成员
  </el-button>

  <el-table
    border
    empty-text="无数据"
  >
    <el-table-column label="序号" />
    <el-table-column label="成员名称" />
    <el-table-column label="成员角色" />
    <el-table-column label="创建时间" />
    <el-table-column label="操作">
      <el-button type="text">
        查看
      </el-button>
      <el-button type="text">
        修改
      </el-button>
      <el-button type="text">
        删除
      </el-button>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="addDialog"
    width="30%"
  >
    <member-form />
  </el-dialog>
</template>

<script>
import MemberForm from '../common/member-form.vue';

export default {
  components: {
    MemberForm
  },
  data() {
    return {
      addDialog: false
    };
  },
  methods: {
    toAdd() {
      this.addDialog = true;
    }
  }
};
</script>
