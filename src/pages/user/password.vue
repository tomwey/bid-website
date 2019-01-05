<template>
  <div class="password">
    <div class="box">
      <h2>修改密码</h2>

      <div class="form-wrap">
        <div class="error-box" v-if="!!error">{{error}}</div>
        <div class="form-controls">
          <b-form-input v-model="old_password" type="password" placeholder="输入旧密码"></b-form-input>
          <b-form-input v-model="password" type="password" placeholder="输入新密码"></b-form-input>
          <b-form-input v-model="password_confirm" type="password" placeholder="确认新密码"></b-form-input>
          <span class="reg-btn" @click="save">保&emsp;存</span>
        </div>
        <!-- <password-form :mobile="mobile" :code-type="4"/> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "password",
  components: {
    // passwordForm: function(resolve) {
    //   require(["@/components/profile/password-form"], resolve);
    // }
  },
  data() {
    return {
      error: null,
      old_password: null,
      password: null,
      password_confirm: null
      // company: null,
      // mobile: this.$store.state.supinfo.telephone
    };
  },
  methods: {
    save() {
      if (!this.old_password) {
        this.error = "旧密码不能为空";
        return;
      }
      if (!this.password || this.password.length < 6) {
        this.error = "新密码至少为6位";
        return;
      }
      if (this.password_confirm !== this.password) {
        this.error = "确认密码与新密码输入不一致";
        return;
      }

      this.$post(
        {
          action: "updateaccountinfo",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: "3",
          p4: this.GetPassword(this.password),
          p5: this.GetPassword(this.old_password)
        },
        res => {
          if (res.code === "0") {
            this.$store.commit("logout");
            this.$router.push({ path: "/" });
          } else {
            this.error = res.codemsg;
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.error-box {
  text-align: center;
  font-size: 16px;
  color: $theme-color;
  padding: 20px;
}
.password {
  .form-wrap {
    // padding: 30px 60px;
    width: 360px;
    margin: 0 auto;
    padding: 60px 0;

    .form-controls {
      padding: 20px;

      .form-control {
        margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
      }

      .reg-btn {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: $theme-color;
        margin: 40px 0 20px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>

