<template>
  <div class="main-wrap" id="home-main-wrap">
    <div class="hero-area" id="hero-area">
      <b-carousel
        id="carousel1"
        style="text-shadow: 1px 1px 2px #333;"
        indicators
        background="#f7f7f7"
        :interval="3000"
        v-model="slide"
      >
        <b-carousel-slide :img-src="require('../../assets/images/banner1.jpg')"></b-carousel-slide>
        <b-carousel-slide :img-src="require('../../assets/images/banner2.jpg')"></b-carousel-slide>
      </b-carousel>
      <div class="login-box-wrap">
        <div class="login-box">
          <h2 class="title" v-if="!$store.state.token">供方登录</h2>
          <div class="error-box" v-if="!!error">{{error}}</div>
          <div class="form-wrap" v-if="!$store.state.token">
            <b-form-input v-model="loginname" type="text" placeholder="输入手机号/登录名"></b-form-input>
            <!-- <div class="login-state-wrap clearfix">
            <span class="forget-password float-right" @click="forgetLogin">忘记账号？</span>
            </div>-->
            <b-form-input v-model="password" type="password" placeholder="输入密码"></b-form-input>
            <div class="login-state-wrap clearfix">
              <span class="login-keep" @click="toggle">
                <v-icon :name="keepLogin ? 'check-square' : 'square'"/>7天内免登录
              </span>
              <span class="forget-password float-right" @click="forgetPass">忘记密码？</span>
            </div>
            <span class="login-btn" @click="login">登&emsp;录</span>
            <!-- <p class="reg-text">
            没有账号？
            <span class="reg-link" @click="register">立即注册</span>
            </p>-->
            <b-row>
              <b-col cols="6">
                <span class="find-login-link" @click="forgetLogin">找回账号？</span>
              </b-col>
              <b-col cols="6" style="text-align:right;">
                <span class="reg-link" @click="register">立即注册</span>
              </b-col>
            </b-row>
          </div>

          <div class="logined-wrap" v-if="!!$store.state.token">
            <div class="user-info">
              <v-icon name="user-circle" scale="4"/>
              <p class="name">{{$store.state.supinfo.loginname}}，您好</p>
              <p class="slogan">欢迎使用合能招投标系统</p>
            </div>
            <span class="hn-btn" @click="gotoDashboard">进入用户中心</span>
            <span class="hn-btn light" @click="logout">退出登录</span>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="images-container"> -->
    <div class="sec-box bid-flow">
      <h1>官方一站式招投标平台</h1>
      <h4>以公平、公正、公开的态度来对待每一位合作伙伴</h4>
      <div class="container">
        <img src="../../assets/images/img-bid-flow.png" class="img-fluid">
      </div>
    </div>
    <div class="sec-box company" id="about">
      <h1>合能集团</h1>
      <h4>ALL DREAMS COME TRUE — 所有梦想都开花</h4>
      <div class="container">
        <img src="../../assets/images/img-comp-intro.png" class="img-fluid">
      </div>
    </div>

    <div class="sec-box pattern" id="partner">
      <div class="container">
        <!-- <h1>优质合作伙伴</h1>
        <h4>合作共赢，有容乃大</h4>-->
        <img src="../../assets/images/img-pattern.png" class="img-fluid">
      </div>
    </div>
    <!-- </div> -->
    <!-- <div class="sec-box contact">
      <div class="container">
        <b-row>
          <b-col cols="4">
            <div class="info-box">
              <v-icon name="phone"/>
              <span class="name">集团总机：028-86248000</span>
              <p class="kefu">客服热线：4006-490-900</p>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="info-box">
              <v-icon name="map-marker"/>
              <span class="name">地址：四川省成都市青羊区西大街1号</span>
    </div>-->
    <!-- <div class="info-box">
              <v-icon name="envelope"/>
              <span class="name">人力资源：hr@heneng.cn</span>
    </div>-->
    <!-- </b-col>
          <b-col cols="2" class="qrcode-wrap">
            <img src="../../assets/images/icon_qrcode.jpg" class="img-fluid">
          </b-col>
        </b-row>
      </div>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      error: null,
      slide: 0,
      loginname: null,
      password: null,
      keepLogin: false,
      logined: false
    };
  },
  mounted() {
    this.logined = !!this.$getToken();
  },
  methods: {
    logout() {
      let a = confirm("您确定要退出登录吗？");
      if (a) {
        this.$store.commit("logout");
        // this.currentMenuItem = null;
        this.$router.replace({ name: "home" });
      }
    },
    login() {
      this.error = null;

      this.$post(
        {
          action: "P_SUP_Login",
          p1: this.loginname,
          p2: this.GetPassword(this.password),
          p3: "0"
        },
        res => {
          // console.log(res);
          if (res.code == 0) {
            if (res.count == 1) {
              let arr = res.data;
              let item = arr[0];

              this.$store.commit("login", {
                token: item.token,
                days: this.keepLogin ? 7 : 1,
                uid: item.accountid,
                loginname: item.loginname
              });

              this.$router.push({
                name: "user_home"
              });
            } else {
              // alert("不正确的登录结果");
              this.error = "非法错误！";
            }
          } else {
            this.error = res.codemsg;
            // alert(res.codemsg);
          }
        }
      );

      //
    },
    toggle() {
      this.keepLogin = !this.keepLogin;
    },
    register() {
      this.$router.push({ name: "register" });
    },
    forgetLogin() {
      this.$router.push({ name: "find_login" });
    },
    forgetPass() {
      this.$router.push({ name: "forget_pwd" });
    },
    gotoDashboard() {
      this.$router.push({ name: "user_home" });
    }
  }
};
</script>
<style lang="scss">
.hn-btn {
  display: block;
  height: 40px;
  line-height: 40px;
  background: #e46623;
  text-align: center;
  font-size: 14px;
  color: #fff;
  width: 100%;
  cursor: pointer;
  user-select: none;
  &.light {
    background: #999;
    margin-top: 10px;
  }
}
</style>
<style lang="scss" scoped>
$theme-color: #e46623;

