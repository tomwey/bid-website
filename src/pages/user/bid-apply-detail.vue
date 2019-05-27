<template>
  <div class="project container">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/apply-notify' }">报名通知</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="detail abandon-wrap">
      <div class="abandon" v-if="notice.isgiveup == '1'">已放弃</div>
      <h2 class="title">{{notice.noticetitle}}</h2>
      <div class="summary">
        <span class="date">发布日期: {{notice.publishdate}}</span>&emsp;
        <span class="company">招标单位: {{notice.tenderingunitname}}</span>&emsp;
        <span class="view-count">浏览次数: {{notice.scannum}}</span>
      </div>
      <div class="apply-wrapper">
        <count-down
          prefix="距离报名截止还剩"
          :time="notice.delaysigndate || notice.signenddate"
          no-time-left="报名已截止"
          :key="notice.noticeid"
        ></count-down>
      </div>
      <div class="other-info">
        <table class="table">
          <tr v-for="(item,index) in tableData" :key="index">
            <td class="label">{{item.label}}</td>
            <td class="value">
              <div class="content" v-html="item.value" v-if="item.type !== 12"></div>
              <div class="file-list" v-if="item.type === 12">
                <a
                  v-for="file in item.fileList"
                  target="_blank"
                  :href="file.url"
                  :key="file.url"
                  class="file-item"
                >{{file.name}}</a>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="buttons">
        <el-button plain @click="back">返回</el-button>&emsp;
        <el-button
          type="primary"
          @click="apply"
          :disabled="notice.isoverdue == '1' || notice.issignup == '1'|| notice.isgiveup == '1'"
        >立即报名</el-button>
      </div>
    </div>
    <el-dialog
      title="报名"
      :visible.sync="applyFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      v-loading="loading"
    >
      <form-fields
        form-ref="form"
        ref="applyForm"
        :controls="applyControls"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "notice-detail",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    },
    countDown: resolve => {
      require(["@/components/count-down"], resolve);
    }
  },
  data() {
    return {
      applyFormVisible: false,
      loading: false,
      notice: {},
      applyControls: [
        {
          id: "agency-file",
          type: 8,
          // subtype: "number",
          label: "委托书附件",
          field: "signupannex",
          // unit: "万",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_SIgnUP",
          fieldname: "signupannex",
          rules: [
            { required: true, message: "委托书附件不能为空", trigger: "blur" }
          ]
        },
        {
          id: "other-file",
          label: "其它附件",
          field: "otherannex",
          // required: true,
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_SIgnUP",
          fieldname: "otherannex",
          type: 8,
          limit: 5
        }
      ],
      applyFormModel: {},
      tableData: []
    };
  },
  mounted() {
    // console.log(this.$route.params);
    this.loadData();
  },
  methods: {
    loadData() {
      const id = this.$route.params.id;
      const arr = id.split("-");
      if (arr.length !== 2) {
        this.$message({
          type: "error",
          message: "不正确的参数"
        });
        return;
      }

      this.$post(
        {
          action: "P_SUP_Bid_GetNoticeDetail",
          p1: (this.$store.state.supinfo || {}).accountid || "",
          p2: this.$store.state.token || "",
          p3: arr[0],
          p4: arr[1]
        },
        res => {
          // console.log(res);
          if (res.code == 0) {
            const arr = res["data"];
            if (arr.length > 0) {
              this.notice = arr[0];
              this.populateData();
            }
          }
        }
      );
    },
    populateData() {
      let temp = [];
      temp.push({
        label: "招标事项",
        value: this.notice.noticetitle
      });

      temp.push({
        label: "招标法人主体",
        value: this.notice.tenderingunitname
      });

      temp.push({
        label: "招标基本条件要求",
        value: this.notice.condition,
        type: 5
      });

      temp.push({
        label: "公告说明",
        value: this.notice.noticeexplain
      });

      temp.push({
        label: "报名截止时间",
        value: this.notice.delaysigndate || this.notice.signenddate
      });

      let item = {
        label: "招标公告附件",
        value: this.notice.noticeannexs,
        type: 12
      };

      temp.push(item);

      this.loadAnnexes(item);

      this.tableData = temp;
    },
    loadAnnexes(item) {
      if (!item || !item.value || item.value == 0) return;
      this.$post(
        {
          action: "P_SY_GetAnnex",
          p1: item.value
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];
            arr.forEach(file => {
              // console.log(file);
              let fileName = file.filename || "";
              temp.push({
                name: file.filename,
                url: file.url,
                annexid: file.annexid,
                isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              });
            });
            this.$set(item, "fileList", temp);
          }
        }
      );
    },
    back() {
      this.$router.push({ path: "/admin/apply-notify" });
    },
    apply() {
      if (!this.$store.state.token) {
        this.$message({
          type: "warning",
          message: "您需要先登录，才能报名"
        });
        this.$router.push({ path: "/" });
        return;
      }
      this.applyFormVisible = true;
    },
    commit() {
      // console.log(this.applyForm);

      this.$refs.applyForm.validateFields(flag => {
        if (flag) {
          let id = this.$route.params.id;
          let arr = id.split("-");
          if (arr.length !== 2) {
            this.$message({
              type: "error",
              message: "不正确的参数"
            });
            return;
          }

          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_SignUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.applyFormModel["otherannex"] || "",
              p4: this.applyFormModel["signupannex"] || "",
              p5: this.notice.noticeid || "0", //arr[0],
              p6: this.notice.purchasematterid || "0"
            },
            res => {
              this.loading = false;
              if (res.code == "0") {
                this.notice.issignup = "1";
                this.applyFormVisible = false;
                this.$message({
                  type: "success",
                  message: "报名成功"
                });
                this.$router.push({ path: "/admin/apply-notify" });
              } else {
                this.$message({
                  type: "error",
                  message: res.codemsg
                });
              }
            }
          );
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.project {
  // padding-top: 80px;
  padding-bottom: 20px;
  .breadcrumb-wrapper {
    background: #fff;
    padding: 15px;
  }

  .detail {
    margin-top: 20px;
    padding: 30px 15px;
    background: #fff;
    min-height: 660px;
    .title {
      text-align: center;
      font-size: 24px;
      color: #333;
    }
    .summary {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #999;
      margin-bottom: 20px;
    }
    .apply-wrapper {
      text-align: center;
      .end-date-tip {
        font-size: 16px;
        text-align: center;
        color: #333;
        padding: 0 20px;
      }
      .countdown {
        color: rgb(231, 90, 22);
      }
    }

    .other-info {
      padding: 0 30px;
      margin-top: 30px;
      .table {
        width: 100%;
        font-size: 14px;
        color: #333;
        border: 1px solid #f2f2f2;
        tr,
        td {
          border: 1px solid #f2f2f2;
        }
        .label {
          color: #888;
          width: 180px;
        }
        // .value {
        .file-link {
          color: rgb(231, 90, 22) !important;
        }
        // }
      }
    }
    .buttons {
      text-align: center;
      margin-top: 60px;
    }
  }
}
.file-list {
  .file-item {
    display: block;
    // padding: 10px 0;
    font-size: 14px;
    color: rgb(231, 90, 22);
    // margin-bottom: 5px;
    padding: 5px 0;
    text-decoration: underline;
  }
}
</style>
<style lang="scss">
.abandon-wrap {
  position: relative;
  .abandon {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 120px;
    height: 120px;
    line-height: 120px;
    border-radius: 50%;
    border: 2px dashed rgb(208, 2, 27);
    text-align: center;
    font-size: 20px;
    transform: rotate(-30deg);
    color: rgb(208, 2, 27);
  }
}
</style>



