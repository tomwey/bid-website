<template>
  <div class="register">
    <div class="register-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "account"
};
</script>
<style lang="scss" scoped>
// $theme-color: #e46623;
.register-wrap {
  margin-top: 58px;
  margin-bottom: 200px;
  width: 100%;
  background-image: url("../../assets/images/img-reg-bg.jpg");
  background-repeat: no-repeat;
  background-position: top left;
  background-size: 100% auto;
  padding-top: 160px;
}
</style>


