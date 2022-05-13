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
  height: 100vh;
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
.order-title,
.proofing-title,
.test-title {
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
  padding: 0 10px;
}

.attachment-list div {
  color: #606266;
  cursor: pointer;
}
.attachment-list div:hover {
  color: #409eff;
}

.el-form-item--default .el-form-item__label {
  display: flex;
  align-items: center;
}

.form-item {
  display: grid;
  grid-template-columns: 49% 49%;
  gap: 5px;
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
  width: 100px;
}

.profit-plan_title {
  font-size: 14px;
  margin: 15px 0;
}

.apply-item,
.proofing-item,
.test-item,
.member-item {
  display: flex;
  justify-content: space-between;
}

.user-btn,
.project-plan_btn,
.pre-product_btn,
.member-btn {
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

.plan-btn,
.project-btn {
  margin: 15px 0;
}

.close-btn {
  width: 100px;
}

.adjust-time {
  display: flex;
  margin-bottom: 15px;
}

.adjust-time div {
  margin-left: 10px;
}

.adjust-result {
  margin: 0 30px;
}

.adjust-result section {
  margin: 10px 0;
}

.hide {
  display: none;
}

.result-pass {
  color: #379f0d;
}

.result-fail {
  color: #ea1d1d;
}

.result-ing {
  color: #f78113;
}

.result-content {
  text-align: center;
  margin-bottom: 30px;
}

.fail-btn {
  text-align: right;
}

.pass-btn {
  text-align: center;
}

.pass-btn button,
.fail-btn button {
  width: 100px;
}

.reset-btn {
  width: 100px;
}
</style>
