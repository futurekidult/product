<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <el-tooltip
          :disabled="disabled"
          effect="light"
          content="点击收缩"
          placement="right-start"
        >
          <el-icon
            :size="30"
            class="toggle-btn"
            @click="openCollapse"
          >
            <Fold />
          </el-icon>
        </el-tooltip>
        <div class="nav-img">
          <div>
            /* IFTRUE_heyme */
            <img src="../../assets/images/logo.png">
            /* FITRUE_heyme */
          </div>
          <div>
            /* IFTRUE_basepoint */
            <img src="../../assets/images/basepoint_logo.png">
            /* FITRUE_basepoint */
          </div>
          <div>
            /* IFTRUE_heytool */
            <img src="../../assets/images/heytool_logo.png">
            /* FITRUE_heytool */
          </div>
        </div>
        <el-divider
          direction="vertical"
          class="header-divider"
        />
        <div class="system">
          新品开发系统 {{ $version }}
        </div>
      </div>
      <div class="header-right">
        <base-handbook />
        <div>欢迎您，{{ $store.state.userInfo.name }}</div>
        <el-divider
          direction="vertical"
          class="header-right_divider"
        />
        <text-btn
          class="exit-btn"
          @handle-click="logout"
        >
          退出
        </text-btn>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          :default-active="$route.path"
          :collapse="isCollapse"
          :default-openeds="$store.state.menuData.openeds"
          router
          class="el-menu-vertical"
        >
          <div
            v-for="item in $store.state.menuData.list"
            :key="item.id"
          >
            <el-menu-item
              v-if="item.children.length === 0"
              :index="item.link"
            >
              <el-icon>
                <component
                  :is="item.icon"
                  class="menu-icon"
                />
              </el-icon>
              <template #title>
                <span>{{ item.name }}</span>
              </template>
            </el-menu-item>
            <el-sub-menu
              v-else
              :index="item.link"
              style="color: #000"
            >
              <template #title>
                <component
                  :is="item.icon"
                  class="menu-icon"
                />
                <span>{{ item.name }}</span>
              </template>
              <div
                v-for="sub in item.children"
                :key="sub.id"
              >
                <el-menu-item
                  v-if="sub.children.length === 0"
                  :index="sub.link"
                >
                  <el-icon>
                    <component
                      :is="sub.icon"
                      class="menu-icon"
                    />
                  </el-icon>
                  <template #title>
                    <span>{{ sub.name }}</span>
                  </template>
                </el-menu-item>
                <el-sub-menu
                  v-else
                  :index="sub.link"
                  style="color: #000"
                >
                  <template #title>
                    <el-icon>
                      <component
                        :is="sub.icon"
                        class="menu-icon"
                      />
                    </el-icon>
                    <span> {{ sub.name }}</span>
                  </template>
                  <el-menu-item
                    v-for="subItem in sub.children"
                    :key="subItem.id"
                    :index="subItem.link"
                  >
                    <el-icon>
                      <component
                        :is="subItem.icon"
                        class="menu-icon"
                      />
                    </el-icon>
                    <template #title>
                      <span>{{ subItem.name }}</span>
                    </template>
                  </el-menu-item>
                </el-sub-menu>
              </div>
            </el-sub-menu>
          </div>
        </el-menu>
      </el-aside>
      <el-main style="padding: 5px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  Fold,
  Notebook,
  Document,
  Box,
  Money,
  Medal,
  CopyDocument,
  OfficeBuilding,
  Setting,
  House,
  User,
  Key,
  SetUp,
  DocumentChecked,
  CoffeeCup,
  Coin,
  Postcard,
  Tickets,
  Collection
} from '@element-plus/icons-vue';
export default {
  components: {
    Fold,
    Notebook,
    Document,
    Box,
    Money,
    Medal,
    CopyDocument,
    OfficeBuilding,
    Setting,
    House,
    Key,
    User,
    SetUp,
    DocumentChecked,
    CoffeeCup,
    Coin,
    Postcard,
    Tickets,
    Collection
  },
  data() {
    return {
      isCollapse: false,
      disabled: false
    };
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logoutSystem');
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch (err) {
        return;
      }
    },
    openCollapse() {
      this.isCollapse = !this.isCollapse;
      this.disabled = !this.disabled;
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
  align-items: center;
}

.header-left > div {
  height: 33px;
  margin-left: 8px;
  margin-right: 8px;
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
  font-size: 14px;
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

.exit-btn:hover {
  /* IFTRUE_heyme */
  color: #f8ba2b;
  /* FITRUE_heyme */
  /* IFTRUE_basepoint */
  color: #ff7564;
  /* FITRUE_basepoint */
  /* IFTRUE_heytool */
  color: #288cff;
  /* FITRUE_heytool */
}

.toggle-btn {
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
  color: #fff;
  margin-right: 8px;
}

.toggle-btn:hover,
.toggle-btn:focus {
  /* IFTRUE_heyme */
  color: #f8ba2b;
  /* FITRUE_heyme */
  /* IFTRUE_basepoint */
  color: #ff7564;
  /* FITRUE_basepoint */
  /* IFTRUE_heytool */
  color: #288cff;
  /* FITRUE_heytool */
}

.el-menu-item.is-active {
  font-weight: 700;
  /* IFTRUE_heyme */
  color: #f8ba2b;
  /* FITRUE_heyme */
  /* IFTRUE_basepoint */
  color: #ff7564;
  /* FITRUE_basepoint */
  /* IFTRUE_heytool */
  color: #288cff;
  /* FITRUE_heytool */
}

.el-sub-menu__title.is-active {
  font-weight: 700;
  /* IFTRUE_heyme */
  color: #f8ba2b;
  /* FITRUE_heyme */
  /* IFTRUE_basepoint */
  color: #ff7564;
  /* FITRUE_basepoint */
  /* IFTRUE_heytool */
  color: #288cff;
  /* FITRUE_heytool */
}

.menu-icon {
  height: 18px;
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
</style>
