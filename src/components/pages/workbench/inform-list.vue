<template>
  <div v-loading="$store.state.workbench.notificationListLoading">
    <div class="select-title">
      <span class="line">|</span> 通知
    </div>
    <el-table
      border
      stripe
      empty-text="无数据"
      :data="notificationList"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        fixed
        label="通知ID"
        prop="id"
        width="100"
      />
      <el-table-column
        fixed
        label="通知标题"
      >
        <template #default="scope">
          <div :class="scope.row.state === 0 ? 'is-read' : ''">
            {{ scope.row.content }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="通知时间"
        prop="create_time"
        width="200"
      />
      <el-table-column
        label="操作"
        width="100"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            type="text"
            :disabled="scope.row.state === 1"
            @click="noticationRead(scope.row.id)"
          >
            已读
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['notificationList', 'getList'],
  methods: {
    async noticationRead(id) {
      try {
        await this.$store.dispatch('workbench/noticationRead', {
          id
        });
        this.getList();
      } catch (err) {
        return;
      }
    }
  }
};
</script>
