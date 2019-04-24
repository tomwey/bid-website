<template>
  <div class="container">
    <div class="dashboard">
      <div class="sidebar">
        <dl class="menu" v-for="(menu,index) in menus" :key="index">
          <dt
            :class="{tappable:(!menu.menu_items ||menu.menu_items.length === 0), active:currentMenu == menu}"
            @click="selectTopMenu(menu)"
          >
            <v-icon :name="menu.icon"/>
            {{menu.name}}
          </dt>
          <dd
            :class="{active:currentMenuItem == item}"
            @click="selectMenu(item);"
            v-for="(item,index2) in menu.menu_items"
            :key="index2"
          >
            {{item.name}}
            <span
              class="custom-badge"
              v-if="item.badge"
            >{{item.badge > 99 ? '99+' : item.badge}}</span>
          </dd>
        </dl>

        <div class="logout">
          <span class="logout-btn" @click="logout">退出登录</span>
        </div>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "user",
  data() {
    return {
      currentMenuItem: null,
      currentMenu: null,
      menus: [
        {
          name: "控制面板",
          icon: "home",
          route: "user_home",
          menu_items: []
        },
        {
          name: "消息中心",
          icon: "envelope",
          menu_items: [
            {
              name: "我的消息",
              route: "user_messages",
              badge: 1
            }
          ]
        },
        {
          name: "招标管理",
          icon: "gavel",
          menu_items: [
            {
              name: "报名通知",
              route: "user_apply_notify"
            },
            {
              name: "我的报名",
              route: "user_apply"
            },
            {
              name: "我的入围",
              route: "user_applied"
            },
            {
              name: "我的投标",
              route: "user_bids"
            }
            // {
            //   name: "答疑",
            //   route: "user_bid_faq"
            // },
            // {
            //   name: "定标",
            //   route: "user_bid_result"
            // }
          ]
        },
        {
          name: "供应商资料",
          icon: "list-alt",
          menu_items: [
            {
              name: "基本信息",
              route: "user_company"
            },
            {
              name: "联系方式",
              route: "user_man"
            },
            {
              name: "服务城市",
              route: "user_area"
            },
            {
              name: "服务类别",
              route: "user_service_type"
            },
            {
              name: "公司业绩",
              route: "user_company_achievement"
            },
            {
              name: "其他信息",
              route: "user_other_info"
            },
            {
              name: "其他附件",
              route: "user_other_attachments"
            }
          ]
        },
        {
          name: "账号安全",
          icon: "user",
          menu_items: [
            {
              name: "账号管理",
              route: "user_account"
            },
            {
              name: "修改密码",
              route: "user_change_pwd"
            },
            {
              name: "登录日志",
              route: "user_login_log"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.menus.forEach(menu => {
      menu.menu_items.forEach(item => {
        const name = this.$router.currentRoute.name;
        // console.log(item);
        if (item.route === name) {
          this.currentMenuItem = item;
        }
      });
    });
    const route = this.$router.currentRoute;
    if (route.name === "user_home") {
      this.currentMenu = this.menus[0];
    }
    // console.log(this.$router.currentRoute);
  },
  watch: {
    $route: function(to) {
      // console.log(123);
      this.currentMenu = null;
      this.menus.forEach(menu => {
        menu.menu_items.forEach(item => {
          const name = this.$router.currentRoute.name;
          console.log(item);
          if (item.route === name) {
            this.currentMenuItem = item;
          }
        });
      });

      const route = this.$router.currentRoute;
      if (route.name === "user_home") {
        this.currentMenu = this.menus[0];
      }
    }
  },
  methods: {
    selectTopMenu(menu) {
      if (!menu) return;
      if (menu.menu_items && menu.menu_items.length > 0) return;
      // console.log(menu);
      this.currentMenuItem = null;
      this.currentMenu = menu;

      if (menu.route === "user_home") {
        this.$router.push({ name: menu.route, params: { id: 91039283 } });
      } else {
        this.$router.push({ name: menu.route });
      }
    },
    selectMenu(item) {
      this.currentMenuItem = item;
      this.currentMenu = null;

      this.$router.push({
        name: item.route
      });
    },
    logout() {
      // this.$saveToken(null, -1);
      this.$store.commit("logout");
      this.currentMenuItem = null;
      this.$router.push({ name: "home" });
    }
  }
};
</script>
<style lang="scss">
$theme-color: #e46623;
.dashboard {
  padding: 80px 0 20px;
  display: flex;
  .sidebar {
    flex: 0 0 150px;
    width: 150px;
    // height: 688px;
    max-height: 880px;
    background: #fff;
    margin-right: 20px;
    // padding: 20px;
    dl,
    dt,
    dd {
      margin: 0;
      padding: 0;
    }

    .menu {
      padding: 20px;
      border-bottom: 1px solid #eee;
      dt,
      dd {
        vertical-align: middle;
        line-height: 20px;
        position: relative;
        .custom-badge {
          position: absolute;
          top: 2px;
          right: -8px;
          display: inline-block;
          padding: 0 6px;
          height: 18px;
          line-height: 18px;
          font-size: 12px;
          // font-weight: 500;
          border-radius: 9px;
          // vertical-align: middle;
          background: rgb(231, 90, 22);
          // font-family: "PingFang SC", Arial, Helvetica, sans-serif;
          color: #fff;
        }
        &.active {
          color: $theme-color;
          position: relative;
          .fa-icon {
            color: $theme-color;
          }
          &::before {
            content: "";
            display: block;
            width: 2px;
            height: 24px;
            background: $theme-color;
            position: absolute;
            top: 0;
            left: -20px;
          }
        }
        &:hover {
          color: $theme-color;
          position: relative;
          .fa-icon {
            color: $theme-color;
          }
          &::before {
            content: "";
            display: block;
            width: 2px;
            height: 24px;
            background: $theme-color;
            position: absolute;
            top: 0;
            left: -20px;
          }
        }
      }
      dt {
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
        .fa-icon {
          color: #666;
          vertical-align: -2px;
          margin-right: 5px;
        }

        &.tappable {
          cursor: pointer;
          user-select: none;
        }
      }
      dd {
        font-size: 14px;
        color: #333;
        cursor: pointer;
        padding: 2px 25px;
        user-select: none;
      }
    }

    .logout {
      //   margin: 20px 0;
      padding: 20px;
      text-align: center;
      .logout-btn {
        display: block;
        width: 100%;
        font-size: 14px;
        background: $theme-color;
        color: #fff;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
  .main-content {
    flex: 1;
    width: calc(100% - 150px);
  }
}
</style>

<style lang="scss" scoped>
</style>


