<template>
  <section>
    <div class="profit-plan_title">
      项目进度计划表
    </div>
    <div class="profit-plan_title">
      <el-table
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="getSchedule.list"
      >
        <el-table-column
          label="序号"
          width="60px"
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
              @click="
                editStage(
                  scope.row.stage_desc,
                  scope.row.id,
                  scope.row.estimated_finish_time
                )
              "
            >
              编辑
            </el-button>
            <el-button
              v-if="
                show &&
                  (scope.row.stage === 60 || scope.row.stage === 70) &&
                  scope.row.actual_finish_time === ''
              "
              type="text"
              @click="showActualTimeForm(scope.row.id)"
            >
              填写实际完成时间
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        :disabled="getSchedule.list.length !== 0"
        class="profit-plan_btn"
        @click="showSetStage"
      >
        设置阶段完成时间
      </el-button>
    </div>

    <el-dialog
      v-model="setStageVisible"
      width="30%"
      :close-on-click-modal="false"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
      width="30%"
      title="编辑"
      :close-on-click-modal="false"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
            :disabled-date="setDisabledDate"
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
      width="30%"
      :close-on-click-modal="false"
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
            :default-time="$global.defaultTime"
            style="width: 100%"
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
  </section>
</template>

<script>
import { timestamp,setDisabledDate } from '../../../../utils';
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
      projectScheduleId: 0
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
    setDisabledDate,
    editStage(desc, code, time) {
      this.editStageVisible = true;
      this.stageLabel = desc;
      this.stageForm.estimated_finish_time = time;
      this.projectScheduleId = code;
    },
    closeStageForm() {
      this.editStageVisible = false;
    },
    closeSetStageForm() {
      this.setStageVisible = false;
    },
    showActualTimeForm(id) {
      this.actualTimeVisible = true;
      this.projectScheduleId = id;
    },
    closeActualTimeForm() {
      this.actualTimeVisible = false;
    },
    async updateEstimatedTime(val) {
      let body = {
        id: this.projectScheduleId,
        estimated_finish_time: timestamp(val)
      };
      try {
        await this.$store.dispatch('product/project/updateEstimatedTime', body);
        this.editStageVisible = false;
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    async updateActualTime(val) {
      let body = {
        id: this.projectScheduleId,
        actual_finish_time: timestamp(val)
      };
      try {
        await this.$store.dispatch('product/project/updateActualTime', body);
        this.actualTimeVisible = false;
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    async setStageTime(val) {
      let body = val;
      body['product_id'] = +this.$route.params.productId;
      try {
        await this.$store.dispatch('product/project/setStageTime', body);
        this.setStageVisible = false;
        this.getProcessTable();
      } catch (err) {
        return;
      }
    },
    submitStageForm() {
      this.$refs.stageForm.validate((valid) => {
        if (valid) {
          this.updateEstimatedTime(this.stageForm.estimated_finish_time);
        }
      });
    },
    submitSetStageForm() {
      let stageForm = JSON.parse(JSON.stringify(this.setStageForm));
      for (let time in stageForm) {
        stageForm[time] = timestamp(stageForm[time]);
      }
      this.$refs.setStageForm.validate((valid) => {
        if (valid) {
          this.setStageTime(stageForm);
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
