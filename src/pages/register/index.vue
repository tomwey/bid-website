<template>
  <div class="register">
    <div class="register-wrap">
      <div class="form-box">
        <h2 class="title">供方注册</h2>
        <div class="form-controls">
          <b-form-input v-model="company" type="text" placeholder="公司名称"></b-form-input>
          <b-form-input v-model="company" type="text" placeholder="登录名"></b-form-input>
          <b-form-input v-model="mobile" type="tel" placeholder="手机号"></b-form-input>
          <b-row>
            <b-col cols="8">
              <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
            </b-col>
            <b-col cols="4">
              <span class="get-code">获取验证码</span>
            </b-col>
          </b-row>
          <b-form-input v-model="password" type="password" placeholder="输入密码"></b-form-input>
          <b-form-input v-model="password_confirm" type="password" placeholder="输入确认密码"></b-form-input>
          <span class="reg-btn">注&emsp;册</span>
          <!-- http://erp20-mobiledoc.heneng.cn:16660/view/YxmhgSw -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    return {
      company: null,
      mobile: null,
      code: null,
      password: null,
      password_confirm: null,
      status: "0"
    };
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.register-wrap {
  margin-top: 58px;
  margin-bottom: 200px;
  width: 100%;
  background-image: url("../../assets/images/img-reg-bg.jpg");
  background-repeat: no-repeat;
  background-position: top left;
  background-size: 100% auto;
  padding-top: 180px;
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
    .form-controls {
      padding: 20px;

      .form-control {
        margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
      }

      .reg-btn {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: $theme-color;
        margin: 40px 0 20px;
      }

      .get-code {
        background: $theme-color;
        height: 36px;
        line-height: 36px;
        display: block;
        font-size: 14px;
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>