.main-wrap {
  width: 100%;
}
.sec-box {
  width: 100%;
  text-align: center;
  background: #fff;
  img {
    width: 100% !important;
  }

  &.pattern {
    background: #fff;
  }
}

.logined-wrap {
  padding: 30px 20px;
  .user-info {
    text-align: center;
    .fa-icon {
      color: #999;
    }
    p {
      margin: 0;
      padding: 0;
      font-size: 14px;
    }
    .name {
      font-size: 16px;
      color: #333;
      margin-top: 10px;
    }
    .slogan {
      font-size: 16px;
      color: $theme-color;
      margin: 20px 0;
    }
  }
  h4 {
    font-size: 16px;
    color: #333;
    font-weight: 700;
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
  }

  p {
    font-size: 14px;
    color: #666;
    // text-align: center;
    margin-top: 20px;
  }
}

.hero-area {
  width: 100%;
  position: relative;
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
  // font-size: 16px;
  margin-top: 60px;
  color: #333;

  .login-box-wrap {
    width: 400px;
    height: 100%;
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    padding: 10px 120px 10px 0;
    // background: red;
  }
  .login-box {
    // width: 280px;
    max-height: 360px;
    width: 100%;

    .error-box {
      padding: 5px 10px;
    }
    // height: 100%;

    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 1px 5px #ccc;
    padding-bottom: 20px;
    .title {
      font-size: 20px;
      color: #333;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
      padding: 15px;
    }
    .form-wrap {
      padding: 15px 20px 0;
      .form-control {
        margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
        font-size: 16px;
      }

      .login-state-wrap {
        margin-bottom: 8px;
        margin-top: -10px;
        font-size: 14px;
        .login-keep {
          line-height: 20px;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          .fa-icon {
            vertical-align: -3px;
            // color: #fff;
            color: #333;
            margin-right: 3px;
            margin-left: 1px;
          }
        }
        .forget-password {
          color: $theme-color;
          cursor: pointer;
          vertical-align: middle;
          line-height: 20px;
          user-select: none;
        }
      }

      .login-btn {
        display: block;
        height: 40px;
        line-height: 40px;
        background: $theme-color;
        color: #fff;
        font-size: 16px;
        // font-weight: 500;
        text-align: center;
        margin: 20px 0 10px;
        cursor: pointer;
        user-select: none;
      }

      // .reg-text {
      //   font-size: 16px;
      //   text-align: center;
      // margin-top: 10px;
      .find-login-link {
        font-size: 16px;
        color: #333;
        text-decoration: underline;
        cursor: pointer;
        user-select: none;
      }
      .reg-link {
        font-size: 16px;
        color: $theme-color;
        cursor: pointer;
        user-select: none;
      }
      // }
    }
  }
}

.sec-box {
  padding: 60px 0 30px;
  h1,
  h4 {
    margin: 0;
    padding: 0;
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  h1 {
    font-size: 36px;
    font-weight: normal;
    margin-bottom: 20px;
  }

  h4 {
    font-size: 18px;
    font-weight: normal;
    // color: #666;
  }
}
</style>


