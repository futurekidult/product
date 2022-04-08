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
.project-title,
.order-title {
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
  display: flex;
  justify-content: space-between;
}

.attachment-list div {
  color: #606266;
  cursor: pointer;
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
  grid-template-columns: 40% 20% 40%;
  width: 100%;
}

.form-combination {
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.3%;
  width: 100%;
}

.el-button--primary {
  width: 88px;
}

.profit-plan_title {
  font-size: 14px;
  margin: 15px 30px;
}

.apply-item {
  display: flex;
  justify-content: space-between;
}

.user-btn,
.project-plan_btn {
  width: 120px;
}

.collapse-item {
  width: 94%;
  padding: 0px 0 0 45px;
  margin: 18px 0;
}

.table-btn {
  display: inline-block;
  margin: 0 5px;
}
</style>
