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
          >{{item.name}}</b-nav-item>
        </b-navbar-nav>
      </div>
    </b-navbar>

    <router-view></router-view>

    <footer class="footer">
      <div class="container">
        <span class="text-muted">版权所有 © 2018 合能集团 保留所有权利.蜀ICP备14031323号</span>
        <div class="float-right links">
          <a href="http://www.heneng.cn" target="_blank">合能集团</a>
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
        },
        {
          id: 2,
          name: "合能集团",
          route: "about"
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
          route: "partner"
        },
        {
          id: 6,
          name: "联系我们",
          route: "contact"
        }
      ]
    };
  },
  mounted() {
    // console.info(123);
    const route = this.$router.currentRoute;
    this._updateSelectedLink(route.name);

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
      this._updateSelectedLink(to.name);
    }
  },
  methods: {
    gotoHome() {
      this.$router.push({ name: "home" });
    },
    selectLink(index) {
      // this.selectedIndex = index;
      this.$router.push({ name: this.links[index].route });
    },
    _updateSelectedLink(name) {
      this.selectedIndex = -1;
      for (let index = 0; index < this.links.length; index++) {
        const link = this.links[index];
        if (link.route === name) {
          this.selectedIndex = index;
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

