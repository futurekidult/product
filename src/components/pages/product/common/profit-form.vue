<template>
  <el-dialog
    v-model="visible"
    width="40%"
    title="新增核算利润"
    @close="cancel"
  >
    <el-form
      ref="profitForm"
      :model="profitForm"
      :rules="profitRules"
      label-width="110px"
    >
      <el-form-item
        label="市场"
        prop="market"
      >
        <el-select
          v-model="profitForm.market"
          placeholder="请选择市场"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item
        label="是否开模"
        prop="isMouldMaking"
      >
        <el-select
          v-model="profitForm.isMouldMaking"
          placeholder="请选择是否开模"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-divider />

      <el-scrollbar height="400px">
        <div
          v-for="(item, index) in profitForm.info"
          :key="index"
        >
          <el-form-item
            :label="'平台' + (index + 1)"
            :prop="`info.${index}.platform`"
            :rules="profitRules.platform"
          >
            <el-select
              v-model="item.platform"
              placeholder="请选择平台"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item
            :label="'销售价' + (index + 1)"
            required
          >
            <el-form-item
              :prop="`info.${index}.currency`"
              :rules="profitRules.currency"
            >
              <el-select
                v-model="item.currency"
                placeholder="请选择货币"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item
              style="margin-left: 6px"
              :prop="`info.${index}.selling_price`"
              :rules="profitRules.sellingPrice"
            >
              <el-input
                v-model="item.sellingPrice"
                placeholder="请输入金额"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item
              style="margin-left: 6px"
              :prop="`info.${index}.selling_price_rmb`"
            >
              <el-input
                v-model="item.sellingPriceRmb"
                :disabled="true"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item
            :label="'采购参考价' + (index + 1)"
            :prop="`info.${index}.reference_price`"
            required
          >
            <el-input
              v-model="item.referencePrice"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item
            :label="'运营专员' + (index + 1)"
            :prop="`info.${index}.operations_specialist_id`"
            :rules="profitRules.operationsSpecialistId"
          >
            <el-select
              v-model="profitForm.operationsSpecialistId"
              placeholder="请选择运营专员"
              :disabled="isDisabled"
            />
          </el-form-item>
        </div>
        <!-- <el-table
          :data="profitForm.tableData"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column label="平台">
            <template #default="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.platform'"
                :rules="{
                  required: true,
                  message: '请选择平台'
                }"
              >
                <el-select
                  v-model="scope.row.platform"
                  placeholder="请选择平台"
                  :disabled="isDisabled"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价"
            required
          >
            <template #default="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.currency'"
                :rules="{
                  required: true,
                  message: '请选择货币'
                }"
              >
                <el-select
                  v-model="scope.row.currency"
                  placeholder="请选择货币"
                  :disabled="isDisabled"
                />
              </el-form-item>
              <el-form-item
                :prop="'tableData.' + scope.$index + '.money'"
                :rules="{
                  required: true,
                  message: '请输入金额'
                }"
              >
                <el-input
                  v-model="scope.row.money"
                  placeholder="请输入金额"
                  :disabled="isDisabled"
                />
              </el-form-item>
              <el-form-item
                :prop="'tableData.' + scope.$index + '.yuan'"
                :rules="{
                  required: true,
                  message: '请输入人民币'
                }"
              >
                <el-input
                  v-model="scope.row.yuan"
                  placeholder="请输入人民币"
                  :disabled="isDisabled"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="采购参考价"
            prop="referencePrice"
          >
            <template #default="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.referencePrice'"
                :rules="{
                  required: true,
                  message: '请输入参考价'
                }"
              >
                <el-input
                  v-model="scope.row.referencePrice"
                  placeholder="请输入参考价"
                  :disabled="isDisabled"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="运营专员">
            <template #default="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.operationsSpecialist'"
                :rules="{
                  required: true,
                  message: '请选择运营专员'
                }"
              >
                <el-select
                  v-model="scope.row.operationsSpecialist"
                  placeholder="请选择运营专员"
                  :disabled="isDisabled"
                />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table> -->
        <el-form-item>
          <el-button
            v-if="type !== 'view'"
            style="margin: 15px 0"
            @click="addRow"
          >
            + 新增平台
          </el-button>
          <el-button
            v-if="type !== 'view'"
            style="margin: 15px"
            type="danger"
            @click="deleteRow"
          >
            - 删除平台
          </el-button>
        </el-form-item>
        <el-divider v-if="type !== 'view'" />
      </el-scrollbar>
      <div
        v-if="type !== 'view'"
        style="text-align: right"
      >
        <el-button
          class="close-btn"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitProfitForm"
        >
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'title', 'type'],
  emits: ['hide-dialog'],
  data() {
    return {
      visible: this.dialogVisible,
      profitForm: {
        info: [{}]
      },
      profitRules: {
        market: [
          {
            required: true,
            message: '请选择市场'
          }
        ],
        isMouldMaking: [
          {
            required: true,
            message: '请选择是否开模'
          }
        ],
        platform: [
          {
            required: true,
            message: '请选择平台'
          }
        ],
        currency: [
          {
            required: true,
            message: '请选择货币'
          }
        ],
        sellingPrice: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        operationsSpecialistId: [
          {
            required: true,
            message: '请选择运营专员'
          }
        ]
      }
    };
  },
  computed: {
    isDisabled() {
      if (this.type === 'view') {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    cancel() {
      this.visible = false;
      this.$emit('hide-dialog', this.visible);
    },
    addRow() {
      this.profitForm.info.push({});
    },
    deleteRow() {
      this.profitForm.info.pop();
    },
    submitProfitForm() {
      console.log(this.profitForm.tableData);
      this.$refs.profitForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    }
  }
};
</script>
