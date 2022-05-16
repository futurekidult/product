<template>
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

  <base-pagination :length="mouldList.length" />

  <el-dialog
    v-model="mouldSelectedVisible"
    title="选择模具"
    width="40%"
  >
    <el-table
      border
      empty-text="无数据"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="allMouldList"
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

    <base-pagination :length="allMouldList.length" />

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
  data() {
    return {
      mouldList: [],
      mouldSelectedVisible: false,
      allMouldList: [],
      multipleSelection: [],
      mouldIds: []
    };
  },
  mounted() {
    this.getMouldList();
  },
  methods: {
    async getMouldList(currentPage = 1, pageSize = 10) {
      let params = {
        page_size: pageSize,
        current_page: currentPage,
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/getMouldList', { params });
      this.mouldList = this.$store.state.product.mouldList;
    },
    async getAllMouldList() {
      let params = {
        page_size: 10,
        current_page: 1
      };
      await this.$store.dispatch('getAllMouldList', { params });
      this.allMouldList = this.$store.state.allMouldList;
    },
    showMouldSelectedForm() {
      this.mouldSelectedVisible = true;
      this.getAllMouldList();
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
    },
    async deleteMould(id) {
      await this.$store.dispatch('product/deleteMould', {
        relation_id: id
      });
    }
  }
};
</script>
