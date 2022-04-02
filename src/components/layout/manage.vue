<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <div>
          <img src="../../assets/images/logo.png">
        </div>
        <el-divider
          direction="vertical"
          class="header-divider"
        />
        <div class="system">
          新品开发系统1.0.0
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <el-menu
          background-color="#545c64"
          text-color="#ffffff"
          :default-active="defaultActive"
          unique-opened
          router
        >
          <el-menu-item index="/work-bench">
            <template #title>
              <span>工作台</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/demand-list">
            <template #title>
              <span>需求管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/product-list">
            <template #title>
              <span>新品管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/price-list">
            <template #title>
              <span>定价管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/mould-list">
            <template #title>
              <span>模具管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/sample-list">
            <template #title>
              <span>样品管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/supplier-list">
            <template #title>
              <span>供应商管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="8">
            <template #title>
              <span>系统管理</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  computed: {
    defaultActive() {
      const { path } = this.$route;
      return path;
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #3a3f4d;
  padding: 20px;
  height: 80px;
}

.header-left {
  display: flex;
}

.header-left > div {
  height: 43px;
}

.system {
  color: #ffffff;
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 700;
}

.el-menu {
  height: 100%;
}

.el-submenu__title:hover,
.el-menu-item:hover {
  background-color: #3a3f4d;
}
</style>
