<template>
  <div class="main-wrap">
    <div class="hero-area">
      <b-carousel
        id="carousel1"
        style="text-shadow: 1px 1px 2px #333;"
        indicators
        background="#f7f7f7"
        :interval="3000"
        img-width="1024"
        img-height="373"
        v-model="slide"
      >
        <b-carousel-slide img-src="http://www.heneng.cn/plmnhytf12f3/%E5%AE%98%E7%BD%91banner.jpg"></b-carousel-slide>
        <b-carousel-slide
          img-src="http://www.heneng.cn/plmnhytf12f3/%E9%A6%96%E9%A1%B5banner/%E9%93%82%E6%82%A6%E5%8D%8E%E5%BA%AD%E5%AE%98%E7%BD%91banner.jpg"
        ></b-carousel-slide>
        <!-- Slides with image only -->
        <b-carousel-slide
          img-src="http://www.heneng.cn/plmnhytf12f3/%E9%A6%96%E9%A1%B5banner/%E6%B1%9F%E5%B1%BF%E5%AE%98%E7%BD%91banner.jpg"
        ></b-carousel-slide>

        <b-carousel-slide
          img-src="http://www.heneng.cn/plmnhytf12f3/%E9%A6%96%E9%A1%B5banner/%E5%AE%81%E7%8E%A5%E5%BA%9Cbanner.jpg"
        ></b-carousel-slide>
      </b-carousel>

      <div class="login-box">
        <h2 class="title">供应商登录</h2>
        <div class="form-wrap">
          <b-form-input v-model="loginname" type="text" placeholder="输入手机号"></b-form-input>
          <b-form-input v-model="password" type="password" placeholder="输入密码"></b-form-input>
          <div class="login-state-wrap clearfix">
            <span class="login-keep" @click="toggle">
              <v-icon :name="keepLogin ? 'check-square' : 'square'"/>7天内免登录
            </span>
            <span class="forget-password float-right">忘记密码？</span>
          </div>
          <span class="login-btn">登&emsp;录</span>
          <p class="reg-text">
            没有账号？
            <span class="reg-link">立即注册</span>
          </p>
        </div>
      </div>
    </div>
    <div class="sec-box bid-flow">
      <div class="container">
        <h1>官方一站式招投标平台</h1>
        <h4>招投标流程</h4>
        <div class="steps">
          <img src="../../assets/images/img-bid-flow.png" class="img-fluid">
        </div>
      </div>
    </div>
    <div class="sec-box company">
      <!-- <div class="container"> -->
      <h1>合能集团</h1>
      <h4>ALL DREAMS COME TRUE — 所有梦想都开花</h4>
      <div class="image-container">
        <img src="../../assets/images/img-comp-intro.jpg" class="img-fluid">
      </div>

      <!-- </div> -->
    </div>
    <div class="sec-box">
      <h1>合作伙伴</h1>
      <h4>合作共赢，有容乃大</h4>
      <div class="container">
        <div class="partners">
          <div class="partner" v-for="(item,index) in partners" :key="index">
            <img :src="item.icon">
          </div>
        </div>
      </div>
    </div>
    <div class="sec-box contact">
      <div class="container">
        <b-row>
          <b-col cols="4">
            <div class="info-box">
              <v-icon name="phone"/>
              <span class="name">集团总机：028-86248000</span>
              <p class="kefu">客服热线：4006-490-900</p>
            </div>
            <div class="info-box">
              <v-icon name="fax"/>
              <span class="name">028-86248000</span>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="info-box">
              <v-icon name="map-marker"/>
              <span class="name">地址：四川省成都市青羊区西大街1号</span>
            </div>
            <div class="info-box">
              <v-icon name="envelope"/>
              <span class="name">人力资源：hr@heneng.cn</span>
            </div>
          </b-col>
          <b-col cols="2" class="qrcode-wrap">
            <img src="../../assets/images/icon_qrcode.png" class="img-fluid">
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      slide: 0,
      loginname: null,
      password: null,
      keepLogin: false,
      partners: [
        {
          name: "成都建工集团",
          icon: require("../../assets/images/icon_cdbj.jpg")
        },
        {
          name: "大汉科技",
          icon: require("../../assets/images/icon_dhkj.png")
        },
        {
          name: "科道新源集团",
          icon: require("../../assets/images/icon_kdxg.png")
        },
        {
          name: "四川泰力电气有限公司",
          icon: require("../../assets/images/icon_sctl.png")
        }
      ]
    };
  },
  methods: {
    toggle() {
      this.keepLogin = !this.keepLogin;
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;

.hero-area {
  width: 100%;
  position: relative;
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
  // font-size: 16px;
  color: #333;
  .login-box {
    position: absolute;
    z-index: 100;
    width: 280px;
    height: 320px;
    background: rgba(255, 255, 255, 0.95);
    top: 80px;
    right: 10%;
    border-radius: 8px;
    box-shadow: 0 1px 5px #ccc;

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
        margin-bottom: 20px;
        margin-top: -10px;
        font-size: 14px;
        .login-keep {
          line-height: 20px;
          vertical-align: middle;
          cursor: pointer;
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
        margin: 10px 0;
        cursor: pointer;
      }

      .reg-text {
        font-size: 16px;
        text-align: center;
        // margin-top: 10px;
        .reg-link {
          color: $theme-color;
          cursor: pointer;
        }
      }
    }
  }
}

.sec-box {
  padding: 60px 0;
  h1,
  h4 {
    margin: 0;
    padding: 0;
    text-align: center;
    color: #333;
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

.bid-flow {
  background: #fff;
}

.company {
  .image-container {
    margin-top: 30px;
    background: #fff;
    // padding: 0 120px;
    text-align: center;
  }
}

.partners {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  .partner {
    flex: 0 0 25%;
    width: 25%;
    padding: 5px;
    img {
      width: 100%;
      height: 80px;
    }
  }
}

.contact {
  background: #fff;

  .info-box {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
    height: 40px;
    // line-height: 14px;
    .name {
      line-height: 14px;
      vertical-align: middle;
      padding-left: 10px;
      .fa-icon {
        vertical-align: -4px;
      }
    }
    .kefu {
      padding-left: 26px;
    }
  }
  .qrcode-wrap {
    text-align: right;
    img {
      width: 120px;
      height: auto;
    }
  }
}
</style>


