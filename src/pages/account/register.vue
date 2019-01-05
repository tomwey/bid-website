<template>
  <div class="register">
    <div class="form-box">
      <h2 class="title">供方注册</h2>
      <div class="form-controls">
        <!-- <b-form-input v-model="company" type="text" placeholder="公司名称"></b-form-input> -->
        <b-form-input v-model="loginname" type="text" placeholder="登录名"></b-form-input>
        <b-form-input v-model="mobile" type="tel" placeholder="手机号"></b-form-input>
        <div class="code-control-wrap">
          <div class="code-control">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </div>
          <div class="get-code-btn">
            <get-code :mobile="mobile" :type="codetype"/>
          </div>
        </div>
        <b-form-input v-model="password" type="password" placeholder="输入密码"></b-form-input>
        <b-form-input v-model="password_confirm" type="password" placeholder="输入确认密码"></b-form-input>
        <span class="reg-btn" @click="commit">注&emsp;册</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "register",
  components: {
    getCode: function(resolve) {
      require(["@/components/get-code"], resolve);
    }
  },
  data() {
    return {
      loginname: null,
      // company: null,
      mobile: null,
      code: null,
      codetype: "2",
      password: null,
      password_confirm: null
    };
  },
  methods: {
    commit() {
      if (!this.loginname) {
        alert("登录名不能为空");
        return;
      }
      if (!this.mobile) {
        alert("手机号不能为空");
        return;
      }

      if (!this.isPhone(this.mobile)) {
        alert("不正确的手机号");
        return;
      }

      if (!this.password || this.password.length < 6) {
        alert("密码太短，至少为6位");
        return;
      }

      if (this.password !== this.password_confirm) {
        alert("两次密码输入不一致");
        return;
      }

      this.$post(
        {
          action: "P_SUP_Register",
          p1: this.loginname,
          p2: this.mobile,
          p3: this.GetPassword(this.password),
          p4: this.code,
          p5: this.codetype
        },
        res => {
          if (res.code == 0) {
            if (res.count == 1) {
              let arr = res.data;
              let item = arr[0];

              this.$store.commit("login", {
                token: item.token,
                days: 1
              });

              this.$router.push({
                name: "user_home"
              });
            } else {
              alert("不正确的注册结果");
            }
          } else {
            alert(res.codemsg);
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.register {
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
    .form-controls {
      padding: 20px;

      .form-control {
        margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
        font-size: 14px;
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
    }
  }
}
</style>


