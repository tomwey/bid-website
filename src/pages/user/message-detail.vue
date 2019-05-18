<template>
  <div class="message-detail">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/messages' }">消息列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
      <h2 class="title">{{message.msgtitle}}</h2>
      <p class="time">{{message.createdate}}</p>
      <p class="body">{{message.msgcontent}}</p>
      <div class="btn-wrap">
        <el-button v-if="hasDetail" @click="jumpTo">点击查看</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "message-detail",
  data() {
    return {
      message: {}
    };
  },
  mounted() {
    this.loadMsg();
  },
  computed: {
    hasDetail() {
      const arr = [
        "1011",
        "1021",
        "1012",
        "1022",
        "1015",
        "1025",
        "1019",
        "1029",
        "1101",
        "1201",
        "1202",
        "1203",
        "1204",
        "1205",
        "1206",
        "1401"
      ];
      return arr.indexOf((this.message.msgtype || "0").toString()) === -1;
    }
  },
  methods: {
    jumpTo() {
      switch (this.message.msgtype) {
        case "1003": {
          // 招标公告
          this.$router.push({
            path: "/admin/apply-bid/" + `${this.message.jumpid}-0`
          });
          return;
        }
        case "1014":
        case "1024": {
          // 我的报名
          this.$router.push({ name: "user_apply" });
          return;
        }
        case "1006":
        case "1007": {
          // 我的投标—下载招标文件
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-1-0-2`
          });
          return;
        }
        case "1008": {
          // 我的投标—答疑—回复
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-2-0-2`
          });
          return;
        }
        case "1311":
        case "1321": {
          // 我的投标—中标通知
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-100-0-2`
          });
          return;
        }
        default:
          return;
      }
    },
    loadMsg() {
      // console.log(this.$route.params.id);
      const msgID = this.$route.params.id;
      this.$post(
        {
          action: "P_SUP_Bid_GetMsgDetail",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: msgID
        },
        res => {
          // console.log(res);
          if (res.code == 0) {
            const arr = res["data"];
            if (arr.length > 0) {
              this.message = arr[0];
            }
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.breadcrumb-wrapper {
  background: #fff;
  padding: 15px;
  margin-bottom: 15px;
  // border-bottom: 1px solid #f2f2f2;
}
.detail {
  .title {
    text-align: center;
    font-size: 18px;
    color: #333;
    font-weight: 700 !important;
    margin-bottom: 20px;
  }
  .time {
    font-size: 14px;
    color: #999;
    text-align: center;
  }
  .body {
    font-size: 14px;
    color: #333;
  }
  .btn-wrap {
    margin-top: 60px;
    text-align: center;
  }
  background: #fff;
  padding: 30px;
  min-height: 688px;
}
</style>



    