<template>
  <div class="profit-plan_title">
    项目进度计划表
  </div>
  <div class="profit-plan_title">
    <el-table
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :data="getSchedule.list"
    >
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      />
      <el-table-column
        label="阶段名称"
        prop="stage_desc"
      />
      <el-table-column
        label="计划完成时间"
        prop="estimated_finish_time"
      />
      <el-table-column
        label="实际完成时间"
        prop="actual_finish_time"
      />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="changeColor(scope.row.state)">
            {{ scope.row.state_desc }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="isDisabled"
            type="text"
            @click="editStage(scope.row.stage_desc, scope.row.stage)"
          >
            编辑
          </el-button>
          <el-button
            v-if="show && (scope.row.stage === 60 || scope.row.stage === 70)"
            type="text"
            @click="showActualTimeForm(scope.row.stage)"
          >
            填写实际完成时间
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      :disabled="!isDisabled"
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
          v-model="setStageForm.pricing"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="专利阶段"
        prop="patent"
      >
        <el-date-picker
          v-model="setStageForm.patent"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="样品阶段"
        prop="sample"
      >
        <el-date-picker
          v-model="setStageForm.sample"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="下单阶段"
        prop="order"
      >
        <el-date-picker
          v-model="setStageForm.order"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="包材阶段"
        prop="package"
      >
        <el-date-picker
          v-model="setStageForm.package"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="出货阶段"
        prop="shipment"
      >
        <el-date-picker
          v-model="setStageForm.shipment"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="开卖阶段"
        prop="selling"
      >
        <el-date-picker
          v-model="setStageForm.selling"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
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
        prop="estimated_finish_time"
      >
        <el-date-picker
          v-model="stageForm.estimated_finish_time"
          type="datetime"
          placeholder="请选择计划完成时间"
          clearable
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

  <el-dialog
    v-model="actualTimeVisible"
    title="填写"
    width="20%"
  >
    <el-form
      ref="timeForm"
      :model="timeForm"
    >
      <el-form-item
        label="实际完成时间"
        prop="actual_finish_time"
        :rules="[{ required: true, message: '请选择实际完成时间' }]"
      >
        <el-date-picker
          v-model="timeForm.actual_finish_time"
          type="datetime"
          placeholder="请选择实际完成时间"
          clearable
        />
      </el-form-item>
      <el-divider />
      <div style="text-align: right">
        <el-button
          class="close-btn"
          @click="closeActualTimeForm"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitActualTimeForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  inject: ['getProcessTable'],
  props: ['getSchedule', 'changeColor'],
  data() {
    return {
      editStageVisible: false,
      setStageVisible: false,
      stageLabel: null,
      stageForm: {},
      stageRules: {
        estimated_finish_time: [
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
        patent: [
          {
            required: true,
            message: '请选择专利时间'
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
        package: [
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
      },
      actualTimeVisible: false,
      timeForm: {},
      estimatedStageCode: 0,
      actualSatgeCode: 0
    };
  },
  computed: {
    isDisabled() {
      return this.getSchedule.review_state === 10 ? true : false;
    },
    show() {
      return this.getSchedule.review_state !== 10;
    }
  },
  methods: {
    editStage(desc, code) {
      this.editStageVisible = true;
      this.stageLabel = desc;
      this.estimatedStageCode = code;
    },
    closeStageForm() {
      this.editStageVisible = false;
    },
    closeSetStageForm() {
      this.setStageVisible = false;
    },
    showActualTimeForm(code) {
      this.actualTimeVisible = true;
      this.actualSatgeCode = code;
    },
    closeActualTimeForm() {
      this.actualTimeVisible = false;
    },
    async updateEstimatedTime(val) {
      let body = {
        id: this.estimatedStageCode,
        estimated_finish_time: val
      };
      await this.$store.dispatch('product/project/updateEstimatedTime', body);
      this.editStageVisible = false;
      this.getProcessTable();
    },
    async updateActualTime(val) {
      let body = {
        id: this.actualSatgeCode,
        actual_finish_time: val
      };
      await this.$store.dispatch('product/project/updateActualTime', body);
      this.actualTimeVisible = false;
      this.getProcessTable();
    },
    async setStageTime(val) {
      let body = val;
      body['product_id'] = this.$route.params.productId;
      await this.$store.dispatch('product/project/setStageTime', body);
      this.setStageVisible = false;
      this.getProcessTable();
    },
    submitStageForm() {
      this.$refs.stageForm.validate((valid) => {
        if (valid) {
          this.updateEstimatedTime(this.stageForm.estimated_finish_time);
        }
      });
    },
    submitSetStageForm() {
      this.$refs.setStageForm.validate((valid) => {
        if (valid) {
          this.setStageTime(this.setStageForm);
        }
      });
    },
    submitActualTimeForm() {
      this.$refs.timeForm.validate((valid) => {
        if (valid) {
          this.updateActualTime(this.timeForm.actual_finish_time);
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
