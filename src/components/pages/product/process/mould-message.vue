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
      stripe
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
            @click="showDeleteDialog(scope.row.id)"
          >
            删除
          </el-button>
          <span class="table-btn">|</span>
          <el-button 
            type="text" 
            @click="toDetail(scope.row.mould_id)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      :length="$store.state.product.mouldListLength"
      :get-list="getMould"
    />
  </div>

  <el-dialog
    v-model="deleteDialog"
    title="提示"
    width="20%"
  >
    <div class="result-content">
      确认要删除该模具吗
    </div>
    <div style="text-align: center">
      <el-button
        class="mould-btn"
        @click="closeDeleteDialog"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        class="mould-btn"
        @click="deleteMould"
      >
        提交
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    v-model="mouldSelectedVisible"
    title="选择模具"
    width="40%"
  >
    <el-table
      border
      stripe
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
        width="200px"
      />
      <el-table-column
        label="创建人"
        prop="creator"
      />
    </el-table>

    <base-pagination
      :length="$store.state.product.selectedMouldListLength"
      :get-list="getAllMouldList"
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
import { changeTimestamp } from '../../../../utils';
export default {
  inject: [ 'getMould'],
  props: ['mouldList'],
  data() {
    return {
      mouldSelectedVisible: false,
      multipleSelection: [],
      mouldIds: [],
      deleteDialog: false,
      mouldId: 0,
      allMouldList: []
    };
  },
  methods: {
    async getAllMouldList(currentPage = 1, pageSize = 10) {
      let params = {
        page_size: pageSize,
        current_page: currentPage
      };
      try {
        await this.$store.dispatch('product/getSelectedMouldList', { params });
        this.allMouldList = this.$store.state.product.selectedMouldList;
        this.allMouldList.forEach((item) => {
          changeTimestamp(item, 'create_time');
        });
       this.mouldSelectedVisible = true;
      } catch (err) {
        return;
      }
    },
    showMouldSelectedForm() {
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
        product_id: +this.$route.params.productId,
        mould_id: this.mouldIds
      };
      try {
        await this.$store.dispatch('product/createMould', body);
        this.mouldSelectedVisible = false;
        this.getMould();
      } catch (err) {
        return;
      }
    },
    async deleteMould() {
      try {
        await this.$store.dispatch('product/deleteMould', {
          relation_id: this.mouldId
        });
        this.deleteDialog = false;
        this.getMould();
      } catch (err) {
        return;
      }
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
    showDeleteDialog(id) {
      this.deleteDialog = true;
      this.mouldId = id;
    },
    toDetail(id) {
      this.$router.push(`/mould-list/${id}`);
      this.$store.commit('setActiveTab', 'design');
    }
  }
};
</script>
