<template>
  <div class="project container">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/bid_notice' }">招标公告列表</el-breadcrumb-item>
        <el-breadcrumb-item>公告详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
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
            <td class="label">
              <div class="label-box">{{item.label}}</div>
            </td>
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
        >立即报名</el-button>&emsp;
        <el-button type="danger" size="small" @click="abandon" :disabled="notice.isgiveup == '1'">放弃</el-button>
      </div>
    </div>

    <el-dialog
      title="放弃报名"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.dialogForm.$refs.form && $refs.dialogForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="dialogForm"
        :controls="applyControls2"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit2">提 交</el-button>
      </div>
    </el-dialog>

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
      applyControls2: [],
      // applyFormModel: {},
      dialogFormVisible: false,
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
    abandon() {
      this.applyFormModel = {};

      this.$post(
        {
          action: "P_SUP_Bid_GiveUp_GetMatterList",
          p1: this.notice.purchasematterid || "0",
          p2: this.$store.state.supinfo.accountid || ""
        },
        res => {
          // console.log(res);
          if (res.code == "0") {
            let arr = res.data;
            let temp = [];
            let index = 0;
            arr.forEach(ele => {
              temp.push({
                label: ele.mattersubname || ele.mattername,
                value: index++
              });
            });

            this.abandonMatters = arr;

            if (temp.length > 0) {
              this.applyControls2 = [
                {
                  field: "reason",
                  type: 2,
                  label: "放弃原因",
                  options: [],
                  rules: [
                    {
                      required: true,
                      message: "放弃原因不能为空",
                      trigger: "change"
                    }
                  ]
                },
                {
                  id: "matterindexes",
                  type: 3,
                  label: "投标事项",
                  field: "matterindexes",
                  options: temp,
                  rules: [
                    {
                      required: true,
                      message: "投标事项不能为空",
                      trigger: "change"
                    }
                  ]
                },
                {
                  field: "file",
                  type: 8,
                  label: "放弃函件",
                  domanid: this.$store.state.supinfo.accountid || "0",
                  tablename: "H_SUP_Bid_GiveUp",
                  fieldname: "giveupannex",
                  rules: [
                    {
                      required: true,
                      message: "放弃函件不能为空",
                      trigger: "change"
                    }
                  ]
                  // subtype: "textarea"
                },
                {
                  field: "memo",
                  type: 1,
                  label: "备注信息",
                  subtype: "textarea"
                }
              ];

              if (temp.length === 1) {
                this.applyFormModel = { matterindexes: 0 };
              } else {
                this.applyFormModel = {};
              }
            } else {
              this.applyControls2 = [
                {
                  field: "reason",
                  type: 2,
                  label: "放弃原因",
                  options: [],
                  rules: [
                    {
                      required: true,
                      message: "放弃原因不能为空",
                      trigger: "change"
                    }
                  ]
                },

                {
                  field: "file",
                  type: 8,
                  label: "放弃函件",
                  domanid: this.$store.state.supinfo.accountid || "0",
                  tablename: "H_SUP_Bid_GiveUp",
                  fieldname: "giveupannex",
                  rules: [
                    {
                      required: true,
                      message: "放弃函件不能为空",
                      trigger: "change"
                    }
                  ]
                  // subtype: "textarea"
                },
                {
                  field: "memo",
                  type: 1,
                  label: "备注信息",
                  subtype: "textarea"
                }
              ];
            }
          }

          this.$post(
            {
              action: "P_SY_GetParamInfo",
              p1: "10"
            },
            res => {
              if (res.code == 0) {
                let arr = res.data;
                let temp = [];
                if (Array.isArray(arr)) {
                  arr.forEach(ele => {
                    temp.push({ label: ele.sy_name, value: ele.sy_value });
                  });
                }
                this.applyControls2[0].options = temp;
              }

              this.abandonLoading = false;
            }
          );
        }
      );

      // this.$post(
      //   {
      //     action: "P_SY_GetParamInfo",
      //     p1: "10"
      //   },
      //   res => {
      //     if (res.code == 0) {
      //       let arr = res.data;
      //       let temp = [];
      //       if (Array.isArray(arr)) {
      //         arr.forEach(ele => {
      //           temp.push({ label: ele.sy_name, value: ele.sy_value });
      //         });
      //       }
      //       this.applyControls2[0].options = temp;
      //     }
      //   }
      // );
      this.dialogFormVisible = true;
    },
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
        value: (this.notice.noticeexplain || "").replace(
          "TABLE-LAYOUT: fixed;",
          ""
        )
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
      this.$router.push({ path: "/bid_notice" });
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
    commit2() {
      // console.log(123);
      this.$refs.dialogForm.validateFields(flag => {
        // console.log(flag);
        if (flag) {
          let index = parseInt(this.applyFormModel["matterindexes"]);
          // console.log(this.applyFormModel);
          let item = null;
          if (index >= 0 && index < this.abandonMatters.length) {
            item = this.abandonMatters[index];
          }

          if (!item) {
            this.$message({
              type: "error",
              message: "未选择弃标事项"
            });
            return;
          }

          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_GiveUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.notice.noticeid || "",
              p4: item.purchasematterid || "",
              p5: item.purchasemattersubid || "",
              p6: item.stageid || "",
              // p4: this.applyData.purchasematterid || "",
              // p5: "",
              // p6: "2",
              p7: this.applyFormModel["reason"] || "",
              p8: this.applyFormModel["file"] || "",
              p9: this.applyFormModel["memo"] || ""
            },
            res => {
              this.loading = false;

              if (res.code == "0") {
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
                // this.loadApplyingBids();
                this.loadData();
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
              p5: arr[0],
              p6: arr[1]
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
                this.$router.push({ path: "/admin/applying-bids" });
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
  padding-top: 80px;
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
    }

    .other-info {
      padding: 0 30px;
      margin-top: 30px;
      width: 100%;
      .table {
        width: 100%;
        font-size: 14px !important;
        color: #333 !important;
        border: 1px solid #f2f2f2;
        tr,
        td {
          border: 1px solid #f2f2f2;
        }
        .label {
          color: #888;
          width: 180px;
          .label-box {
            width: 180px;
          }
        }
        .value {
          width: calc(100% - 180px);
          .content {
            width: 100%;
            overflow: auto;
          }

          .content table {
            table-layout: auto !important;
          }
          // width: 30% !important;
          img {
            max-width: 100%;
          }
          p {
            font-size: 14px !important;
          }
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


