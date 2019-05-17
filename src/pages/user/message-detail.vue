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
        <el-button v-if="hasDetail">点击查看</el-button>
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
      const arr = ["1", "2", "3", "5", "9"];
      return arr.indexOf((this.message.msgtype || "0").toString()) === -1;
    }
  },
  methods: {
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



    