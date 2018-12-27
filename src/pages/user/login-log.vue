<template>
  <div class="login-logs">
    <div class="box">
      <h2>登录日志</h2>
      <div class="list-wrap">
        <b-table striped hover responsive="lg" :items="items" :fields="fields"></b-table>
        <div class="empty-error-box" v-if="items.length === 0">暂无日志</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login-log",
  data() {
    return {
      items: [
        {
          time: "2018-12-12 13:00:32",
          ip: "230.12.34.65"
        },
        {
          time: "2018-12-12 11:20:12",
          ip: "30.112.4.59"
        }
      ],
      fields: {
        time: {
          label: "登录时间"
        },
        ip: {
          label: "登录IP"
        }
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>

