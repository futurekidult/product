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
    <div
      v-for="(item, index) in skuForm.sku"
      :key="index"
      style="display: flex"
    >
      <el-form-item
        :label="'平台' + (index + 1)"
        :prop="`sku.${index}.platform`"
        :rules="skuRules.platform"
      >
        <el-select
          v-model="skuForm.platform"
          placeholder="请选择平台"
        />
      </el-form-item>
      <el-form-item
        :label="'SKU命名' + (index + 1)"
        :prop="`sku.${index}.name`"
        :rules="skuRules.name"
      >
        <el-input
          v-model="skuForm.name"
          placeholder="请输入SKU名"
        />
      </el-form-item>
    </div>
    <el-form-item>
      <el-button @click="addSku">
        + 新增SKU
      </el-button>
      <el-button
        type="danger"
        @click="deleteSku"
      >
        + 删除SKU
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

  <el-descriptions
    border
    :column="4"
    direction="vertical"
  >
    <el-descriptions-item label="任务负责人" />
    <el-descriptions-item label="实际完成时间" />
    <el-descriptions-item label="状态" />
    <el-descriptions-item label="操作">
      <el-button> 已完成SKU录入甲骨文 </el-button>
    </el-descriptions-item>
  </el-descriptions>
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
        platform: [
          {
            required: true,
            message: '请选择平台'
          }
        ],
        name: [
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
      this.skuForm.sku.push({});
    },
    deleteSku() {
      this.skuForm.sku.pop();
    }
  }
};
</script>
