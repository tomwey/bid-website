<template>
  <div class="password">
    <div class="form-box">
      <h2 class="title">找回密码</h2>
      <password-form :mobile="mobile"/>
      <!-- <div class="form-controls">
        <b-form-input v-model="mobile" type="tel" placeholder="手机号"></b-form-input>
        <b-row>
          <b-col cols="8">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </b-col>
          <b-col cols="4">
            <span class="get-code">获取验证码</span>
          </b-col>
        </b-row>
        <b-form-input v-model="password" type="password" placeholder="输入新密码"></b-form-input>
        <b-form-input v-model="password_confirm" type="password" placeholder="确认新密码"></b-form-input>
        <span class="reg-btn">保&emsp;存</span>
      </div>-->
    </div>
  </div>
</template>
<script>
export default {
  name: "forget-password",
  components: {
    passwordForm: function(resolve) {
      require(["@/components/profile/password-form"], resolve);
    }
  },
  data() {
    return {
      // company: null,
      mobile: null,
      code: null,
      password: null,
      password_confirm: null
    };
  }
};
</script>
<style lang="scss" scoped>
.password {
  .form-box {
    background: #fff;
    width: 360px;
    margin: 0 auto;
    box-shadow: 0 0 1px #e6e6e6;
    .title {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 20px;
      color: #333;
    }
    // .form-controls {
    //   padding: 20px;

    //   .form-control {
    //     margin-bottom: 15px;
    //     border-radius: 0;
    //     border-color: #f2f2f2;
    //   }

    //   .reg-btn {
    //     display: block;
    //     height: 40px;
    //     line-height: 40px;
    //     text-align: center;
    //     color: #fff;
    //     background: $theme-color;
    //     margin: 40px 0 20px;
    //   }

    //   .get-code {
    //     background: $theme-color;
    //     height: 36px;
    //     line-height: 36px;
    //     display: block;
    //     font-size: 14px;
    //     text-align: center;
    //     color: #fff;
    //   }
    // }
  }
}
</style>

