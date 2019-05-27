<template>
  <div class="faq-list">
    <p class="enddate-tip">提疑截止时间: {{enddate}}</p>
    <el-tabs key="faqTab" v-model="tabName" @tab-click="handleClick">
      <el-tab-pane label="提问" name="faq">
        <div class="stat-newbar">
          <el-row>
            <el-col :span="16">
              <span class="stat">共{{totalSize}}条</span>
            </el-col>
            <el-col :span="8" style="text-align:right;">
              <el-button
                type="primary"
                @click="faqDialogFormVisible = true"
                :disabled="canfaq == '0'"
              >新增提疑</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="list">
          <el-table :data="tableData" key="faqTable1" stripe style="width: 100%">
            <el-table-column prop="queexplain" label="提问内容">
              <template slot-scope="scope">
                <span class="name" @click="selectItem(scope.row)">{{scope.row.queexplain}}</span>
              </template>
            </el-table-column>
            <el-table-column label="提问附件" width="180">
              <template slot-scope="scope">
                <div class="file-list">
                  <span
                    @click="previewFile(file)"
                    class="file-item"
                    v-for="file in scope.row.fileList"
                    :key="file.url"
                  >{{file.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="quedate" label="提问时间" width="180"></el-table-column>
            <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
          </el-table>
          <!-- <div class="page-container">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="50"
              :page-size="20"
              :current-page="1"
            ></el-pagination>
          </div>-->
        </div>
      </el-tab-pane>
      <el-tab-pane label="回复" name="answer">
        <div class="stat-newbar">
          <el-row>
            <el-col :span="16">
              <span class="stat">共{{totalSize}}条</span>
            </el-col>
          </el-row>
        </div>
        <div class="list">
          <el-table :data="tableData" key="faqTable2" stripe style="width: 100%">
            <el-table-column prop="bidsummary" label="答疑内容"></el-table-column>
            <el-table-column label="答疑附件" width="180">
              <template slot-scope="scope">
                <div class="file-list">
                  <span
                    @click="previewFile(file)"
                    class="file-item"
                    v-for="file in scope.row.fileList"
                    :key="file.url"
                  >{{file.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="answerdate" label="回复时间" width="180"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

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

    <el-dialog
      title="新增提疑"
      :visible.sync="faqDialogFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.refForm.$refs.form && $refs.refForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="refForm"
        :controls="faqFormControls"
        :form-model="faqFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="faqDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "faq-list",
  props: {
    noticeid: {
      type: String
    },
    purchasematterid: {
      type: String
    },
    enddate: {
      type: String
    },
    canfaq: {
      type: String
    }
  },
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  watch: {
    purchasematterid() {
      this.loadData();
    }
  },
  data() {
    return {
      tabName: "faq",
      page: 1,
      totalSize: 0,
      pageSize: 20,
      tableData: [],
      previewImage: null,
      dialogPreviewVisible: false,
      faqDialogFormVisible: false,
      faqFormControls: [
        {
          id: "faq-content",
          type: 1,
          subtype: "textarea",
          label: "疑问内容",
          field: "content",
          // unit: "万",
          rules: [
            { required: true, message: "提疑内容不能为空", trigger: "blur" }
          ]
        },
        {
          id: "faq-file",
          type: 8,
          //   subtype: "file",
          label: "提疑附件",
          field: "queannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_Question",
          fieldname: "queannex",
          rules: [
            { required: true, message: "提疑附件不能为空", trigger: "blur" }
          ]
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          //   accept: ".pdf",
          //   fileSize: 5
        },
        {
          id: "is-reconnaissance",
          type: 5,
          label: "是否踏勘",
          field: "isreconnaissance"
        }
      ],
      faqFormModel: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    pageChange(val) {
      this.page = val;
      this.loadData();
    },
    commit() {
      this.$refs.refForm.validateFields(flag => {
        if (flag) {
          this.$post(
            {
              action: "P_SUP_Bid_Question",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.noticeid || "",
              p4: this.purchasematterid || "",
              p5: this.faqFormModel["content"] || "",
              p6: this.faqFormModel["queannex"] || "",
              p7: this.faqFormModel["isreconnaissance"] ? "1" : "0"
            },
            res => {
              if (res.code == 0) {
                this.faqDialogFormVisible = false;
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
    loadAnnex(item) {
      if (
        (item.answerannex && item.answerannex != "0") ||
        (item.queannex && item.queannex != "0")
      ) {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.answerannex || item.queannex
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
      }
    },
    previewFile(file) {
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    loadData() {
      let funcName =
        this.tabName == "faq" ? "P_SUP_Bid_GetQuestion" : "P_SUP_Bid_GetAnswer";

      this.$post(
        {
          action: funcName,
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.noticeid || "",
          p4: this.page,
          p5: this.pageSize
        },
        res => {
          if (res.code == 0) {
            // console.log(res);
            this.tableData = res["data"];
            if (this.tableData.length > 0) {
              this.totalSize = parseInt(this.tableData[0]["totalcount"]);
            }

            this.tableData.forEach(item => {
              this.loadAnnex(item);
            });
          }
        }
      );
    },
    handleClick() {
      //   console.log(this.tabName);
      this.page = 1;
      this.loadData();
    }
  }
};
</script>
<style lang="scss" scoped>
.faq-list {
  padding: 0 30px 30px;
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
.enddate-tip {
  font-size: 14px;
  color: rgb(231, 90, 22);
  height: 40px;
  line-height: 40px;
  text-align: center;
}
</style>


