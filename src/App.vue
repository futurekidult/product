<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default defineComponent({
  components: {
    ElConfigProvider
  },
  data() {
    return {
      locale: zhCn
    };
  },
  mounted() {
    this.clearCache();
    this.getUserInfo();
    this.getOrganizationList();
  },
  methods: {
    clearCache() {
      setTimeout(() => {
        this.getSystemParamters();
      }, 3600 * 1000 * 24);
    },
    async getSystemParamters() {
      try {
        await this.$store.dispatch('getSystemParameters');
      } catch (err) {
        return;
      }
    },
    async getToken() {
      try {
        await this.$store.dispatch('getToken');
      } catch (err) {
        return;
      }
    },
    async getUserInfo() {
      try {
        this.getToken();
        await this.$store.dispatch('getUserInfo');
      } catch (err) {
        return;
      }
    },
    async getOrganizationList() {
      try {
        await this.$store.dispatch('getOrganizationList');
      } catch (err) {
        return;
      }
    }
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.el-main {
  position: relative;
  background: #f0f6f7;
  height: calc(100vh - 60px);
}

.border {
  border: 1px solid rgba(230, 230, 230, 1);
  background: #fff;
  padding: 10px;
  margin-bottom: 5px;
}

.el-pagination {
  margin: 10px 0;
  float: right;
}

.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px !important;
}

.progress-table {
  margin: 0 0 20px 0;
}

.result-ignore {
  color: #999999;
}

.select-title,
.nav-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 15px;
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
.test-title,
.design-title,
.prototype-title,
.test-title,
.open-title,
.progress-title {
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
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
}

.attachment-list div {
  color: #606266;
}

.form-item {
  display: grid;
  grid-template-columns: 50% 50%;
}

.el-select {
  width: 100%;
}

.form-template {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  width: 100%;
}

.form-combination {
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.3%;
  width: 100%;
}

.el-button--primary,
.el-button--success,
.el-button--danger {
  width: 100px;
}

.is-link {
  width: auto !important;
}

.header-right_divider,
.exit-btn {
  height: 20px !important;
  margin: 12px 5px !important;
  color: #fff !important;
}

.header-right_divider,
.select-element_margin {
  margin-left: 15px !important;
}

.exit-btn:hover {
  /* IFTRUE_heyme */
  color: #f8ba2b !important;
  /* FITRUE_heyme */
  /* IFTRUE_basepoint */
  color: #ff7564;
  /* FITRUE_basepoint */
  /* IFTRUE_heytool */
  color: #288cff;
  /* FITRUE_heytool */
}

.el-button.is-link {
  height: 32px !important;
}

.profit-plan_title {
  font-size: 14px;
  margin: 15px 0;
}

.apply-item,
.suggestion-item,
.proofing-item,
.test-item,
.member-item,
.open-mould_item,
.quotation-item,
.supplier-item,
.user-item,
.system-item,
.todo-title,
.select-item,
.sample-item,
.demand-title {
  display: flex;
  justify-content: space-between;
}

.user-btn,
.project-plan_btn,
.pre-product_btn,
.member-btn,
.quote-btn,
.mould-btn,
.price-btn {
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

.close-btn,
.draft-btn {
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

.form-desc {
  font-size: 10px;
  text-align: center;
}

.overdue,
.is-read {
  color: #ea1d1d;
}

.desc {
  font-size: 10px;
  color: #999999;
}

.form-item_width {
  width: 99%;
}

.detail-title {
  font-weight: 700;
  margin: 0 0 20px 0;
  display: flex;
}

.tag-position {
  margin-left: 20px;
}

.el-select-dropdown__wrap {
  max-height: 900px !important;
}

.el-menu--collapse .el-sub-menu__title span {
  display: none !important;
}

.el-menu--collapse .el-sub-menu .el-sub-menu__icon-arrow {
  display: none !important;
}

.nav-img {
  display: flex;
  align-items: center;
}

.nav-img img {
  width: 100px;
}

.form-include_delete {
  display: grid;
  grid-template-columns: 33% 33% 33% 4%;
  width: 100%;
}

.usage-scenario_include-delete {
  display: grid;
  grid-template-columns: 100% 4%;
  width: 100%;
}

.condition-link {
  color: #409eff;
  text-decoration: none;
}

.form-hint {
  margin: 0 0 18px 50px;
  color: red;
}

.el-form-item__content {
  display: block !important;
}

.pass-form_title {
  font-size: 14px;
  margin: 15px;
}

.el-tabs__item {
  font-size: 15px !important;
  font-weight: 600 !important;
}

.el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
  border-left: none !important;
}

.el-tabs--card > .el-tabs__header .el-tabs__item {
  border-left: 1px solid #d9d9d9 !important;
}

.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid #d9d9d9 !important;
  border-bottom: none !important;
}

.el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid #d9d9d9 !important;
}
</style>
