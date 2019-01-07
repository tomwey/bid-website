<template>
  <div class="bind-mobile">
    <div class="box">
      <h2>重新绑定手机</h2>
      <div class="error-box" v-if="!!error">{{error}}</div>
      <div class="result-wrap" v-if="commitSuccess">
        <div class="result">
          <v-icon name="check"></v-icon>&nbsp;您的手机更换申请提交成功，等待审核中，请注意查收手机短信结果通知
        </div>
      </div>
      <div class="form-wrap" v-if="!commitSuccess">
        <b-row>
          <b-col sm="3">
            <label for="change-type">找回方式</label>
          </b-col>
          <b-col sm="9">
            <b-form-radio-group
              id="change-type"
              v-model="type"
              :options="options"
              name="radioOpenions"
            ></b-form-radio-group>
          </b-col>
        </b-row>
        <div v-if="type === '1'">
          <b-row>
            <b-col sm="3">
              <label for="new-mobile">
                <span class="required"></span>新手机号
              </label>
            </b-col>
            <b-col sm="9">
              <b-form-input id="new-mobile" v-model="new_mobile" type="tel" placeholder="输入新手机号"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label for="code2">
                <span class="required"></span>手机验证码
              </label>
            </b-col>
            <b-col sm="9">
              <div class="code-control-wrap">
                <div class="code-control">
                  <b-form-input v-model="code2" type="tel" placeholder="验证码"></b-form-input>
                </div>
                <div class="get-code-btn">
                  <get-code :mobile="new_mobile" :type="codetype"/>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label>营业执照图片</label>
            </b-col>
            <b-col sm="9">
              <div class="file-wrap">
                <div class="upload-control-wrap">
                  <upload-control @fileuploaded="fileUpload1"></upload-control>
                </div>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="3">
              <label>授权文件附件</label>
            </b-col>
            <b-col sm="9">
              <div class="file-wrap">
                <div class="upload-control-wrap">
                  <upload-control :tpl-file="tplfile" @fileuploaded="fileUpload2"></upload-control>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
        <div v-if="type === '0'">
          <b-row>
            <b-col sm="3">
              <label for="old-mobile">原手机号</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="old-mobile"
                readonly
                v-model="old_mobile"
                type="tel"
                placeholder="输入原手机号"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label for="code1">
                <span class="required"></span>手机验证码
              </label>
            </b-col>
            <b-col sm="9">
              <div class="code-control-wrap">
                <div class="code-control">
                  <b-form-input v-model="code1" type="tel" placeholder="验证码"></b-form-input>
                </div>
                <div class="get-code-btn">
                  <get-code :mobile="old_mobile" :type="codetype"/>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label for="new-mobile">
                <span class="required"></span>新手机号
              </label>
            </b-col>
            <b-col sm="9">
              <b-form-input id="new-mobile" v-model="new_mobile" type="tel" placeholder="输入新手机号"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label for="code2">
                <span class="required"></span>手机验证码
              </label>
            </b-col>
            <b-col sm="9">
              <div class="code-control-wrap">
                <div class="code-control">
                  <b-form-input v-model="code2" type="tel" placeholder="验证码"></b-form-input>
                </div>
                <div class="get-code-btn">
                  <get-code :mobile="new_mobile" :type="codetype"/>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
        <div class="buttons">
          <b-row>
            <b-col sm="9" offset="3">
              <span class="reg-btn" @click="commit">提&emsp;交</span>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bind-mobile",
  components: {
    getCode: function(resolve) {
      require(["@/components/get-code"], resolve);
    },
    uploadControl: function(resolve) {
      require(["@/components/upload-control"], resolve);
    }
  },
  data() {
    return {
      error: null,
      commitSuccess: false,
      type: "0",
      options: [
        {
          value: "0",
          text: "通过原手机号找回"
        },
        {
          value: "1",
          text: "通过申请找回"
        }
      ],
      old_mobile: this.$store.state.supinfo.telephone,
      new_mobile: null,
      code1: null,
      code2: null,
      codetype: "9",
      combi: null,
      authfile: null,
      tplfile: {
        name: "授权模板文件下载",
        url: "http://www.baidu.com"
      }
    };
  },
  mounted() {
    console.log(this.$store.state.token);
  },
  methods: {
    fileUpload1(val) {
      // console.log(val);
      this.combi = val;
    },
    fileUpload2(val) {
      // console.log(val);
      this.authfile = val;
    },
    commit() {
      this.error = null;
      this.commitSuccess = false;

      this.$post(
        {
          action: "bindmobile",
          uid: this.$store.state.supinfo.accountid,
          token: this.$store.state.token,
          type: this.type,
          codetype: this.codetype,
          old_mobile: this.old_mobile || "",
          new_mobile: this.new_mobile || "",
          code1: this.code1 || "",
          code2: this.code2 || "",
          combi: this.combi || "",
          authfile: this.authfile || ""
        },
        res => {
          if (res.code === "0") {
            this.error = null;
            if (this.type === "0") {
              this.$store.commit("updatemobile", this.new_mobile);
              this.$router.replace({ path: "/admin/accounts" });
            } else {
              this.commitSuccess = true;
            }
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
.result-wrap {
  padding: 60px 120px 60px !important;
  text-align: center;
  color: rgb(96, 160, 75);
  .result {
    margin-bottom: 50px;
  }
}

.form-wrap {
  //   text-align: center;
  width: 70%;
  margin: 0 auto;
  padding: 30px;

  font-size: 14px !important;

  .row {
    margin-bottom: 15px;
  }

  .upload-control {
    padding-left: 0;
  }

  .reg-btn {
    display: block;
    width: 168px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    font-size: 16px;
    // font-weight: 700;
    background: $theme-color;
    cursor: pointer;
    user-select: none;
    margin-top: 30px;
  }

  label {
    font-size: 14px;
    color: #333;
    margin-top: 0.5rem;
    // padding-top: 5px;
    // vertical-align: -5px;
  }

  #change-type {
    padding-top: 5px;
  }

  .form-control {
    font-size: 14px;
    border-radius: 0;
    border-color: #eee;
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

  //   label {
  //     font-size: ;
  //   }
}
</style>


