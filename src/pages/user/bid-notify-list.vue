<template>
  <div class="bid-list box" v-loading="loading">
    <!-- 即将上线... -->
    <h2 class="title">报名通知列表</h2>
    <div class="search-toolbar">
      <el-row>
        <el-col :span="10">
          <span class="label">报名截止时间:</span>
          <el-date-picker
            v-model="end_date"
            type="date"
            value-format="yyyy-MM-dd"
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
        <el-col :span="6">
          <el-input placeholder="输入搜索内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="noticetitle" label="招标事项">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row)">{{scope.row.noticetitle}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="signenddate" label="报名截止时间" width="180"></el-table-column>
        <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">
            <!-- <span
              class="state-tag"
              :class="{success:scope.row.issignup == '1',warning:scope.row.issignup == '0'}"
            >{{scope.row.issignup == '0' ? '未报名' : '已报名'}}</span>-->
            <span class="state-tag danger" v-if="scope.row.isgiveup == '1'">已放弃</span>
            <span
              class="state-tag success"
              v-if="scope.row.isgiveup == '0' && scope.row.issignup == '1'"
            >已报名</span>
            <span
              class="state-tag info"
              v-if="scope.row.isgiveup == '0' && scope.row.issignup == '0' && scope.row.isoverdue == '1'"
            >已过期</span>
            <span
              class="state-tag warning"
              v-if="scope.row.isgiveup == '0' && scope.row.issignup == '0' && scope.row.isoverdue == '0'"
            >未报名</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              :disabled="scope.row.issignup == '1' || scope.row.isoverdue == '1' || scope.row.isgiveup == '1'"
              @click="apply(scope.row);"
            >报名</el-button>&nbsp;
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
      @close="$refs.dialogForm2.$refs.form && $refs.dialogForm2.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="dialogForm2"
        :controls="applyControls"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="报名"
      :visible.sync="applyFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      v-loading="loading"
      @close="$refs.applyForm.$refs.form && $refs.applyForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="applyForm"
        :controls="applyControls2"
        :form-model="applyFormModel2"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit2">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bid-notify-list",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    //业务量饱和、招标业务体量不匹配、支付方式不接受、对我司合作评估不佳、其他
    return {
      dialogFormVisible: false,
      loading: false,
      end_date: null,
      keyword: null,
      state: null,
      stateOptions: [],
      page: 1,
      abandonMatters: [],
      abandonLoading: false,
      currentApply: {},
      totalSize: 0,
      pageSize: 20,
      applyFormVisible: false,
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
      applyFormModel2: {},
      tableData: []
    };
  },
  watch: {
    $route: function(to) {
      // console.log(to);
    },
    end_date() {
      this.search();
    },
    state() {
      this.search();
    }
  },
  mounted() {
    this.loadData();
    this.loadStateOptions();
  },
  methods: {
    loadStateOptions() {
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "13"
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
    pageChange(val) {
      this.page = val;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetSignUpNotice",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.end_date || "",
          p4: this.keyword || "",
          p5: this.state || "-1",
          p6: this.page,
          p7: this.pageSize
        },
        res => {
          this.loading = false;
          // console.log(res);
          if (res.code == 0) {
            this.tableData = res["data"];
            if (this.tableData.length > 0) {
              this.totalSize = parseInt(this.tableData[0]["totalcount"]);
            }
          }
        }
      );
    },
    selectItem(item) {
      this.$router.push({
        path: "/admin/apply-bid/" + `${item.noticeid}-${item.purchasematterid}`
      });
    },
    abandon(item) {
      this.currentApply = Object.assign({}, item);
      this.applyFormModel = {};

      this.abandonLoading = true;

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
      this.dialogFormVisible = true;
    },
    apply(item) {
      this.currentApply = Object.assign({}, item);
      // this.$refs.applyForm.$refs["form"] &&
      //   this.$refs.applyForm.$refs["form"].resetFields();

      this.applyFormModel2 = {};
      this.applyFormVisible = true;
    },
    search() {
      this.page = 1;
      this.loadData();
    },
    commit() {
      // let matters = this.applyFormModel["matterindexes"] || [];
      this.$refs.dialogForm2.validateFields(flag => {
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
              p3: this.currentApply.noticeid || "",
              p4: item.purchasematterid || "",
              p5: item.purchasemattersubid || "",
              p6: item.stageid || "",
              p7: this.applyFormModel["reason"] || "",
              p8: this.applyFormModel["file"] || "",
              p9: this.applyFormModel["memo"] || ""
            },
            res => {
              this.loading = false;
              // console.log(this.$refs);

              // this.$refs["dialogForm2"].$refs["form"] &&
              //   this.$refs["dialogForm2"].$refs["form"].resetFields();

              if (res.code == "0") {
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
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
    commit2() {
      this.$refs.applyForm.validateFields(flag => {
        if (flag) {
          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_SignUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.applyFormModel2["otherannex"] || "",
              p4: this.applyFormModel2["signupannex"] || "",
              p5: this.currentApply.noticeid || "",
              p6: this.currentApply.purchasematterid || ""
            },
            res => {
              this.loading = false;
              console.log(res);
              if (res.code == "0") {
                // this.notice.issignup = "1";
                this.applyFormVisible = false;
                this.$message({
                  type: "success",
                  message: "报名成功"
                });
                this.page = 1;
                this.loadData();
                // this.$router.push({ path: "/admin/applying-bids" });
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
.el-table {
  color: #333;
}
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
    color: rgb(187, 83, 79);
  }
}
</style>

