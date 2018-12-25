<template>
  <div class="messages">
    <div class="box">
      <div class="custom-tabs">
        <span class="custom-tab" :class="{active:active === 0}" @click="selectTab(0)">未读消息</span>
        <span class="custom-tab" :class="{active:active === 1}" @click="selectTab(1)">已读消息</span>
      </div>
      <message-list :messages="messages"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "message",
  components: {
    messageList: function(resolve) {
      require(["@/components/message/list"], resolve);
    }
  },
  data() {
    return {
      active: 0,
      messages: []
    };
  },
  mounted() {
    this.messages = [
      {
        title: "消息1",
        time: "2018-12-12 13:00:23"
      },
      {
        title: "消息1",
        time: "2018-12-12 13:00:23"
      },
      {
        title: "消息1",
        time: "2018-12-12 13:00:23"
      }
    ];
  },
  methods: {
    selectTab(index) {
      this.active = index;
      if (index === 1) {
        this.messages = [
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息2",
            time: "2018-12-12 13:00:23"
          }
        ];
      } else {
        this.messages = [
          {
            title: "消息1",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息1",
            time: "2018-12-12 13:00:23"
          },
          {
            title: "消息1",
            time: "2018-12-12 13:00:23"
          }
        ];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.custom-tabs {
  padding: 0 15px;
  border-bottom: 1px solid #f2f2f2;
  .custom-tab {
    display: inline-block;
    padding: 10px 0;
    font-size: 14px;
    margin-right: 20px;
    cursor: pointer;
    font-weight: 700;
    &.active {
      color: $theme-color;
      position: relative;
      &::after {
        position: absolute;
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background: $theme-color;
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>

