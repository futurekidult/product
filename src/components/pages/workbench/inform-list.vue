<template>
  <div
    v-loading="$store.state.workbench.notificationListLoading"
    class="border"
  >
    <div class="select-title">
      <span class="line">|</span> 通知
    </div>
    <el-table
      :data="notificationList"
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        prop="id"
        label="序号"
      />
      <el-table-column
        label="通知标题"
        width="600px"
      >
        <template #default="scope">
          <div :class="scope.row.is_read === 0 ? 'is-read' : ''">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联产品ID">
        <template #default="scope">
          <el-button type="text">
            {{ scope.row.product_id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="通知时间"
        prop="create_time"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            :disabled="scope.row.is_read === 1"
            @click="noticationRead(scope.row.id)"
          >
            已读
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="notificationList.length"
      :get-list="getList"
    />
  </div>
</template>

<script>
export default {
  props: ['notificationList', 'getList'],
  methods: {
    async noticationRead(id) {
      await this.$store.dispatch('workbench/noticationRead', {
        params: {
          id
        }
      });
      this.getList();
    }
  }
};
</script>
