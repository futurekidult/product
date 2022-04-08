/* eslint-disable vue/require-v-for-key */
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
    ref="analysisForm"
    label-width="110px"
    style="width: 50%"
    :model="analysisForm"
    :rules="analysisRules"
  >
    <div class="form-item">
      <el-form-item
        label="性别"
        prop="gender"
      >
        <el-select
          v-model="analysisForm.gender"
          placeholder="请选择性别"
        />
      </el-form-item>
      <el-form-item
        label="年龄"
        prop="age"
      >
        <el-select
          v-model="analysisForm.age"
          placeholder="请选择年龄"
        />
      </el-form-item>
      <el-form-item
        label="职业"
        prop="profession"
      >
        <el-input
          v-model="analysisForm.profession"
          placeholder="请输入职业"
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="学历"
        prop="diploma"
      >
        <el-select
          v-model="analysisForm.diploma"
          placeholder="请选择学历"
        />
      </el-form-item>
      <el-form-item
        label="家庭年收入"
        prop="annualHouseholdIncome"
      >
        <el-select
          v-model="analysisForm.annualHouseholdIncome"
          placeholder="请选择家庭年收入"
        />
      </el-form-item>
      <el-form-item
        label="婚姻状况"
        prop="maritalStatus"
      >
        <el-select
          v-model="analysisForm.maritalStatus"
          placeholder="请选择婚姻状况"
        />
      </el-form-item>
    </div>
    <el-form-item
      label="国家"
      style="width: 49%"
      prop="country"
    >
      <el-select
        v-model="analysisForm.country"
        placeholder="请选择国家"
      />
    </el-form-item>
    <div class="form-item">
      <el-form-item
        label="州/大区"
        prop="state"
      >
        <el-select
          v-model="analysisForm.state"
          placeholder="请选择州/大区"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="城市"
        prop="city"
      >
        <el-select
          v-model="analysisForm.city"
          placeholder="请选择城市"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    </div>
    <div
      v-for="(column, i) in stateCity"
      :key="i"
      class="form-item"
    >
      <el-form-item>
        <el-select
          v-model="stateCity[i].state"
          placeholder="请选择州/大区"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="stateCity[i].city"
          placeholder="请选择城市"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    </div>
    <el-form-item>
      <el-button
        class="user-btn"
        @click="addStateCity"
      >
        + 新增
      </el-button>
    </el-form-item>
    <el-form-item
      label="使用场景"
      prop="usageScenario"
    >
      <el-input
        v-model="analysisForm.usageScenario"
        placeholder="请输入使用场景"
        maxlength="15"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      v-for="i in count"
      :key="i"
    >
      <el-input
        v-model="usageScenario[i]"
        placeholder="请输入使用场景"
        maxlength="15"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="user-btn"
        @click="addUsageScenario"
      >
        + 新增
      </el-button>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model="analysisForm.remark"
        type="textarea"
        placeholder="请输入备注"
      />
    </el-form-item>
    <el-form-item
      label="上传附件"
      prop="attachment"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleFileSuccess"
        :limit="1"
      >
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式,文档不超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div
        v-for="file in fileList"
        :key="file.id"
        class="attachment-list"
      >
        <div @click="previewImg(file.id)">
          {{ file.name }}
        </div>
        <el-button
          type="text"
          @click="deleteImg(file.id)"
        >
          删除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitAnalysisForm"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      usageScenario: [],
      stateCity: [],
      fileList: [],
      analysisForm: {},
      analysisRules: {
        gender: [
          {
            required: true,
            message: '请选择性别'
          }
        ],
        age: [
          {
            required: true,
            message: '请选择年龄'
          }
        ],
        profession: [
          {
            required: true,
            message: '请输入职业'
          }
        ],
        diploma: [
          {
            required: true,
            message: '请选择学历'
          }
        ],
        annualHouseholdIncome: [
          {
            required: true,
            message: '请选择家庭年收入'
          }
        ],
        maritalStatus: [
          {
            required: true,
            message: '请选择婚姻状况'
          }
        ],
        country: [
          {
            required: true,
            message: '请选择国家'
          }
        ],
        state: [
          {
            required: true,
            message: '请选择国家'
          }
        ],
        city: [
          {
            required: true,
            message: '请选择国家'
          }
        ],
        usageScenario: [
          {
            required: true,
            message: '请输入使用场景'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      },
      count: 0,
      stateOptions: [
        {
          value: '10',
          label: '黄金糕'
        },
        {
          value: '20',
          label: '双皮奶'
        }
      ]
    };
  },
  methods: {
    submitAnalysisForm() {
      this.$refs.analysisForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        }
      });
    },
    addUsageScenario() {
      this.count++;
      console.log(this.usageScenario);
    },
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.analysisForm.attachment = file.id;
    },
    deleteImg(id) {
      console.log(id);
    },
    previewImg(id) {
      console.log(id);
    },
    addStateCity() {
      let { state } = this;
      let { city } = this;
      this.stateCity.push({
        state,
        city
      });
    }
  }
};
</script>
