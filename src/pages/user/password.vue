<template>
  <div class="password">
    <div class="box">
      <h2>修改密码</h2>
      <div class="form-wrap">
        <password-form :mobile="mobile"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "password",
  components: {
    passwordForm: function(resolve) {
      require(["@/components/profile/password-form"], resolve);
    }
  },
  data() {
    return {
      // company: null,
      mobile: "133****4567"
    };
  }
};
</script>
<style lang="scss" scoped>
.password {
  .form-wrap {
    // padding: 30px 60px;
    width: 360px;
    margin: 0 auto;
    padding: 60px 0;
  }
}
</style>

