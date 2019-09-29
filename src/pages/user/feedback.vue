<template>
  <div class="feedback-list box" v-loading="loading">
    <!-- 即将上线... -->
    <h2 class="title">
      投诉建议列表
      <el-button @click="newFeedback()" class="right-btn" type="primary" size="small">投诉建议</el-button>
    </h2>
    <div class="search-toolbar">
      <el-row>
        <el-col :span="10">
          <span class="label">提交时间:</span>
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
        <el-table-column prop="typename" label="类型" width="80"></el-table-column>
        <el-table-column prop="theme" label="主题" width="120"></el-table-column>
        <el-table-column prop="contentdesc" label="内容说明"></el-table-column>
        <el-table-column prop="contractname" label="项目/合同">
          <template slot-scope="scope">
            {{
            scope.row.project_name
            }}
            <br />
            {{scope.row.contractname}}
          </template>
        </el-table-column>
        <el-table-column prop="create_date" label="提交时间" width="110"></el-table-column>
        <el-table-column prop="state_desc" label="状态" width="120"></el-table-column>
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
      title="新建投诉建议"
      :visible.sync="newFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      v-loading="loading"
      @close="$refs.feedbackForm.$refs.form && $refs.feedbackForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="feedbackForm"
        :controls="feedbackControls"
        :form-model="feedbackFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%" />
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
      dialogPreviewVisible: false,
      previewImage: null,
      newFormVisible: false,
      loading: false,
      end_date: null,
      keyword: null,
      state: null,
      event_types1: [],
      event_types2: [],
      stateOptions: [],
      projects: [],
      contracts: {},
      page: 1,
      currentApply: {},
      totalSize: 0,
      pageSize: 20,
      feedbackControls: [
        {
          id: "type",
          type: 3,
          label: "类型",
          field: "type",
          changeFunc: val => {
            // console.log(val);
            console.log(this.event_types1);
            if (val == "1") {
              this.feedbackControls[1].options = this.event_types1;
            } else if (val == "2") {
              console.log(this.event_types2);
              this.feedbackControls[1].options = this.event_types2;
            }
          },
          options: [
            {
              label: "投诉",
              value: "1"
            },
            {
              label: "建议",
              value: "2"
            }
          ],
          rules: [
            {
              required: true,
              message: "类型不能为空",
              trigger: "change"
            }
          ]
        },
        {
          id: "problem-type",
          type: 2,
          label: "事项类型",
          field: "event_type",
          options: [],
          rules: [
            {
              required: true,
              message: "事项类型不能为空",
              trigger: "change"
            }
          ]
        },
        {
          id: "project",
          type: 2,
          label: "项目名称",
          field: "project",
          options: [],
          changeFunc: val => {
            // this.feedbackFormModel["contract"] = "";
            this.$set(this.feedbackFormModel, "contract", null);
            let temp = [];
            val = "p" + val;
            (this.contracts[val] || []).forEach(ele => {
              temp.push({ label: ele.contractname, value: ele.contractid });
            });
            this.feedbackControls[3].options = temp;
          },
          rules: [
            {
              required: true,
              message: "项目名称不能为空",
              trigger: "change"
            }
          ]
        },
        {
          id: "contract",
          type: 2,
          label: "相关合同",
          field: "contract",
          options: [],
          rules: []
        },
        {
          id: "subject",
          type: 1,
          label: "主题",
          field: "subject",
          rules: [
            {
              required: true,
              message: "主题不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          id: "contact_name",
          type: 1,
          label: "联系人",
          field: "contact_name",
          rules: [
            {
              required: true,
              message: "联系人不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          id: "contact_name2",
          type: 1,
          label: "联系人称谓",
          field: "contact_name2",
          rules: [
            {
              required: true,
              message: "联系人称谓不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          id: "contact_mobile",
          type: 1,
          label: "联系电话",
          field: "contact_mobile",
          rules: [
            {
              required: true,
              message: "联系电话不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          id: "body",
          type: 1,
          label: "内容说明",
          field: "body",
          subtype: "textarea",
          rows: 6
        },
        {
          id: "annex",
          label: "附件",
          field: "annexes",
          // required: true,
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SY_Complain_Suggest_Annex",
          fieldname: "AnnexID",
          type: 8,
          limit: 5,
          accept: ".jpg,.gif,.png,.jpeg"
        }
      ],
      feedbackFormModel: {},
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
    newFeedback() {
      this.loadOptions();
      this.newFormVisible = true;
    },
    loadOptions() {
      this.loadContracts();
      this.loadTypeOptions();
    },
    loadContracts() {
      this.$post(
        {
          action: "P_SUP_SE_Query_Main",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: "0"
        },
        res => {
          console.log("合同：" + res);

          if (res.code == 0 && res.data) {
            let temp = [];
            res.data.forEach(ele => {
              const project = `p${ele.project_id}`;
              if (temp.indexOf(project) == -1) {
                temp.push(project);
                this.projects.push({
                  label: ele.project_name,
                  value: ele.project_id
                });
              }

              let arr = this.contracts[project] || [];
              arr.push(ele);
              this.contracts[project] = arr;
            });

            this.feedbackControls[2].options = this.projects;
          }
        }
      );
    },
    loadTypeOptions() {
      this.$post(
        {
          action: "P_SY_SE_Query_ComboList",
          p1: "投诉建议类型"
        },
        res => {
          //   console.log(res);
          if (res.code == 0 && res.data) {
            let temp = [];
            res.data.forEach(ele => {
              temp.push({ label: ele.dic_name, value: ele.dic_value });
            });
            this.feedbackControls[0].options = temp;
          }
        }
      );

      this.$post(
        {
          action: "P_SY_SE_Query_ComboList",
          p1: "投诉事项类型"
        },
        res => {
          console.log(res);
          if (res.code == "0" && res.data) {
            let temp = [];
            res.data.forEach(ele => {
              temp.push({ label: ele.dic_name, value: ele.dic_value });
            });
            this.event_types1 = temp;
            console.log(this.event_types1);
          }
        }
      );

      this.$post(
        {
          action: "P_SY_SE_Query_ComboList",
          p1: "建议事项类型"
        },
        res => {
          console.log(res);
          if (res.code == "0" && res.data) {
            let temp = [];
            res.data.forEach(ele => {
              temp.push({ label: ele.dic_name, value: ele.dic_value });
            });
            console.log(temp);
            this.event_types2 = temp;
          }
        }
      );
    },
    loadStateOptions() {
      //   this.$post(
      //     {
      //       action: "P_SY_GetParamInfo",
      //       p1: "13"
      //     },
      //     res => {
      //       // console.log(res);
      //       if (res.code == "0") {
      //         let arr = res.data || [];
      //         let temp = [];
      //         arr.forEach(ele => {
      //           temp.push({ label: ele.sy_name, value: ele.sy_value });
      //         });
      //         this.stateOptions = temp;
      //       }
      //     }
      //   );
      this.stateOptions = [
        { label: "全部", value: "-1" },
        { label: "待处理", value: "0" },
        { label: "受理中", value: "1" },
        { label: "已处理", value: "2" }
      ];
    },
    pageChange(val) {
      this.page = val;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Query_Complain_Suggest_List",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: "0"
          //   p3: this.end_date || "",
          //   p4: this.keyword || "",
          //   p5: this.state || "-1",
          //   p6: this.page,
          //   p7: this.pageSize
        },
        res => {
          this.loading = false;
          console.log(res);
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
    search() {
      this.page = 1;
      this.loadData();
    },
    commit() {
      // let matters = this.applyFormModel["matterindexes"] || [];
      console.log(this.feedbackFormModel);
      //   return;
      this.$refs.feedbackForm.validateFields(flag => {
        if (flag) {
          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Create_Complain_Suggest",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: "0",
              p4: this.feedbackFormModel.type || "",
              p5: this.feedbackFormModel.event_type || "",
              p6: this.feedbackFormModel.project || "",
              p7: this.feedbackFormModel.contract || "",
              p8: this.feedbackFormModel.subject || "",
              p9: this.feedbackFormModel.contact_name || "",
              p10: this.feedbackFormModel.contact_name2 || "",
              p11: this.feedbackFormModel.contact_mobile || "",
              p12: this.feedbackFormModel.body || "",
              p13: this.feedbackFormModel.annexes || ""
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

