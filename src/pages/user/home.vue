<template>
  <div class="user-home">
    <div class="box">
      <div class="base-info">
        <div class="info-wrap">
          <div class="icon-wrap">
            <img src="../../assets/images/icon_cdjg.png">
          </div>
          <div class="content-wrap">
            <p class="title">成都建工集团有限公司</p>
            <p class="account">
              登录账号：
              <span class="name">133****5678</span>
            </p>
            <b-badge>待审核</b-badge>
          </div>
        </div>
      </div>
      <div class="stat-info">
        <b-row>
          <b-col cols="4">
            <div class="stat">
              <p class="value">5</p>
              <p class="label">已投标</p>
            </div>
          </b-col>
          <b-col cols="4">
            <div class="stat">
              <p class="value">2</p>
              <p class="label">已中标</p>
            </div>
          </b-col>
          <b-col cols="4">
            <div class="stat">
              <p class="value">10</p>
              <p class="label">未读消息</p>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="box">
      <h2>未读消息
        <b-badge
          class="float-right"
          pill
          variant="danger"
          v-if="messages.length > 0"
        >{{messages.length}}</b-badge>
      </h2>
      <message-list :messages="messages"/>
      <div class="empty-error-box" v-if="messages.length === 0">暂无未读消息</div>
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
      messages: [
        {
          title: "未读消息一",
          time: "2018-12-21 13:23:30"
        },
        {
          title: "未读消息二",
          time: "2018-12-21 13:23:30"
        },
        {
          title: "招标文件资料不完整，请速度补充",
          time: "2018-12-21 13:23:30"
        },
        {
          title: "招标文件资料不完整，请速度补充",
          time: "2018-12-21 13:23:30"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
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
        padding: 10px;
        border-radius: 0;
        font-size: 12px;
        font-weight: normal;
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


