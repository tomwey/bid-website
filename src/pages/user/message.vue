<template>
  <div class="messages" v-loading="loading">
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
      loading: false,
      messages: []
    };
  },
  watch: {
    active() {
      this.loadData();
    }
  },
  mounted() {
    // this.messages = [];
    this.loadData();
  },
  methods: {
    loadData() {
      if (this.loading) return;

      this.loading = true;

      this.$post(
        {
          action: "P_SUP_Bid_GetMsg",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token
        },
        res => {
          // console.log(res);
          this.loading = false;
          if (res.code == "0") {
            const arr = res.data;
            if (arr && Array.isArray(arr)) {
              let temp = [];
              arr.forEach(ele => {
                if (this.active === 0) {
                  if (ele["readstate"] == "0") {
                    temp.push(ele);
                  }
                } else {
                  if (ele["readstate"] == "1") {
                    temp.push(ele);
                  }
                }
              });
              this.messages = temp;
            }
          }
        }
      );
    },
    selectTab(index) {
      this.active = index;
      if (index === 1) {
        this.messages = [];
      } else {
        this.messages = [];
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
    padding: 15px 0;
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

