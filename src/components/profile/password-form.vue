<template>
  <div class="password-form">
    <div class="error-box" v-if="!!error">{{error}}</div>
    <div class="form-controls">
      <b-form-input v-model="mobile" type="tel" placeholder="手机号"></b-form-input>
      <div class="code-control-wrap">
        <div class="code-control">
          <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
        </div>
        <div class="get-code-btn">
          <get-code :mobile="mobile" :type="codeType"/>
        </div>
      </div>
      <b-form-input v-model="password" type="password" placeholder="输入新密码"></b-form-input>
      <b-form-input v-model="password_confirm" type="password" placeholder="确认新密码"></b-form-input>
      <span class="reg-btn" @click="save">保&emsp;存</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "password-form",
  props: {
    // mobile: Number
    // codeType: Number
  },
  components: {
    getCode: function(resolve) {
      require(["@/components/get-code"], resolve);
    }
  },
  data() {
    return {
      // company: null,
      //   mobile: null,
      error: null,
      code: null,
      mobile: "",
      codeType: "5",
      password: null,
      password_confirm: null
    };
  },
  methods: {
    save() {
      this.error = null;
      if (!this.mobile) {
        this.error = "手机号不能为空";
        return;
      }

      if (!this.code) {
        this.error = "验证码不能为空";
        return;
      }

      if (!this.password || this.password.length < 6) {
        this.error = "密码至少为6位";
        return;
      }

      if (this.password !== this.password_confirm) {
        this.error = "两次密码输入不一致";
        return;
      }

      this.$post(
        {
          action: "forgetpwd",
          p1: this.mobile,
          p2: this.code,
          p3: this.GetPassword(this.password),
          p4: this.codeType
        },
        res => {
          if (res.code === "0") {
            this.$router.push({ path: "/" });
          } else {
            this.error = res.codemsg;
          }
        }
      );
    }
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
    cursor: pointer;
    user-select: none;
  }

  .code-control-wrap {
    display: flex;
    .code-control {
      flex: 1;
    }

    .get-code-btn {
      flex: 0 0 98px;
      width: 98px;
      margin-left: 10px;
    }
  }
}
</style>

