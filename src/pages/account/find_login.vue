<template>
  <div class="find-login">
    <div class="form-box">
      <h2 class="title">找回账号</h2>
      <div class="error-box" v-if="!!error">{{error}}</div>
      <div class="form-controls" v-if="step === 2">
        <b-form-input v-model="company.name" type="text" readonly></b-form-input>
        <b-form-input v-model="loginname" type="text" placeholder="输入新登录名"></b-form-input>
        <b-form-input v-model="mobile" type="tel" placeholder="输入新手机号"></b-form-input>
        <!-- <div class="code-control-wrap">
          <div class="code-control">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </div>
          <div class="get-code-btn">
            <get-code :mobile="mobile" :type="codetype"/>
          </div>
        </div>-->
        <div class="file-wrap">
          <span class="name">营业执照图片</span>
          <!-- <span class="upload-btn"> -->
          <!-- </span> -->
          <div class="upload-control-wrap">
            <upload-control @fileuploaded="fileUpload1"></upload-control>
          </div>
        </div>
        <div class="file-wrap">
          <span class="name">授权文件附件</span>
          <div class="upload-control-wrap">
            <upload-control
              upload_desc="下载下方模板文件，填完盖章，并上传该word附件"
              :tpl-file="tplfile"
              @fileuploaded="fileUpload2"
            ></upload-control>
          </div>
        </div>
        <b-row>
          <b-col cols="6">
            <span class="reg-btn outline" @click="prevClick">上一步</span>
          </b-col>
          <b-col cols="6">
            <span class="reg-btn outline" @click="save">下一步</span>
          </b-col>
        </b-row>
      </div>
      <div class="form-controls" v-if="step === 1">
        <b-form-input v-model="companyName" type="text" placeholder="公司名字"></b-form-input>
        <b-form-input v-model="license" type="text" placeholder="统一社会信用代码"></b-form-input>
        <span class="reg-btn search" @click="search">搜&emsp;索</span>
        <!-- <div class="error-box" v-if="!!error">{{error}}</div> -->
        <div class="search-results">
          <ul>
            <li
              @click="selectCompany(comp);"
              class="company"
              v-for="(comp,index) in companies"
              :key="index"
            >{{comp.name}}</li>
          </ul>
        </div>
      </div>
      <div class="result-wrap form-controls" v-if="step === 4">
        <div class="result">
          <v-icon name="check"></v-icon>&nbsp;您的账号找回申请提交成功，等待审核中，请注意查收手机短信结果通知
        </div>
        <span class="reg-btn" @click="goHome">回首页</span>
      </div>
      <div class="form-controls" v-if="step === 3">
        <b-form-input v-model="company.name" type="text" readonly></b-form-input>
        <b-form-input v-model="loginname" type="text" readonly></b-form-input>
        <b-form-input v-model="mobile" type="tel" readonly></b-form-input>
        <div class="code-control-wrap">
          <div class="code-control">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </div>
          <div class="get-code-btn">
            <get-code :mobile="mobile" :type="codetype"/>
          </div>
        </div>

        <b-row>
          <b-col cols="6">
            <span class="reg-btn outline" @click="prevClick">上一步</span>
          </b-col>
          <b-col cols="6">
            <span class="reg-btn" @click="save">提&emsp;交</span>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "find-login",
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
      step: 1,
      error: null,
      mobile: null,
      code: null,
      codetype: "3",
      companyName: null,
      company: null,
      license: null,
      loginname: null,
      companies: [],
      combi: null,
      authfile: null,
      tplfile: {
        name: "授权模板文件下载",
        url:
          "http://erp20-app.heneng.cn:16681/file/erp20-annex.heneng.cn/H_WF_INST_M/2019-01-08/1246140/合能集团采购平台第一联系人授权函(1).docx"
      }
    };
  },
  methods: {
    goHome() {
      this.$router.replace({ path: "/" });
    },
    fileUpload1(val) {
      // console.log(val);
      this.combi = val;
    },
    fileUpload2(val) {
      // console.log(val);
      this.authfile = val;
    },
    save() {
      this.error = null;

      if (!this.loginname || this.loginname.length === 0) {
        this.error = "新登录名不能为空";
        return;
      }

      if (!this.mobile || this.mobile.length === 0) {
        this.error = "新手机号不能为空";
        return;
      }

      if (!this.combi || this.combi.length === 0) {
        this.error = "营业执照不能为空";
        return;
      }

      if (!this.authfile || this.authfile.length === 0) {
        this.error = "授权文件不能为空";
        return;
      }

      if (this.step === 2) {
        this.$post(
          {
            action: "check_login_and_phone",
            loginname: this.loginname || "",
            mobile: this.mobile || "",
            type: "3"
          },
          res => {
            // console.log(res);
            if (res.code === "0") {
              this.step = 3;
              this.error = null;
            } else {
              this.error = res.codemsg;
            }
          }
        );
      } else if (this.step === 3) {
        // 提交修改
        this.commit();
      }
    },
    commit() {
      this.$post(
        {
          action: "findlogincommit",
          p1: this.company.supid,
          p2: this.loginname,
          p3: this.company.name,
          p4: this.mobile,
          p5: this.combi,
          p6: this.authfile,
          p7: this.code,
          p8: this.codetype
        },
        res => {
          if (res.code === "0") {
            this.step = 4;
            this.error = null;
          } else {
            this.error = res.codemsg;
          }
        }
      );
    },
    prevClick() {
      if (this.step !== 4 && this.step > 1) {
        this.step--;
      }

      this.error = null;
    },
    selectCompany(company) {
      this.company = company;
      //   this.currentCompanyName = company.name;
      this.step = 2;
    },
    search() {
      this.$post(
        {
          action: "P_SUP_FA_FindSup",
          p1: this.companyName,
          p2: this.license,
          p3: ""
        },
        res => {
          // console.log(res);
          if (res.code == "0") {
            let arr = res.data;
            let temp = [];
            arr.forEach(e => {
              temp.push({
                name: e.supname,
                id: e.credit_no,
                supid: e.erpsupid
              });
            });
            this.companies = temp;
            this.error =
              this.companies.length === 0 ? "未找到供应商数据" : null;
          } else {
            // alert(res.codemsg);
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
  padding: 30px 60px 30px !important;
  text-align: center;
  color: rgb(96, 160, 75);
  .result {
    margin-bottom: 50px;
  }
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

// .error-box {
//   text-align: center;
//   color: #333;
//   padding: 0 30px 30px;
// }

.find-login {
  .form-box {
    background: #fff;
    width: 400px;
    margin: 0 auto;
    box-shadow: 0 0 1px #e6e6e6;
    .row {
      //   margin-top: 10px;
      .col-6 {
        // padding: 0;
        margin: 0;
      }
    }
    .title {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 20px;
      color: #333;
    }
    .form-controls {
      padding: 20px;

      .form-control {
        margin-bottom: 15px;
        border-radius: 0;
        border-color: #f2f2f2;
      }

      .file-wrap {
        display: flex;
        font-size: 14px;
        margin-bottom: 10px;
        // .name,
        // .download-link {
        //   display: block;
        //   height: 40px;
        //   line-height: 40px;
        // }

        .name {
          flex: 0 0 100px;
          width: 100px;
          display: block;
          height: 40px;
          line-height: 40px;
        }

        .upload-control-wrap {
          flex: 1;
          // width: calc(100% - 150px);
        }
        // .input-file-box {
        //   flex: 0 0 80px;
        //   width: 80px;
        //   border: 1px solid #333;
        //   text-align: center;
        //   border-radius: 6px;
        //   cursor: pointer;
        // }
        // .download-link {
        //   flex: 1;
        //   //   display: block;
        //   margin-left: 15px;
        //   color: $theme-color;
        //   text-decoration: underline;
        //   cursor: pointer;
        // }
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
        &.outline {
          border: 1px solid $theme-color;
          background: #fff;
          color: $theme-color;
        }
        &.search {
          margin: 20px 0;
        }
      }

      // .get-code {
      //   background: $theme-color;
      //   height: 36px;
      //   line-height: 36px;
      //   display: block;
      //   font-size: 14px;
      //   text-align: center;
      //   color: #fff;
      // }
    }
  }

  .search-results {
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      padding: 0 5px;
      li {
        font-size: 14px;
        cursor: pointer;
        color: #333;
        padding: 10px 0;
        border-bottom: 1px dashed #eee;
        &:first-child {
          border-top: 1px dashed #eee;
        }

        &:hover {
          color: $theme-color;
        }
      }
    }
  }
}
</style>

