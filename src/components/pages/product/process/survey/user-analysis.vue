<template>
  <div class="survey-title">
    调研进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="调研负责人" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    label-width="110px"
    style="width: 50%"
  >
    <div class="form-item">
      <el-form-item label="性别">
        <el-select />
      </el-form-item>
      <el-form-item label="年龄">
        <el-select />
      </el-form-item>
      <el-form-item label="职业">
        <el-input />
      </el-form-item>
      <el-form-item label="学历">
        <el-select />
      </el-form-item>
      <el-form-item label="家庭年收入">
        <el-select />
      </el-form-item>
      <el-form-item label="婚姻状况">
        <el-select />
      </el-form-item>
    </div>
    <el-form-item style="width: 100%">
      <el-table
        :data="tableData.tBody"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <template
          v-for="(column, i) in tableData.tHead"
          :key="i"
        >
          <el-table-column
            :prop="column.id"
            :label="column.name"
          >
            <template #default="scope">
              <el-select
                v-if="scope.row.isSet"
                v-model="tableData.sel['select_' + column.id]"
                placeholder="请选择"
                @change="selectChange($event, column)"
              >
                <el-option
                  v-for="item in column.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span v-else>{{ scope.row[column.id] }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          label="操作"
          width="100"
        >
          <template #default="scope">
            <span
              style="cursor: pointer; color: #409eff"
              @click="rowChange(scope.row, scope.$index, false)"
            >
              {{ scope.row.isSet ? '保存' : '修改' }}
            </span>
            <span
              v-if="!scope.row.isSet"
              style="cursor: pointer"
              @click="del(scope.row, scope.$index, true)"
            >
              删除
            </span>
            <span
              v-else
              style="cursor: pointer"
              @click="del(scope.row, scope.$index, true)"
            >
              取消
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="text"
        @click="addRow"
      >
        + 新增行
      </el-button>
    </el-form-item>
    <el-form-item label="使用场景">
      <el-input />
      <el-button type="text">
        + 新增
      </el-button>
    </el-form-item>
    <el-form-item
      v-for="(item, i) of usageScenario"
      :key="i"
      label=""
    >
      <el-input v-model="usageScenario[i]" />
    </el-form-item>
    <el-form-item>
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="上传附件">
      <el-upload action="#">
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式,文档不超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div class="attachment-list">
        xx
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      tableData: {
        sel: null,
        row: {
          country: '',
          state: '',
          region: '',
          isSet: true
        },
        tHead: [
          {
            id: 'country',
            name: '国家',
            options: [
              { label: '美国', value: '1' },
              { label: '英国', value: '2' },
              { label: '中国', value: '3' }
            ]
          },
          {
            id: 'state',
            name: '州/大区',
            options: [
              { label: '浙江', value: '1' },
              { label: '福建', value: '2' },
              { label: '海南', value: '3' }
            ]
          },
          {
            id: 'region',
            name: '城市',
            options: [
              { label: '宁波', value: '1' },
              { label: '绍兴', value: '2' },
              { label: '象山', value: '3' }
            ]
          }
        ],
        tBody: []
      },
      usageScenario: []
    };
  },
  methods: {
    addRow() {
      for (let i of this.tableData.tBody) {
        if (i.isSet) {
          return this.$message.warning('请先保存当前编辑项');
        }
      }
      let j = JSON.parse(JSON.stringify(this.tableData.row));
      this.tableData.tBody.push(j);
      this.tableData.sel = JSON.parse(JSON.stringify(j));
    },
    rowChange(row, index, cancelFlag) {
      for (let i = 0; i < this.tableData.tBody.length; i++) {
        let item = this.tableData.tBody[i];
        if (item.isSet && index !== i) {
          return this.$message.warning('请先保存当前编辑项');
        }
      }
      // 取消标识
      if (cancelFlag) {
        this.tableData.tBody[index].isSet = !row.isSet;
        return;
      }
      if (!row.isSet) {
        this.tableData.sel = JSON.parse(JSON.stringify(row));
        this.tableData.tBody[index].isSet = true;
      } else {
        //保存
        this.tableData.tBody.splice(index, 1, this.tableData.sel);
        this.tableData.tBody[index].isSet = false;
      }
    },
    del(row, index) {
      this.tableData.tBody.splice(index, 1);
    },
    selectChange(value, colum) {
      let option_length = colum.options.length;
      for (let i = 0; i < option_length; i++) {
        if (value === colum.options[i].value) {
          this.tableData.sel[colum.id] = colum.options[i].label;
          this.tableData.sel[`select_${colum.id}`] = value;
          break;
        }
      }
    }
  }
};
</script>
