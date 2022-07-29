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
          <div 
            v-for="item in list"
            :key="item.id"
          >
            <el-menu-item 
              v-if="!item.children"
              :index="item.link"
            >
              <template #title>
                <span>{{ item.name }}</span>
              </template>
            </el-menu-item>
            <el-sub-menu 
              v-else
              :index="item.link"
            >
              <template #title>
                <span>{{ item.name }}</span>
              </template> 
              <div
                v-for="sub in item.children"
                :key="sub.id"
              >
                <el-menu-item 
                  v-if="!sub.children"
                  :index="sub.link"
                >
                  {{ sub.name }}
                </el-menu-item>
                <el-sub-menu 
                  v-else
                  :index="sub.link"
                >
                  <template #title>
                    <span> {{ sub.name }}</span>
                  </template>
                  <div
                    v-for="subItem in sub.children"
                    :key="subItem.id"
                  >
                    <el-menu-item 
                      :index="subItem.link"
                    >
                      {{ subItem.name }}
                    </el-menu-item>
                  </div>
                </el-sub-menu>
              </div>
            </el-sub-menu>
          </div>
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
  data() {
    return {
      menuList: []
    }
  },
  computed: {
    defaultActive() {
      const { path } = this.$route;
      return path;
    }
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async logout() {
      try{
        await this.$store.dispatch('logoutSystem');
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch(err) {
        return;
      }
    },
    async getMenuList() {
      try {
        await this.$store.dispatch('getMenuList');
        this.menuList = this.$store.state.menuList;
      } catch (err) {
        return;
      }
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
