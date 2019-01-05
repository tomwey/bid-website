<template>
  <div class="password-form">
    <div class="form-controls">
      <b-form-input v-model="mobile" :readonly="!!mobile" type="tel" placeholder="手机号"></b-form-input>
      <div class="code-control-wrap">
        <div class="code-control">
          <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
        </div>
        <div class="get-code-btn">
          <get-code :mobile="mobile" :type="codeType"/>
        </div>
      </div>
      <b-form-input v-model="password" type="password" placeholder="输入新密码"></b-form-input>
      <b-form-input v-model="password_confirm" type="password" placeholder="确认新密码"></b-form-input>
      <span class="reg-btn" @click="save">保&emsp;存</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "password-form",
  props: {
    mobile: Number,
    codeType: Number
  },
  components: {
    getCode: function(resolve) {
      require(["@/components/get-code"], resolve);
    }
  },
  data() {
    return {
      // company: null,
      //   mobile: null,
      code: null,
      password: null,
      password_confirm: null
    };
  },
  methods: {
    save() {}
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
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

  .code-control-wrap {
    display: flex;
    .code-control {
      flex: 1;
    }

    .get-code-btn {
      flex: 0 0 98px;
      width: 98px;
      margin-left: 10px;
    }
  }
}
</style>

