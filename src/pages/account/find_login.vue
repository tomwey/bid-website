<template>
  <div class="find-login">
    <div class="form-box">
      <h2 class="title">找回账号</h2>
      <div class="form-controls" v-if="step === 2">
        <b-form-input v-model="company.name" type="text" readonly></b-form-input>
        <b-form-input v-model="loginname" type="text" placeholder="输入新登录名"></b-form-input>
        <b-form-input v-model="mobile" type="tel" placeholder="输入新手机号"></b-form-input>
        <b-row>
          <b-col cols="8">
            <b-form-input v-model="code" type="tel" placeholder="验证码"></b-form-input>
          </b-col>
          <b-col cols="4">
            <span class="get-code">获取验证码</span>
          </b-col>
        </b-row>

        <div class="file-wrap">
          <span class="name">营业执照图片</span>
          <span class="upload-btn">上传图片</span>
        </div>
        <div class="file-wrap">
          <span class="name">授权文件图片</span>
          <span class="upload-btn">上传图片</span>
          <span class="download-link">授权文件模板下载</span>
        </div>
        <!-- <b-row>
          <b-col cols="5">营业执照图片</b-col>
          <b-col cols="7">
            <b-form-file v-model="file" placeholder="选择文件"></b-form-file>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="5">授权文件</b-col>
          <b-col cols="7">
            <b-form-file v-model="file" placeholder="选择文件"></b-form-file>
          </b-col>
        </b-row>-->
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
    </div>
  </div>
</template>
<script>
export default {
  name: "find-login",
  data() {
    return {
      step: 1,
      mobile: null,
      code: null,
      companyName: null,
      //   currentCompanyName: null,
      company: null,
      license: null,
      loginname: null,
      companies: []
    };
  },
  methods: {
    save() {},
    prevClick() {
      this.step = 1;
    },
    selectCompany(company) {
      this.company = company;
      //   this.currentCompanyName = company.name;
      this.step = 2;
    },
    search() {
      //   this.step = 2;
      this.companies = [
        {
          name: "成都建工集团有限公司"
        },
        {
          name: "成都第八建筑有限公司"
        }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.find-login {
  .form-box {
    background: #fff;
    width: 360px;
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
        .name,
        .upload-btn,
        .download-link {
          display: block;
          height: 40px;
          line-height: 40px;
        }

        .name {
          flex: 0 0 100px;
          width: 100px;
        }
        .upload-btn {
          flex: 0 0 80px;
          width: 80px;
          border: 1px solid #333;
          text-align: center;
          border-radius: 6px;
          cursor: pointer;
        }
        .download-link {
          flex: 1;
          //   display: block;
          margin-left: 15px;
          color: $theme-color;
          text-decoration: underline;
          cursor: pointer;
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

