<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

.el-main {
  position: relative;
  background: rgba(240, 246, 247, 1);
}

.border {
  border: 1px solid rgba(230, 230, 230, 1);
  background: #fff;
  padding: 20px;
  margin-bottom: 15px;
}

.el-pagination {
  margin: 20px 0;
  float: right;
}

.progress-table {
  margin: 40px 0;
}

.progress-title {
  font-weight: bold;
  margin-bottom: 20px;
}

.select-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 20px;
}

.line {
  color: rgba(0, 102, 183, 1);
}

.create {
  float: right;
  color: #fff;
}

.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}

.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 40px;
}

.survey-title,
.project-title {
  font-size: 14px;
  margin: 15px 0;
}

.attachment {
  margin-left: 20px;
  font-size: 12px;
  color: #606266;
}

.attachment-list {
  background: #f6f6f6;
  width: 100%;
}

el-form-item--default .el-form-item__label {
  display: flex;
  align-items: center;
}

.form-item {
  display: grid;
  grid-template-columns: 49% 49%;
  gap: 15px;
}

.el-select {
  width: 100%;
}

.form-template {
  display: grid;
  grid-template-columns: 41% 18% 41%;
  width: 100%;
}

.el-button--primary {
  width: 88px;
}
</style>
