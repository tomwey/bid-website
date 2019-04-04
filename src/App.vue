<template>
  <div id="body-wrap">
    <b-navbar toggleable="md" type="light" variant="white" fixed="top">
      <div class="container">
        <b-navbar-brand @click="gotoHome">
          <img src="./assets/images/logo.png" class="logo">
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            @click="selectLink(index);"
            :class="{active:selectedIndex === index}"
            v-for="(item,index) in links"
            :key="index"
            :href="item.href"
          >{{item.name}}</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav>
          <!-- <b-nav-item href="#" disabled> -->
          <el-button type="primary" @click="gotoUserHome">用户中心</el-button>
          <!-- </b-nav-item> -->
        </b-navbar-nav>
      </div>
    </b-navbar>

    <router-view></router-view>

    <footer class="footer">
      <div class="container">
        <!-- <span class="text-muted">版权所有 © 2018 合能集团 保留所有权利.蜀ICP备14031323号</span>
        <div class="float-right links">
          <a href="http://www.heneng.cn" target="_blank">合能集团</a>
        </div>-->
        <div class="info-wrap">
          <div class="info-box">
            <div class="info-text">
              <p class="info">服务热线: 4006-490-900</p>
              <p class="info">集团总机: 028-86248000</p>
              <p class="info">举报电话: 15882407055</p>
              <p class="info">
                举报邮箱:
                <a href="mailto:HNJCJB@heneng.cn">HNJCJB@heneng.cn</a>
              </p>
              <p class="info">总部地址: 成都市青羊区西大街1号</p>
            </div>
            <p class="copyright">
              版权所有 © {{new Date().getFullYear()}}
              <a href="http://www.heneng.cn" target="_blank">合能集团</a> 保留所有权利.蜀ICP备14031323号
            </p>
          </div>
          <div class="qrcode">
            <div class="qrcode-inner">
              <img src="@/assets/images/icon_qrcode.jpg" class="img-fluid">
              <p>供应商APP客户端</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      selectedIndex: 0,
      links: [
        {
          id: 1,
          name: "首页",
          route: "home"
          // href: "#hero-area"
        },
        {
          id: 2,
          name: "合能集团",
          route: "about",
          href: "/#about"
        },
        {
          id: 3,
          name: "招标计划",
          route: "plan"
        },
        {
          id: 4,
          name: "招标公告",
          route: "notice"
        },
        {
          id: 5,
          name: "合作伙伴",
          route: "partner",
          href: "/#partner"
        },
        {
          id: 6,
          name: "合能官网",
          route: "hn"
        },
        {
          id: 7,
          name: "操作手册",
          route: "help"
        }
        // {
        //   id: 8,
        //   name: "用户中心",
        //   route: "user_home"
        // }
      ]
    };
  },
  mounted() {
    // console.info(123);
    const route = this.$router.currentRoute;
    this._updateSelectedLink(route);

    // let payload = JSON.stringify({
    //   action: "P_SUP_Login",
    //   p1: "sup2",
    //   p2: "123456",
    //   p3: "''",
    //   p4: "''"
    // });

    // let i = "123456";
    // let ak = md5(payload + i + "HNSUP.2018._.123");
    // this.$axios
    //   .post("http://10.19.0.52:8181/api/gwc", {
    //     payload: payload,
    //     ak: ak,
    //     i: i
    //   })
    //   .then(function(res) {
    //     console.log(res);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  },
  watch: {
    $route: function(to) {
      // console.log(to.hash);
      // console.log(to.path);
      // if (to.hash) {
      //   if (to.hash === "#about") {
      //     this.selectedIndex = 1;
      //   } else if (to.hash === "#partner") {
      //     this.selectedIndex = this.links.length - 2;
      //   }
      // } else {
      //   this._updateSelectedLink(to.name);
      // }
      this._updateSelectedLink(to);
    }
  },
  methods: {
    gotoUserHome() {
      this.$router.push({ name: "user_home" });
    },
    gotoHome() {
      this.$router.push({ name: "home" });
    },
    selectLink(index) {
      // this.selectedIndex = index;
      if (
        this.links[index].route === "about" ||
        this.links[index].route === "partner"
      ) {
        return;
      }

      if (this.links[index].route === "hn") {
        window.open("http://www.heneng.cn");
        // this.selectedIndex = -1;
        return;
      }

      if (this.links[index].route === "help") {
        window.open(
          "http://erp20-mobiledoc.heneng.cn:16660/view/url?url=http%3A%2F%2Ferp20-app.heneng.cn%3A16681%2Ffile%2Ferp20-annex.heneng.cn%2FH_WF_INST_M%2F2019-04-03%2F1646316%2F1646316.docx"
        );
        // this.selectedIndex = -1;
        return;
      }

      this.$router.push({ name: this.links[index].route });
    },
    _updateSelectedLink(route) {
      this.selectedIndex = -1;

      if (route.hash === "#about") {
        this.selectedIndex = 1;
      } else if (route.hash === "#partner") {
        this.selectedIndex = this.links.length - 3;
      } else {
        for (let index = 0; index < this.links.length; index++) {
          const link = this.links[index];
          // console.log(route);
          if (
            link.route === route.name ||
            (route.path && route.path.indexOf(link.route) !== -1)
          ) {
            this.selectedIndex = index;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
$theme-color: #e46623;

.bg-white {
  background-color: #fff !important;
  border-bottom: 1px solid #f1f1f1 !important;
}

.home-main-wrap {
  padding-top: 60px;
}

#body-wrap {
  .navbar-brand {
    cursor: pointer;
    user-select: none;
  }
  .nav-item {
    margin-right: 15px;
    position: relative;
    &:last-child {
      margin-right: 0;
    }
    &.active,
    &:hover {
      .nav-link {
        color: $theme-color !important;
      }

      &::after {
        content: "";
        display: block;
        height: 2px;
        width: 100%;
        background: $theme-color;
        position: absolute;
        left: 0;
        bottom: -10px;
      }
    }
  }
}

.links {
  a {
    color: #fff;
    // text-decoration: underline;
    &:hover {
      color: #fff;
    }
  }
}
</style>

<style lang="scss" scoped>
.logo {
  max-height: 32px;
  // width: 51px;
}
</style>

