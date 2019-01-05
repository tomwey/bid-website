<template>
  <div class="login-logs">
    <div class="box">
      <h2>登录日志</h2>
      <div class="list-wrap">
        <horizontal-table :items="items" :fields="fields"/>
        <!-- <b-table striped hover responsive="lg" :items="items" :fields="fields"></b-table> -->
        <div class="empty-error-box" v-if="items.length === 0">暂无日志</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login-log",
  components: {
    horizontalTable: function(resolve) {
      require(["@/components/profile/horizontal-table"], resolve);
    }
  },
  data() {
    return {
      items: [],
      fields: [
        {
          label: "登录时间",
          value: "logindate"
        },
        {
          label: "登录IP",
          value: "ip"
        }
      ]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$post(
        {
          action: "P_SY_GetLoginLog",
          p1: this.$store.state.token
        },
        res => {
          console.log(res);
          if (res.code === "0") {
            this.items = res.data;
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

