<template>
  <div class="user-home">
    <div class="box">
      <div class="base-info">
        <div class="info-wrap">
          <div class="icon-wrap">
            <v-icon name="user-circle" scale="4.5" style="color: #999"/>
          </div>
          <div class="content-wrap">
            <p class="title">{{$store.state.supinfo.supname}}</p>
            <p class="account">
              登录手机：
              <span class="name">{{$store.state.supinfo.telephone}}</span>
            </p>
            <p class="account">
              登录账号：
              <span class="name">{{$store.state.supinfo.loginname}}</span>
            </p>
            <b-badge :variant="variant">{{$store.state.supinfo.supstatename}}</b-badge>
          </div>
          <div class="edit-wrap">
            <!-- <b-button @click="editProfile">资料维护</b-button> -->
            <el-button @click="editProfile" plain type="primary">资料维护</el-button>
          </div>
        </div>
      </div>
      <div class="stat-info">
        <b-row>
          <b-col cols="4">
            <div class="stat">
              <p class="value">{{$store.state.supinfo.bidcount || 0}}</p>
              <p class="label">已投标</p>
            </div>
          </b-col>
          <b-col cols="4">
            <div class="stat">
              <p class="value">{{$store.state.supinfo.bidwincount || 0}}</p>
              <p class="label">已中标</p>
            </div>
          </b-col>
          <b-col cols="4">
            <div class="stat">
              <p class="value">{{$store.state.supinfo.msgunreadcount || 0}}</p>
              <p class="label">未读消息</p>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="box">
      <h2 class="title">
        未读消息
        <b-badge
          class="float-right"
          pill
          variant="danger"
          v-if="messages.length > 0"
        >{{messages.length}}</b-badge>
      </h2>
      <message-list :messages="messages"/>
      <!-- <div class="empty-error-box" v-if="messages.length === 0">暂无未读消息</div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "user-home",
  components: {
    messageList: function(resolve) {
      require(["@/components/message/list"], resolve);
    }
  },
  data() {
    return {
      messages: []
    };
  },
  mounted() {
    this.loadUnreadMessage();
    // 获取一次未读消息
    this.$post(
      {
        action: "P_SUP_GetAccountSupInfo",
        p1: this.$store.state.supinfo.accountid,
        p2: this.$store.state.token
      },
      res => {
        // console.log(res);
        if (res.code === "0") {
          // store.state.supinfo =
          let arr = res.data;
          if (arr.length > 0) {
            this.$store.commit("updatesupinfo", arr[0]);
          }
        }
      }
    );
  },
  computed: {
    variant() {
      if (this.$store.state.supinfo.supstate == 20) {
        return "primary";
      } else if (this.$store.state.supinfo.supstate == 40) {
        return "success";
      } else if (this.$store.state.supinfo.supstate == 5) {
        return "danger";
      } else if (this.$store.state.supinfo.supstate == 50) {
        return "warning";
      } else if (this.$store.state.supinfo.supstate == 10) {
        // 待考察
        return "info";
      }

      return "secondary";
    }
  },
  methods: {
    loadUnreadMessage() {
      this.loading = true;

      this.$post(
        {
          action: "P_SUP_Bid_GetMsg",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: 1,
          p4: 5000
        },
        res => {
          // console.log(res);
          this.loading = false;
          if (res.code == "0") {
            const arr = res.data;
            if (arr && Array.isArray(arr)) {
              let temp = [];
              arr.forEach(ele => {
                if (ele["readstate"] == "0") {
                  temp.push(ele);
                }
              });
              this.messages = temp;
            }
          }
        }
      );
    },
    editProfile() {
      // this.$router.push({ name: "profile" });
      this.$post(
        {
          action: "P_SUP_CanModifySubInfo",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            this.$store.commit("changeeditstate", res.code === "0");
            this.$router.push({ name: "profile" });
          } else {
            // alert(res.codemsg);
            this.$message({
              message: res.codemsg,
              type: "error"
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$theme-color: #e46623;
.base-info {
  padding: 15px 15px 0;
  .info-wrap {
    display: flex;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 20px;
    .icon-wrap {
      flex: 0 0 80px;
      width: 80px;
      margin-right: 10px;
      img {
        max-width: 80px;
      }
    }
    .edit-wrap {
      flex: 0 0 120px;
      width: 120px;
      text-align: right;
      padding-top: 20px;
      .btn {
        background: #fff;
        font-size: 14px;
        color: $theme-color;
        border-color: $theme-color;
      }
    }
    .content-wrap {
      flex: 1;
      p {
        margin: 0;
        margin-bottom: 5px;
      }
      .title {
        font-size: 16px;
        color: #333;
      }
      .account {
        font-size: 14px;
        color: #999;
        .name {
          color: #333;
        }
      }

      .badge {
        padding: 4px 6px;
        // border-radius: 0;
        // font-size: 14px;
        font-weight: normal;
        color: #fff;
        font-size: 12px;
        // vertical-align: middle;
        // line-break: 12px;
      }
    }
  }
}

.stat-info {
  padding: 15px;
  .stat {
    text-align: center;
    p {
      margin: 0;
    }
    .value {
      font-size: 36px;
      color: #333;
      font-weight: 700;
    }
    .label {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>


