<template>
  <div class="profit-plan_title">
    项目进度计划表
  </div>
  <div class="profit-plan_title">
    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      />
      <el-table-column
        label="阶段名称"
        prop="stage"
        align="center"
      />
      <el-table-column
        label="计划完成时间"
        align="center"
      />
      <el-table-column
        label="实际完成时间"
        align="center"
      />
      <el-table-column
        label="状态"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template #default="scope">
          <el-button @click="editStage(scope.row.stage)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      class="profit-plan_btn"
      @click="showSetStage"
    >
      设置阶段完成时间
    </el-button>
  </div>

  <el-dialog
    v-model="setStageVisible"
    width="20%"
    title="设置阶段完成时间"
  >
    <el-form
      ref="setStageForm"
      :model="setStageForm"
      :rules="setStageRules"
      label-width="100px"
    >
      <el-form-item
        label="定价阶段"
        prop="pricing"
      >
        <el-date-picker
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-form-item
        label="样品阶段"
        prop="sample"
      >
        <el-date-picker
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-form-item
        label="下单阶段"
        prop="order"
      >
        <el-date-picker
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-form-item
        label="包材阶段"
        prop="packaging"
      >
        <el-date-picker
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-form-item
        label="出货阶段"
        prop="shipment"
      >
        <el-date-picker
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-form-item
        label="开卖阶段"
        prop="selling"
      >
        <el-date-picker
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeSetStageForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitSetStageForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="editStageVisible"
    width="20%"
    title="编辑"
  >
    <el-form
      ref="stageForm"
      :model="stageForm"
      :rules="stageRules"
    >
      <el-form-item
        :label="stageLabel"
        prop="estimatedFinishTime"
      >
        <el-date-picker
          v-model="stageForm.estimatedFinishTime"
          type="datetime"
          placeholder="请选择计划完成时间"
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeStageForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitStageForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      editStageVisible: false,
      setStageVisible: false,
      stageLabel: null,
      stageForm: {},
      stageRules: {
        estimatedFinishTime: [
          {
            required: true,
            message: '请选择计划完成时间'
          }
        ]
      },
      setStageForm: {},
      setStageRules: {
        pricing: [
          {
            required: true,
            message: '请选择定价时间'
          }
        ],
        sample: [
          {
            required: true,
            message: '请选择样品时间'
          }
        ],
        order: [
          {
            required: true,
            message: '请选择下单时间'
          }
        ],
        packaging: [
          {
            required: true,
            message: '请选择包材时间'
          }
        ],
        shipment: [
          {
            required: true,
            message: '请选择出货时间'
          }
        ],
        selling: [
          {
            required: true,
            message: '请选择开卖时间'
          }
        ]
      }
    };
  },
  methods: {
    editStage(val) {
      this.editStageVisible = true;
      this.stageLabel = val;
    },
    closeStageForm() {
      this.editStageVisible = false;
    },
    closeSetStageForm() {
      this.setStageVisible = false;
    },
    submitStageForm() {
      this.$refs.stageForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    submitSetStageForm() {
      this.$refs.setStageForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    showSetStage() {
      this.setStageVisible = true;
    }
  }
};
</script>

<style scoped>
.profit-plan_btn {
  margin-top: 15px;
}
</style>
