<template>
  <div class="count-down">
    <p class="end-date-tip" v-if="hasLeftTime">
      {{prefix}}
      <span class="countdown">{{countDownText}}</span>
    </p>
    <p v-if="!hasLeftTime" class="no-time-left">{{noTimeLeft}}</p>
  </div>
</template>
<script>
export default {
  name: "count-down",
  props: {
    prefix: {
      type: String
    },
    time: {
      type: String
    },
    noTimeLeft: {
      type: String
    }
  },
  data() {
    return {
      timer: null,
      countDownText: null
    };
  },
  mounted() {
    // console.log(this.time);
    this.countdown();
    this.createTimer();
  },
  watch: {
    time() {
      if (this.time) {
        this.countdown();
        this.createTimer();
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  computed: {
    hasLeftTime() {
      let date = new Date();
      let now = date.getTime();
      let endDate = new Date(this.time); //设置截止时间
      let end = endDate.getTime();
      let leftTime = end - now; //时间差
      return leftTime >= 0;
    }
  },
  methods: {
    createTimer() {
      if (!this.hasLeftTime) return;

      if (!this.timer) {
        this.timer = setInterval(() => {
          this.countdown();
        }, 1000);
      }
    },
    countdown() {
      // console.log(this.time);
      if (!this.hasLeftTime) return;

      let date = new Date();
      let now = date.getTime();
      let endDate = new Date(this.time); //设置截止时间
      let end = endDate.getTime();
      let leftTime = end - now; //时间差
      let d, h, m, s, ms;

      if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        m = Math.floor((leftTime / 1000 / 60) % 60);
        s = Math.floor((leftTime / 1000) % 60);
        ms = Math.floor(leftTime % 1000);
        if (ms < 100) {
          ms = "0" + ms;
        }
        if (s < 10) {
          s = "0" + s;
        }
        if (m < 10) {
          m = "0" + m;
        }
        if (h < 10) {
          h = "0" + h;
        }
      } else {
        // this.hasLeftTime = false;
      }

      this.countDownText = `${d}天${h}小时${m}分${s}秒`;
    }
  }
};
</script>
<style lang="scss" scoped>
.end-date-tip {
  font-size: 16px;
  text-align: center;
  color: #333;
  padding: 0 20px;
}
.countdown {
  color: rgb(231, 90, 22);
}

.no-time-left {
  color: #999;
}
</style>


