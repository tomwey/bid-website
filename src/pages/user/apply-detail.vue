<template>
  <div class="project container" v-loading="loading">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/applying-bids' }">我的报名</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
      <h2 class="title">{{applyData.noticetitle}}</h2>
      <div class="summary">
        <span class="date">发布日期: {{applyData.publishdate}}</span>&emsp;
        <span class="company">招标单位: {{applyData.tenderingunitname}}</span>&emsp;
        <span class="view-count">浏览次数: {{applyData.scannum}}</span>
      </div>
      <!-- <div class="apply-wrapper">
        <p class="end-date-tip">
          距离报名截止日期还剩
          <span class="countdown">15天12小时32分20秒</span>
        </p>
      </div>-->
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
        <el-button type="danger" @click="abandon" :disabled="applyData.isgiveup == '1'">放弃</el-button>&emsp;
        <el-button type="primary" @click="apply" :disabled="applyData.statenum != '50'">再次报名</el-button>
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
      title="再次报名"
      :visible.sync="applyFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.applyForm.$refs.form && $refs.applyForm.$refs.form.resetFields()"
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
  name: "apply-detail",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      applyFormVisible: false,
      dialogFormVisible: false,
      loading: false,
      stateOptions: [],
      applyControls2: [
        {
          field: "reason",
          type: 2,
          label: "放弃原因",
          options: [],
          rules: [
            { required: true, message: "放弃原因不能为空", trigger: "change" }
          ]
        },
        {
          field: "file",
          type: 8,
          label: "放弃函件",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_GiveUp",
          fieldname: "giveupannex"
          // subtype: "textarea"
        },
        {
          field: "memo",
          type: 1,
          label: "备注信息",
          subtype: "textarea"
        }
      ],
      applyControls: [
        {
          id: "agency-file",
          type: 8,
          // subtype: "number",
          label: "委托书附件",
          field: "agencyfiles",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_SIgnUP",
          fieldname: "signupannex",
          // unit: "万",
          rules: [
            { required: true, message: "委托书附件不能为空", trigger: "blur" }
          ]
        },
        {
          id: "other-file",
          label: "其它附件",
          field: "otherfile",
          // required: true,
          type: 8,
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_SIgnUP",
          fieldname: "otherannex",
          limit: 5
        }
      ],
      applyFormModel: {},
      applyData: {},
      tableData: []
    };
  },
  mounted() {
    this.loadApplyDetail();
    this.loadStateOptions();
  },
  methods: {
    loadStateOptions() {
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "14"
        },
        res => {
          // console.log(res);
          if (res.code == "0") {
            let arr = res.data || [];
            let temp = [];
            arr.forEach(ele => {
              temp.push({ label: ele.sy_name, value: ele.sy_value });
            });
            this.stateOptions = temp;
          }
        }
      );
    },
    loadApplyDetail() {
      this.$post(
        {
          action: "P_SUP_Bid_GetSignUp_Detail",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.$route.params.id
        },
        res => {
          // console.log(res);
          if (res.code == 0) {
            const arr = res["data"];
            if (arr.length > 0) {
              this.applyData = arr[0];
              this.populateData();
            }
          }
        }
      );
    },
    back() {
      this.$router.push({ path: "/bid_notice" });
    },
    apply() {
      this.applyFormModel = {};
      this.applyFormVisible = true;
    },
    abandon() {
      this.applyFormModel = {};
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
        }
      );
      this.dialogFormVisible = true;
    },
    populateData() {
      // console.log(121);
      let temp = [];
      temp.push({
        label: "招标事项",
        value: this.applyData.noticetitle
      });

      let item1 = {
        label: "委托附件",
        value: this.applyData.signupannex,
        type: 12
      };

      temp.push(item1);

      let item2 = {
        label: "其它附件",
        value: this.applyData.otherannex,
        type: 12
      };

      temp.push(item2);

      temp.push({
        label: "审核状态",
        value: this.applyData.statenumname
      });

      temp.push({
        label: "审核说明",
        value: this.applyData.explain,
        type: 5
      });

      temp.push({
        label: "退回原因",
        value: this.applyData.reason,
        type: 5
      });

      this.loadAnnexes(item1);
      this.loadAnnexes(item2);

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
    commit2() {
      // console.log(123);
      this.$refs.dialogForm.validateFields(flag => {
        // console.log(flag);
        if (flag) {
          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_GiveUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.applyData.noticeid || "",
              p4: this.applyData.purchasematterid || "",
              p5: "",
              p6: "2",
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
                this.loadApplyDetail();
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
      this.$refs.applyForm.validateFields(flag => {
        if (flag) {
          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_SignUp_Add",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.applyData.signupid || "",
              p4: this.applyFormModel["otherfile"] || "",
              p5: this.applyFormModel["agencyfiles"] || ""
            },
            res => {
              this.loading = false;

              if (res.code == 0) {
                this.applyFormVisible = false;
                this.$message({
                  type: "success",
                  message: "补充资料录入成功"
                });
                this.loadApplyDetail();
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


