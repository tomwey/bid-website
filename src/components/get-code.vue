<template>
  <div class="get-code" @click="getCode" :class="{readonly:disableBtn}">{{btnText}}</div>
</template>
<script>
export default {
  name: "get-code",
  props: {
    mobile: String,
    type: String
  },
  data() {
    return {
      timer: null,
      seconds: 59,
      disableBtn: false
    };
  },
  mounted() {
    this.reset();

    // console.lg(123);
  },
  beforeDestroy() {
    // console.log("ddddd");
    this.reset();
  },
  computed: {
    btnText() {
      if (this.seconds <= 0) {
        return "获取验证码";
      } else {
        return `${this.seconds}秒`;
      }
    }
  },
  methods: {
    reset() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      // this.seconds = 59;
      this.seconds = 0;
      this.disableBtn = false;
      // this.btnText = "获取验证码";
      this.timer = null;
    },
    createTimer() {
      if (!this.timer) {
        this.seconds = 59;
        this.timer = setInterval(() => {
          this.seconds--;
          if (this.seconds === 0) {
            // this.canGetCode = true;
            this.reset();
          }
        }, 1000);
      }
    },
    getCode() {
      // console.log(this.mobile);
      if (this.disableBtn) return;

      if (!this.mobile) {
        alert("手机号不能为空");
        return;
      }

      if (!this.isPhone(this.mobile)) {
        alert("不正确的手机号");
        return;
      }

      let that = this;

      this.$post(
        { action: "sendsms", p1: this.mobile, p2: this.type },
        function(res) {
          if (res.error) {
            console.log("##### Error:", res.error);
          }

          if (res.code == 0) {
            // 获取验证码成功，
            that.disableBtn = true;
            // 启动定时器
            that.createTimer();
          } else {
            alert(res.codemsg);
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.get-code {
  &.readonly {
    opacity: 0.6;
  }
  background: #e46623;
  width: 98px;
  font-family: inherit;
  height: 36px;
  line-height: 36px;
  display: block;
  font-size: 14px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  user-select: none;
}
</style>


