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
                <br>test1
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
                <br>130****4567
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
      @cancel="reset"
      @hide="reset"
    >
      <div class="fields-wrap">
        <table class="table">
          <tr>
            <td class="label">
              <label>原手机号</label>
            </td>
            <td class="input-control">133****3456</td>
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
              <b-row>
                <b-col cols="8">
                  <b-form-input v-model="code" id="code" type="tel" placeholder="输入验证码"></b-form-input>
                </b-col>
                <b-col cols="4">
                  <span class="get-code">获取验证码</span>
                </b-col>
              </b-row>
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
    >
      <div class="fields-wrap">
        <table class="table">
          <tr>
            <td class="label">
              <label>原登录号</label>
            </td>
            <td class="input-control">test1</td>
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
  data() {
    return {
      loginname: null,
      mobile: null,
      code: null
    };
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.account {
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

