<template>
  <div class="bid-list box">
    <!-- 即将上线... -->
    <h2 class="title">招标事项列表</h2>
    <div class="search-toolbar">
      <el-row>
        <el-col :span="8">
          <span class="label">时间:</span>
          <el-date-picker
            v-model="end_date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8" v-if="$route.name != 'user_bid_faq' && $route.name != 'user_applied'">
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
        <el-col :span="$route.name != 'user_bid_faq' && $route.name != 'user_applied' ? 8 : 16">
          <el-input placeholder="输入搜索内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table :data="tableData" stripe style="width: 100%" :key="$route.name">
        <el-table-column prop="title" label="招标事项">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row)">{{scope.row.noticetitle}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="dateTableHeader" width="200">
          <template slot-scope="scope">{{calcDateVal(scope.row)}}</template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="120"
          v-if="$route.name != 'user_bid_faq' && $route.name != 'user_applied'"
        >
          <template slot-scope="scope">
            <span
              class="state-tag"
              :class="{success:scope.row.state == '已通过', info:scope.row.state == '已放弃', warning:scope.row.state == '审核中', danger:scope.row.state == '未通过'}"
            >{{scope.row.state}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.isgiveup == '1'"
              @click="abandon(scope.row);"
            >弃标</el-button>
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
      title="放弃投标"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <form-fields
        form-ref="form"
        ref="dialogForm"
        :controls="applyControls"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bid-list",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      currApply: null,
      end_date: null,
      state: null,
      // dsType: "1",
      stateOptions: [],
      keyword: null,
      page: 1,
      totalSize: 0,
      abandonMatters: [],
      pageSize: 20,
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
      tableData: []
    };
  },
  watch: {
    $route: function(to) {
      // console.log(to);
      this.search();
    },
    end_date() {
      this.search();
    },
    state() {
      this.search();
    }
  },
  mounted() {
    // console.log(this.$route);
    this.loadData();
  },
  computed: {
    dateTableHeader() {
      switch (this.$route.name) {
        case "user_bid_faq":
          return "截止时间";
        case "user_applied":
          return "入围时间";
        default:
          return "时间";
      }
    },
    currentStep() {
      switch (this.$route.name) {
        case "user_bid_faq":
          return 2;
        case "user_applied":
          return 1;
        default:
          return 0;
      }
    },
    dsType() {
      switch (this.$route.name) {
        case "user_bid_faq":
          return "1";
        case "user_applied":
          return "1";
        case "user_bids":
          return "2";
        default:
          return 0;
      }
    },
    specialTypeID() {
      switch (this.$route.name) {
        case "user_applied":
          return "1";
        case "user_bids":
          return "2";
        default:
          return "1";
      }
    }
  },
  methods: {
    calcDateVal(item) {
      // enddate
      switch (this.$route.name) {
        case "user_bid_faq":
        case "user_bids":
          return item.enddate;
        case "user_applied":
          return item.selecteddate;
        default:
          return "";
      }
    },
    currentStage() {
      // enddate
      switch (this.$route.name) {
        case "user_bid_faq":
          return "4";
        case "user_applied":
          return "3";
        default:
          return "";
      }
    },
    loadData() {
      this.$post(
        {
          action: "P_SUP_Bid_GetShortList",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.end_date || "",
          p4: this.state || "",
          p5: this.keyword || "",
          p6: this.page.toString(),
          p7: this.pageSize.toString(),
          p8: this.dsType
        },
        res => {
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
    search() {
      this.page = 1;
      this.loadData();
    },
    pageChange(val) {
      this.page = val;
      this.loadData();
    },
    selectItem(item) {
      // console.log(item);
      // console.log(this.$route.path);
      localStorage.setItem("from", this.$route.path);

      this.$router.push({
        path:
          "/admin/bids/" +
          `${item.noticeid}-${item.purchasematterid}-0-${item.shortlistid ||
            "0"}-${this.specialTypeID}`
      });
    },
    abandon(item) {
      this.currApply = item;
      this.applyFormModel = {};
      this.dialogFormVisible = true;

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

          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_GiveUp",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.currApply.noticeid || "",
              // p4: this.currApply.purchasematterid || "",
              // p5: "",
              // p6: this.currentStage(),
              p4: item.purchasematterid || "",
              p5: item.purchasemattersubid || "",
              p6: item.stageid || "",
              p7: this.applyFormModel["reason"] || "",
              p8: this.applyFormModel["file"] || "",
              p9: this.applyFormModel["memo"] || ""
            },
            res => {
              this.loading = false;
              this.$refs.dialogForm.$refs["form"] &&
                this.$refs.dialogForm.$refs["form"].resetFields();

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
</style>

