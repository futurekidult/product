<template>
  <div class="order-title">
    SKU命名进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="完成时间" />
    <el-table-column label="状态" />
  </el-table>

  <el-form
    ref="skuForm"
    label-width="110px"
    style="width: 50%; margin: 20px 0"
    :model="skuForm"
    :rules="skuRules"
  >
    <div class="form-item">
      <el-form-item
        label="平台"
        prop="sku[0].platform"
      >
        <el-select
          v-model="skuForm.sku[0].platform"
          placeholder="请选择平台"
        />
      </el-form-item>
      <el-form-item
        label="SKU命名"
        prop="sku[0].name"
      >
        <el-select
          v-model="skuForm.sku[0].name"
          placeholder="请输入SKU命名"
        />
      </el-form-item>
    </div>
    <div
      v-for="(column, i) in skuList"
      :key="i"
      class="form-item"
    >
      <el-form-item>
        <el-select
          v-model="skuList[i].platform"
          placeholder="请选择平台"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="skuList[i].name"
          placeholder="请输入SKU命名"
        />
      </el-form-item>
    </div>
    <el-form-item>
      <el-button @click="addSku">
        + 新增SKU
      </el-button>
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
        支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div
        v-for="file in fileList"
        :key="file.id"
        class="attachment-list"
      >
        <div @click="previewFile(file.id)">
          {{ file.name }}
        </div>
        <el-button
          type="text"
          @click="deleteFile(file.id)"
        >
          删除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitSkuForm"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>

  <div class="order-title">
    SKU录入进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <el-button type="primary">
        已完成SKU录入甲骨文
      </el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      skuForm: {
        sku: [{}]
      },
      skuList: [],
      skuRules: {
        'sku[0].platform': [
          {
            required: true,
            message: '请选择平台'
          }
        ],
        'sku[0].name': [
          {
            required: true,
            message: '请输入SKU命名'
          }
        ],
        attachment: [
          {
            required: true,
            message: '请上传附件'
          }
        ]
      }
    };
  },
  created() {
    for (let i = 1; i < this.skuForm.sku.length; i++) {
      this.skuList.push(this.skuForm.sku[i]);
    }
  },
  methods: {
    handleFileSuccess(file, fileList) {
      this.fileList.push({
        id: file.id,
        name: fileList.name
      });
      this.skuForm.attachment = file.id;
    },
    previewFile(id) {
      console.log(id);
    },
    deleteFile(id) {
      console.log(id);
    },
    submitSkuForm() {
      this.$refs.skuForm.validate((valid) => {
        if (!valid) {
          console.log('error');
        } else {
          this.skuList.forEach((item) => {
            this.skuForm.sku.push(item);
          });
          console.log(this.skuForm);
        }
      });
    },
    addSku() {
      let { platform } = this;
      let { sku } = this;
      this.skuList.push({
        platform,
        sku
      });
    }
  }
};
</script>
