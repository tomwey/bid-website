<template>
  <div class="password-form">
    <div class="form-controls">
      <b-form-input v-model="mobile" :readonly="!!mobile" type="tel" placeholder="手机号"></b-form-input>
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
    </div>
  </div>
</template>
<script>
export default {
  name: "password-form",
  props: {
    mobile: Number
  },
  data() {
    return {
      // company: null,
      //   mobile: null,
      code: null,
      password: null,
      password_confirm: null
    };
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
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
</style>

