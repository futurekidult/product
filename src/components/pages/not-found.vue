<template>
  <div>
    <el-container>
      <el-header>
        <div class="header-left">
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
            style="height: auto !important"
            class="exit-btn"
            @handle-click="logout"
          >
            退出
          </text-btn>
        </div>
      </el-header>
    </el-container>
    <div class="not-found">
      <img src="../../assets/images/404.png">
      <div>您访问的页面不存在或页面出错 ~</div>
      <el-button
        type="primary"
        @click="toIndex"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toIndex() {
      this.$router.push('/');
    },
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

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
}

.not-found div {
  font-size: 20px;
  margin: 20px 0 40px 0;
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
</style>
