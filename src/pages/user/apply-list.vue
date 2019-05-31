<template>
  <div class="bid-list box" v-loading="loading">
    <h2 class="title">我的报名</h2>
    <div class="search-toolbar">
      <el-row>
        <el-col :span="8">
          <span class="label">截止时间:</span>
          <el-date-picker
            v-model="signupDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">
          <span class="label">状态:</span>
          <el-select v-model="state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="输入搜索内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="招标事项">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row)">{{scope.row.noticetitle}}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托附件" width="180" prop="signupannex">
          <template slot-scope="scope">
            <div class="file-list">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in scope.row.signupannex_list"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="其它附件" width="180">
          <template slot-scope="scope">
            <div class="file-list">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in scope.row.otherannex_list"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="signupdate" label="报名时间" width="100"></el-table-column>
        <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">
            <span
              class="state-tag"
              :class="{success:scope.row.statenumname == '已通过', info:scope.row.statenumname == '已放弃', warning:scope.row.statenumname == '审核中', danger:scope.row.statenumname == '审核未通过'}"
            >{{scope.row.statenumname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              @click="addInfo(scope.row)"
              :disabled="scope.row.statenum != '50'"
            >再次报名</el-button>&nbsp;
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.isgiveup == '1'"
              @click="abandon(scope.row);"
            >放弃</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container" v-if="totalSize >= pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :page-size="pageSize"
          :current-page="page"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="放弃报名"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.dialogForm.$refs.form && $refs.dialogForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="dialogForm"
        :controls="applyControls"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit" :loading="commiting">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="再次报名"
      key="addForm"
      :visible.sync="dialogFormVisible2"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      v-loading="commiting"
      @close="$refs.dialogForm2.$refs.form && $refs.dialogForm2.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="dialogForm2"
        :controls="applyControls2"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="commit2">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "apply-list",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      loading: false,
      currSignID: null,
      currApply: null,
      dialogFormVisible: false,
      signupDate: "",
      state: "",
      keyword: "",
      page: 1,
      pageSize: 20,
      totalSize: 0,
      previewImage: null,
      dialogPreviewVisible: false,
      abandonMatters: [],
      commiting: false,
      stateOptions: [],
      applyControls: [
        // {
        //   field: "reason",
        //   type: 2,
        //   label: "放弃原因",
        //   options: [],
        //   rules: [
        //     { required: true, message: "放弃原因不能为空", trigger: "change" }
        //   ]
        // },
        // {
        //   field: "file",
        //   type: 8,
        //   label: "放弃函件",
        //   domanid: this.$store.state.supinfo.accountid || "0",
        //   tablename: "H_SUP_Bid_GiveUp",
        //   fieldname: "giveupannex"
        //   // subtype: "textarea"
        // },
        // {
        //   field: "memo",
        //   type: 1,
        //   label: "备注信息",
        //   subtype: "textarea"
        // }
      ],
      applyFormModel: {},
      dialogFormVisible2: false,
      applyControls2: [
        {
          id: "agency-file",
          type: 8,
          // subtype: "number",
          label: "委托书附件",
          field: "signupannex",
          // unit: "万",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Bid_SignUp",
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
          tablename: "H_Sup_Bid_SignUp",
          fieldname: "otherannex",
          type: 8,
          limit: 5
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.loadApplyingBids();
    this.loadStateOptions();
  },
  watch: {
    signupDate() {
      this.search();
    },
    state() {
      this.search();
    }
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
    addInfo(item) {
      // this.currSignID = item.signupid;
      this.currApply = Object.assign({}, item);
      this.dialogFormVisible2 = true;
    },
    commit2() {
      // console.log(this.applyForm);

      // console.log(123);
      // p1: this.$store.state.supinfo.accountid || "",
      //         p2: this.$store.state.token || "",
      //         p3: this.applyFormModel2["otherannex"] || "",
      //         p4: this.applyFormModel2["signupannex"] || "",
      //         p5: this.currentApply.noticeid || "",
      //         p6: this.currentApply.purchasematterid || ""

      this.$refs.dialogForm2.validateFields(flag => {
        if (flag) {
          this.commiting = true;
          this.$post(
            {
              action: "P_SUP_Bid_SignUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              // p3: this.currSignID || "",
              p3: this.applyFormModel["otherannex"] || "",
              p4: this.applyFormModel["signupannex"] || "",
              p5: this.currApply.noticeid || "",
              p6: this.currApply.purchasematterid || ""
            },
            res => {
              this.commiting = false;
              // this.$refs.dialogForm2.$refs["form"] &&
              //   this.$refs.dialogForm2.$refs["form"].resetFields();

              if (res.code == 0) {
                this.dialogFormVisible2 = false;
                this.$message({
                  type: "success",
                  message: "报名成功"
                });
                this.loadApplyingBids();
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
    previewFile(file) {
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    loadApplyingBids() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetSignUp",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.signupDate || "",
          p4: this.state || "-1",
          p5: this.keyword || "",
          p6: this.page.toString(),
          p7: this.pageSize.toString()
        },
        res => {
          // console.log(res);
          this.loading = false;
          if (res.code == 0) {
            this.tableData = res["data"];
            if (this.tableData.length > 0) {
              this.totalSize = parseInt(this.tableData[0]["totalcount"]);
            }
            this.loadAnnexes();
          }
        }
      );
    },
    loadAnnexes() {
      this.tableData.forEach(item => {
        this.loadAnnex(item);
      });
    },
    loadAnnex(item) {
      if (item.signupannex && item.signupannex != "0") {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.signupannex
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
              this.$set(item, "signupannex_list", temp);
            }
          }
        );
      }
      if (item.signupannex && item.otherannex != "0") {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.otherannex
          },
          res => {
            // console.log(res);
            if (res.code === "0") {
              let arr = res.data;
              let temp = [];
              arr.forEach(file => {
                // console.log(file);
                let fileName = file.filename || "";
                if (fileName) {
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
                }
              });
              this.$set(item, "otherannex_list", temp);
            }
          }
        );
      }
    },
    pageChange(val) {
      this.page = val;
      this.loadApplyingBids();
    },
    search() {
      this.page = 1;
      this.loadApplyingBids();
    },
    selectItem(item) {
      this.$router.push({ path: "/admin/my-bids/" + item.signupid });
    },
    abandon(item) {
      this.currApply = Object.assign({}, item);
      this.applyFormModel = {};

      this.$post(
        {
          action: "P_SUP_Bid_GiveUp_GetMatterList",
          p1: item.purchasematterid || "0",
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
              this.applyControls = [
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
              this.applyControls = [
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
                this.applyControls[0].options = temp;
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
      //       this.applyControls[0].options = temp;
      //     }
      //   }
      // );
      // this.$post(
      //   {
      //     action: "P_SUP_Bid_GiveUp_GetMatterList",
      //     p1: item.purchasematterid || "0",
      //     p2: this.$store.state.supinfo.accountid || ""
      //   },
      //   res => {
      //     console.log(res);
      //   }
      // );
      this.dialogFormVisible = true;
    },
    commit() {
      this.$refs.dialogForm.validateFields(flag => {
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

          this.commiting = true;
          this.$post(
            {
              action: "P_SUP_Bid_GiveUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.currApply.noticeid || "",
              // p4: this.currApply.purchasematterid || "",
              // p5: "",
              // p6: "2",
              p4: item.purchasematterid || "",
              p5: item.purchasemattersubid || "",
              p6: item.stageid || "",
              p7: this.applyFormModel["reason"] || "",
              p8: this.applyFormModel["file"] || "",
              p9: this.applyFormModel["memo"] || ""
            },
            res => {
              this.commiting = false;
              // this.$refs.dialogForm.$refs["form"] &&
              //   this.$refs.dialogForm.$refs["form"].resetFields();

              if (res.code == "0") {
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
                this.loadApplyingBids();
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
.title {
  font-size: 16px;
  color: #333;
  padding: 15px 10px;
  border-bottom: 1px solid #f2f2f2;
}

.bid-list {
  background: #fff;
  .name {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      color: rgb(231, 90, 22);
    }
  }
}

.page-container {
  text-align: center;
  padding: 30px;
  background: #fff;
}

.search-toolbar {
  background: #fff;
  padding: 15px;
  margin: 15px 0;
  // border-bottom: 1px solid #f1f1f1;
  .label {
    font-size: 14px;
    color: #666;
    padding-right: 10px;
    vertical-align: middle;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 120px !important;
  }
}
.state-tag {
  &.success {
    color: rgb(127, 183, 98);
  }
  &.warning {
    color: rgb(231, 90, 22);
  }
  &.info {
    color: #999;
  }
  &.danger {
    color: rgb(238, 48, 67);
  }
}
.file-list {
  .file-item {
    display: block;
    font-size: 11px;
    line-height: 14px;
    padding: 10px 0;
    color: rgb(231, 90, 22);
    text-decoration: underline;
    cursor: pointer;
    border-bottom: 1px dashed #ccc;
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>

