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
</style>
