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
      <div class="header-right">
        <div style="padding: 4px 0">
          <el-avatar
            :size="25"
            style="padding: 5px"
          >
            <user-filled />
          </el-avatar>
        </div>
        <div>欢迎您，{{ $store.state.userInfo.name }}</div>
        <el-divider
          direction="vertical"
          class="header-right_divider"
        />
        <el-button
          type="text"
          class="exit-btn"
          @click="logout"
        >
          退出
        </el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="240px">
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
          <el-sub-menu index="/system-list">
            <template #title>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system-list/organization-list">
              组织管理
            </el-menu-item>
            <el-menu-item index="/system-list/admin-list">
              用户管理
            </el-menu-item>
            <el-menu-item index="/system-list/role-list">
              角色管理
            </el-menu-item>
            <el-menu-item index="/system-list/privilege-list">
              权限管理
            </el-menu-item>
            <el-sub-menu index="/system-list/basic-data">
              <template #title>
                <span>基础数据</span>
              </template>
              <el-menu-item
                index="/system-list/basic-data/profit-calculation/rule"
              >
                核算利润规则
              </el-menu-item>
              <el-menu-item index="/system-list/basic-data/rate-list">
                汇率表
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/system-list/todo-list">
              待办管理
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main style="padding: 10px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { UserFilled } from '@element-plus/icons-vue';
export default {
  components: {
    UserFilled
  },
  computed: {
    defaultActive() {
      const { path } = this.$route;
      return path;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logoutSystem');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #3a3f4d;
  padding: 8px;
  height: 60px;
  display: flex;
  justify-content: space-between;
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

.header-right {
  color: #fff;
  display: flex;
  height: 43px;
  line-height: 43px;
}

.header-right > div {
  margin-left: 10px;
}

.header-right_divider,
.exit-btn {
  height: 20px;
  margin: 12px 5px;
  color: #fff;
}
</style>
