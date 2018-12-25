<template>
  <div class="container">
    <div class="dashboard">
      <div class="sidebar">
        <dl class="menu" v-for="(menu,index) in menus" :key="index">
          <dt>
            <v-icon :name="menu.icon"/>
            {{menu.name}}
          </dt>
          <dd
            :class="{active:currentMenuItem == item}"
            @click="selectMenu(item);"
            v-for="(item,index2) in menu.menu_items"
            :key="index2"
          >{{item.name}}</dd>
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
      menus: [
        {
          name: "消息中心",
          icon: "envelope",
          menu_items: [
            {
              name: "我的消息",
              route: "user_messages"
            }
          ]
        },
        {
          name: "招标管理",
          icon: "gavel",
          menu_items: [
            {
              name: "招标文件",
              route: "user_bid"
            },
            {
              name: "中标结果",
              route: "user_bid_result"
            }
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
              name: "服务区域",
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
  },
  methods: {
    selectMenu(item) {
      this.currentMenuItem = item;

      this.$router.push({
        name: item.route
      });
    },
    logout() {
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
        &.active {
          color: $theme-color;
          position: relative;
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
      }
      dd {
        font-size: 14px;
        color: #333;
        cursor: pointer;
        padding: 2px 25px;
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
      }
    }
  }
  .main-content {
    flex: 1;
  }
}
</style>

<style lang="scss" scoped>
</style>


