<template>
  <div class="account">
    <b-row>
      <b-col cols="6">
        <div class="box">
          <h2>登录账号</h2>
          <div class="info-wrap">
            <div class="icon-wrap">
              <v-icon name="user-circle" scale="3"/>
            </div>
            <div class="info">
              <span class="success-text">
                <v-icon name="check-circle"/>已登录
              </span>
              <p class="result-text">
                <span class="label">您的登录账号为:</span>
                <br>
                {{$store.state.supinfo.loginname}}
              </p>
            </div>
            <div class="button-wrap">
              <b-button size="sm" v-b-modal.loginNameModal>修改</b-button>
            </div>
          </div>
        </div>
      </b-col>
      <b-col cols="6">
        <div class="box">
          <h2>绑定手机</h2>
          <div class="info-wrap">
            <div class="icon-wrap">
              <v-icon name="mobile-alt" scale="3"/>
            </div>
            <div class="info">
              <span class="success-text">
                <v-icon name="check-circle"/>已绑定
              </span>
              <p class="result-text">
                <span class="label">您绑定的手机号为:</span>
                <br>
                {{$store.state.supinfo.telephone}}
              </p>
            </div>
            <div class="button-wrap">
              <b-button size="sm" v-b-modal.mobileModal>修改</b-button>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <b-modal
      id="mobileModal"
      centered
      title="更换手机号"
      ok-title="保存"
      ok-variant="danger"
      cancel-title="取消"
      @ok="commit"
      ref="mobileModal"
      @cancel="reset"
      @hide="reset"
    >
      <div class="fields-wrap">
        <div class="error-box" v-if="!!error">{{error}}</div>
        <table class="table">
          <tr>
            <td class="label">
              <label>原手机号</label>
            </td>
            <td class="input-control">{{$store.state.supinfo.telephone}}</td>
          </tr>
          <tr>
            <td class="label">
              <label for="mobile">新手机号</label>
            </td>
            <td class="input-control">
              <b-form-input v-model="mobile" type="tel" id="mobile" placeholder="输入新手机号"></b-form-input>
            </td>
          </tr>
          <tr>
            <td class="label">
              <label for="code">验证码</label>
            </td>
            <td class="input-control">
              <!-- <b-row>
                <b-col cols="7">
                  <b-form-input v-model="code" id="code" type="tel" placeholder="输入验证码"></b-form-input>
                </b-col>
                <b-col cols="5">
                  <get-code :mobile="mobile" :type="codetype"/>
                </b-col>
              </b-row>-->
              <div class="code-control-wrap">
                <div class="code-control">
                  <b-form-input v-model="code" type="tel" placeholder="输入验证码"></b-form-input>
                </div>
                <div class="get-code-btn">
                  <get-code :mobile="mobile" :type="codetype"/>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </b-modal>

    <b-modal
      id="loginNameModal"
      centered
      title="修改登录名"
      ok-title="保存"
      ok-variant="danger"
      cancel-title="取消"
      @ok="commit"
      @cancel="reset"
      @hide="reset"
      ref="loginModal"
    >
      <div class="fields-wrap">
        <div class="error-box" v-if="!!error">{{error}}</div>
        <table class="table">
          <tr>
            <td class="label">
              <label>原登录号</label>
            </td>
            <td class="input-control">{{$store.state.supinfo.loginname}}</td>
          </tr>
          <tr>
            <td class="label">
              <label for="login-name">新登录名</label>
            </td>
            <td class="input-control">
              <b-form-input v-model="loginname" type="tel" id="login-name" placeholder="输入新登录名"></b-form-input>
            </td>
          </tr>
        </table>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "account",
  components: {
    getCode: function(resolve) {
      require(["@/components/get-code"], resolve);
    }
  },
  data() {
    return {
      error: null,
      loginname: null,
      mobile: null,
      code: null,
      codetype: "7"
    };
  },
  methods: {
    reset() {
      // console.log(123);
      // this.loginname = null;
      // this.mobile = null;
      // this.code = null;
    },
    commit(ev) {
      // console.log(ev);
      this.error = null;
      ev.preventDefault();

      const id = ev.target.id;
      // console.log(id);
      if (id === "loginNameModal") {
        // 修改登录名
        if (!this.loginname) {
          this.error = "登录名不能为空";
          return;
        }

        if (this.loginname === this.$store.state.supinfo.loginname) {
          this.error = "新登录名不能与原登录名一致";
          return;
        }

        const loginname = this.loginname;

        this.$post(
          {
            action: "updateaccountinfo",
            p1: this.$store.state.supinfo.accountid,
            p2: this.$store.state.token,
            p3: "1",
            p4: loginname,
            p5: ""
          },
          res => {
            if (res.code === "0") {
              this.$store.commit("updateloginname", loginname);
              this.$refs.loginModal.hide();

              this.loginname = null;
              this.mobile = null;
              this.code = null;
            } else {
              this.error = res.codemsg;
            }
          }
        );
      } else if (id === "mobileModal") {
        const mobile = this.mobile;

        if (!this.mobile) {
          this.error = "手机号不能为空";
          return;
        }

        if (this.mobile === this.$store.state.supinfo.telephone) {
          this.error = "新手机号不能与原手机号一致";
          return;
        }

        // 验证码
        if (!this.code) {
          this.error = "验证码不能为空";
          return;
        }

        this.$post(
          {
            action: "updateaccountinfo",
            p1: this.$store.state.supinfo.accountid,
            p2: this.$store.state.token,
            p3: "2",
            p4: this.mobile,
            p5: "",
            p6: this.code,
            p7: this.codetype
          },
          res => {
            if (res.code === "0") {
              this.$store.commit("updatemobile", mobile);
              this.$refs.mobileModal.hide();

              this.loginname = null;
              this.mobile = null;
              this.code = null;
            } else {
              this.error = res.codemsg;
            }
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.account {
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

  .info-wrap {
    display: flex;
    padding: 15px;
    font-size: 14px;
    color: #333;
    .icon-wrap {
      flex: 0 0 60px;
      width: 60px;
      .fa-icon {
        color: #999;
      }
    }
    .button-wrap {
      flex: 0 0 80px;
      width: 80px;
      text-align: right;
      padding-top: 20px;
    }
    .info {
      flex: 1;
      .success-text {
        color: #e46623;
        font-size: 14px;
        line-height: 14px;
        vertical-align: middle;
        display: inline-block;
        margin-bottom: 10px;
        .fa-icon {
          vertical-align: -2px;
          margin-right: 5px;
        }
      }
    }

    .label {
      font-size: 14px;
      color: #999;
      line-height: 14px;
      vertical-align: middle;
    }
  }

  .fields-wrap {
    padding: 15px;
    .table {
      font-size: 14px;
      margin: 0;
      padding: 0;
      td {
        border-top: 0;
        vertical-align: middle;
        // label {
        //   font-size: 14px;
        //   line-height: 14px;
        //   vertical-align: middle;
        //   color: #333;
        // }
      }

      .label {
        width: 80px;
        label {
          vertical-align: middle;
          line-height: 14px;
          /* padding: 0; */
          margin: 0;
          color: #333;
        }
      }

      .input-control {
        vertical-align: middle;
      }

      .get-code {
        background: $theme-color;
        height: 36px;
        line-height: 36px;
        display: block;
        font-size: 14px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        user-select: none;
      }

      // .form-control {
      //   font-size: 14px;
      // }

      .form-control {
        font-size: 14px;
        // margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
      }
    }
  }
}
</style>

