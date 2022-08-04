<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <div class="nav-img">
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
  height: 100vh;
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

.header-right_divider,
.exit-btn {
  height: 20px;
  margin: 12px 5px;
  color: #fff;
}
</style>
