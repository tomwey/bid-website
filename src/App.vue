<template>
  <div id="body-wrap">
    <b-navbar toggleable="md" type="light" variant="info">
      <div class="container">
        <b-navbar-brand href="#">
          <img src="./assets/images/logo.png" class="logo">
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/">首页</b-nav-item>
          <b-nav-item href="/about">合能集团</b-nav-item>
          <b-nav-item href="/">招标计划</b-nav-item>
          <b-nav-item href="/">招标公告</b-nav-item>
          <b-nav-item href="/partner">合作伙伴</b-nav-item>
          <b-nav-item href="/contact">联系我们</b-nav-item>
        </b-navbar-nav>
      </div>
    </b-navbar>

    <router-view></router-view>

    <footer class="footer">
      <div class="container">
        <span class="text-muted">版权所有 © 2018 合能集团 保留所有权利.蜀ICP备14031323号</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>
<style lang="scss">
.bg-info {
  background: #fff !important;
  border-bottom: 1px solid #f1f1f1 !important;
}
</style>

<style lang="scss" scoped>
.logo {
  max-height: 32px;
}
</style>

