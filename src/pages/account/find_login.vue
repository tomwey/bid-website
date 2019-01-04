<template>
  <div class="find-login">
    <div class="form-box">
      <h2 class="title">找回账号</h2>
      <div class="form-controls" v-if="step === 2">
        <b-form-input v-model="company.name" type="text" readonly></b-form-input>
        <b-form-input v-model="loginname" type="text" placeholder="输入新登录名"></b-form-input>
        <b-form-input v-model="mobile" type="tel" placeholder="输入新手机号"></b-form-input>
        <div class="code-control-wrap">
          <div class="code-control">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </div>
          <div class="get-code-btn">
            <get-code :mobile="mobile" :type="codetype"/>
          </div>
        </div>

        <div class="file-wrap">
          <span class="name">营业执照图片</span>
          <!-- <span class="upload-btn"> -->
          <!-- </span> -->
          <div class="upload-control-wrap">
            <upload-control @fileuploaded="fileUpload1"></upload-control>
          </div>
        </div>
        <div class="file-wrap">
          <span class="name">授权文件图片</span>
          <div class="upload-control-wrap">
            <upload-control :tpl-file="tplfile" @fileuploaded="fileUpload2"></upload-control>
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
      <div class="form-controls" v-if="step === 1">
        <b-form-input v-model="companyName" type="text" placeholder="公司名字"></b-form-input>
        <b-form-input v-model="license" type="text" placeholder="统一社会信用代码"></b-form-input>
        <span class="reg-btn search" @click="search">搜&emsp;索</span>
        <div class="error-box" v-if="!!error">{{error}}</div>
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

      <div class="error-box" v-if="!!error">{{error}}</div>
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
        url: "http://www.baidu.com"
      }
    };
  },
  methods: {
    fileUpload1(val) {
      // console.log(val);
      this.combi = val;
    },
    fileUpload2(val) {
      console.log(val);
      this.authfile = val;
    },
    save() {
      // if (!this.loginname) {
      //   this.error = "登录名不能为空";
      //   return;
      // }

      // if (!this.mobile) {
      //   this.error = "手机不能为空";
      //   return;
      // }

      // if (!this.code) {
      //   this.error = "验证码不能为空";
      //   return;
      // }

      // if (!this.combi) {
      //   this.error = "营业执照不能为空";
      //   return;
      // }

      // if (!this.authfile) {
      //   this.error = "营业执照不能为空";
      //   return;
      // }

      // console.log(this.company);

      // @SupID bigint,
      // @LoginName VARCHAR(50),
      // @SupName VARCHAR(100),
      // @TelePhone VARCHAR(50),
      // @ComBIAnnex bigint,
      // @AuthFileAnnex bigint

      this.error = null;

      this.$post(
        {
          action: "verifysms",
          p1: this.mobile,
          p2: this.code,
          p3: this.codetype
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            this.commit();
          } else {
            this.error = res.codemsg;
          }
        }
      );
    },
    commit() {
      this.$post(
        {
          action: "P_SUP_FA_Submit",
          p1: this.company.supid,
          p2: this.loginname,
          p3: this.company.name,
          p4: this.mobile,
          p5: this.combi,
          p6: this.authfile
        },
        res => {
          if (res.code === "0") {
          } else {
            this.error = res.codemsg;
          }
        }
      );
    },
    prevClick() {
      this.step = 1;
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

.error-box {
  text-align: center;
  color: #333;
  padding: 0 30px 30px;
}

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

      .get-code {
        background: $theme-color;
        height: 36px;
        line-height: 36px;
        display: block;
        font-size: 14px;
        text-align: center;
        color: #fff;
      }
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

