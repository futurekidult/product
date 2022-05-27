<template>
  <div v-loading="$store.state.product.mouldLoading">
    <div class="member-item">
      <div class="select-title">
        <span class="line">|</span> 模具信息
      </div>
      <el-button
        type="primary"
        @click="showMouldSelectedForm"
      >
        选择模具
      </el-button>
    </div>

    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="mouldList"
    >
      <el-table-column
        label="模具ID"
        prop="mould_id"
      />
      <el-table-column
        label="模具名称"
        prop="name"
      />
      <el-table-column
        label="开模工厂"
        prop="mould_factory"
      />
      <el-table-column
        label="创建时间"
        prop="create_time"
      />
      <el-table-column
        label="创建人"
        prop="creator"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            @click="deleteMould(scope.row.id)"
          >
            删除
          </el-button>
          <el-button type="text">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="mouldList.length"
      :get-list="getMould"
    />
  </div>

  <el-dialog
    v-model="mouldSelectedVisible"
    title="选择模具"
    width="40%"
  >
    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="allList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="模具ID"
        prop="id"
      />
      <el-table-column
        label="模具名称"
        prop="name"
      />
      <el-table-column
        label="开模工厂"
        prop="mould_factory"
      />
      <el-table-column
        label="创建时间"
        prop="create_time"
      />
      <el-table-column
        label="创建人"
        prop="creator"
      />
    </el-table>

    <base-pagination
      :length="20"
      :get-list="getAllMould"
    />

    <el-divider style="margin: 68px 0px 20px" />
    <div style="text-align: right">
      <el-button
        class="close-btn"
        @click="closeMouldSelectedForm"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="submitResult"
      >
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getAllMould', 'getMould'],
  props: ['mouldList', 'allList'],
  data() {
    return {
      mouldSelectedVisible: false,
      multipleSelection: [],
      mouldIds: []
    };
  },
  methods: {
    showMouldSelectedForm() {
      this.mouldSelectedVisible = true;
    },
    closeMouldSelectedForm() {
      this.mouldSelectedVisible = false;
    },
    handleSelectionChange(ids) {
      this.mouldIds = ids.map((item) => {
        return item.id;
      });
    },
    async submitResult() {
      let body = {
        product_id: +this.$params.productId,
        mould_id: this.mouldIds
      };
      await this.$store.dispatch('product/createMould', body);
      this.mouldSelectedVisible = false;
      this.getMould();
    },
    async deleteMould(id) {
      await this.$store.dispatch('product/deleteMould', {
        relation_id: id
      });
      this.getMould();
    }
  }
};
</script>
