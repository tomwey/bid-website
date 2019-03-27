<template>
  <div class="register">
    <div class="form-box">
      <h2 class="title">供方注册</h2>
      <div class="form-controls">
        <b-form-input
          v-model="comname"
          type="text"
          @blur.native="inputBlur('comname');"
          placeholder="公司名字"
        ></b-form-input>
        <div class="error-tips" v-if="compExists">公司名字已存在</div>
        <b-form-input
          v-model="comuscc"
          type="text"
          @blur.native="inputBlur('comuscc');"
          placeholder="统一社会信用代码"
        ></b-form-input>
        <div class="error-tips" v-if="usccExists">统一社会信用代码已存在</div>
        <!-- <b-form-input v-model="company" type="text" placeholder="公司名称"></b-form-input> -->
        <b-form-input v-model="loginname" type="text" placeholder="登录名"></b-form-input>
        <b-form-input v-model="mobile" type="tel" placeholder="手机号"></b-form-input>
        <div class="code-control-wrap">
          <div class="code-control">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </div>
          <div class="get-code-btn">
            <get-code :mobile="mobile" :type="codetype"/>
          </div>
        </div>
        <b-form-input v-model="password" type="password" placeholder="输入密码"></b-form-input>
        <b-form-input v-model="password_confirm" type="password" placeholder="输入确认密码"></b-form-input>
        <b-form-checkbox v-model="status" value="1" unchecked-value="0">
          <span class="accepts">
            我已阅读并同意
            <a
              href="http://erp20-mobiledoc.heneng.cn:16660/view/YxmhgSw"
              target="_blank"
              class="accept-links"
            >《合能招标采购平台注册协议》</a>
          </span>
        </b-form-checkbox>
        <span class="reg-btn" @click="commit">注&emsp;册</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "register",
  components: {
    getCode: function(resolve) {
      require(["@/components/get-code"], resolve);
    }
  },
  data() {
    return {
      comname: null,
      comuscc: null,
      loginname: null,
      compExists: false,
      usccExists: false,
      // company: null,
      mobile: null,
      code: null,
      codetype: "2",
      password: null,
      password_confirm: null,
      status: "0"
    };
  },
  methods: {
    inputBlur(item) {
      let type = null;
      let value = null;
      if (item == "comname") {
        type = "0";
        value = this.comname;
      } else if (item == "comuscc") {
        type = "1";
        value = this.comuscc;
      } else {
        return;
      }

      this.$post(
        {
          action: "P_SUP_Reg_IsRepeatComOrCode",
          p1: value,
          p2: type
          // p3: this.$store.state.supinfo.supid || ""
        },
        res => {
          // console.log(res);
          if (res.code == "1") {
            // item.error_tips = `${item.name}已存在`;
            // console.log(item);
            // this.$set(item, "error_tips", `${item.label}已存在`);
            if (item == "comname") {
              this.compExists = true;
            } else if (item == "comuscc") {
              this.usccExists = true;
            }
          } else {
            // item.error_tips = null;
            // this.$set(item, "error_tips", null);
            if (item == "comname") {
              this.compExists = false;
            } else if (item == "comuscc") {
              this.usccExists = false;
            }
          }
        }
      );
    },
    commit() {
      if (!this.comname) {
        this.$message({
          type: "error",
          message: "公司名字不能为空"
        });
        return;
      }

      if (!this.comuscc) {
        this.$message({
          type: "error",
          message: "统一社会信用代码不能为空"
        });
        return;
      }

      if (!this.loginname) {
        // alert("登录名不能为空");
        this.$message({
          type: "error",
          message: "登录名不能为空"
        });
        return;
      }
      if (!this.mobile) {
        // alert("手机号不能为空");
        this.$message({
          type: "error",
          message: "手机号不能为空"
        });
        return;
      }

      if (!this.isPhone(this.mobile)) {
        // alert("不正确的手机号");
        this.$message({
          type: "error",
          message: "不正确的手机号"
        });
        return;
      }

      if (!this.password || this.password.length < 6) {
        // alert("密码太短，至少为6位");
        this.$message({
          type: "error",
          message: "密码太短，至少为6位"
        });
        return;
      }

      if (this.password !== this.password_confirm) {
        // alert("两次密码输入不一致");
        this.$message({
          type: "error",
          message: "两次密码输入不一致"
        });
        return;
      }

      if (this.status !== "1") {
        // alert("需要接受合能招标采购平台注册协议");
        this.$message({
          type: "error",
          message: "需要接受合能招标采购平台注册协议"
        });
        return;
      }

      this.$post(
        {
          action: "P_SUP_Register",
          p1: this.loginname,
          p2: this.mobile,
          p3: this.GetPassword(this.password),
          p4: this.code,
          p5: this.codetype,
          p6: this.comname,
          p7: this.comuscc
        },
        res => {
          if (res.code == 0) {
            if (res.count == 1) {
              let arr = res.data;
              let item = arr[0];

              // this.$store.commit("login", {
              //   token: item.token,
              //   days: 1
              // });
              this.$store.commit("register", {
                token: item.token,
                uid: item.accountid,
                days: 1,
                loginname: item.loginname
              });

              this.$router.push({
                name: "user_home"
              });
            } else {
              alert("不正确的注册结果");
            }
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
$theme-color: #e46623;
.error-tips {
  font-size: 14px;
  color: $theme-color;
  // margin-top: 3px;
  margin-bottom: 15px;
}

.register {
  .form-box {
    background: #fff;
    width: 380px;
    margin: 0 auto;
    box-shadow: 0 0 1px #e6e6e6;
    .title {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 20px;
      color: #333;
    }

    .accepts {
      font-size: 14px !important;
      color: #333;
    }

    .accept-links {
      color: $theme-color;
      text-decoration: none;
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
    .form-controls {
      padding: 20px;

      .form-control {
        margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
        font-size: 14px;
        &:focus {
          border-color: #e46623;
        }
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


