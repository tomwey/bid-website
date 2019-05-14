<template>
  <div class="bonds-list">
    <div class="stat-newbar">
      <el-row>
        <el-col :span="16">
          <span class="stat">共{{totalSize}}条</span>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <el-button type="primary" @click="newBonds">新增投标保证金</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table key="bidMoneyDataTable" :data="tableData" stripe style="width: 100%">
        <el-table-column label="缴纳凭证附件">
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
        <el-table-column prop="bondexplain" label="审批意见" width="280">
          <template slot-scope="scope">{{scope.row.bondexplain || "无"}}</template>
        </el-table-column>
        <el-table-column prop="bonddate" label="时间" width="180"></el-table-column>
        <el-table-column prop="bondstate" label="状态" width="120">
          <template slot-scope="scope">
            <span
              type="primary"
              class="state-tag"
              :class="{pending:scope.row.bondstatename == '审核中',approved:scope.row.bondstatename == '已通过',rejected:scope.row.bondstatename == '未通过',danger:scope.row.bondstatename == '已放弃'}"
            >{{scope.row.bondstatename}}</span>
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
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%">
    </el-dialog>
    <el-dialog
      title="新增保证金缴纳凭证"
      :visible.sync="bonusDialogFormVisible"
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
        :controls="bidMoneyFormControls"
        :form-model="bidMoneyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bonusDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bonds-list",
  props: {
    noticeid: {
      type: String
    },
    purchasematterid: {
      type: String
    }
  },
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      tableData: [],
      page: 1,
      totalSize: 0,
      pageSize: 20,
      previewImage: null,
      dialogPreviewVisible: false,
      bonusDialogFormVisible: false,
      bidMoneyFormModel: {},
      bidMoneyFormControls: [
        {
          id: "money-file",
          type: 8,
          //   subtype: "file",
          label: "缴纳附件",
          field: "file",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_Bond",
          fieldname: "bondannex",
          rules: [
            { required: true, message: "缴纳附件不能为空", trigger: "blur" }
          ]
        },
        {
          id: "money-content",
          type: 1,
          subtype: "textarea",
          label: "备注说明",
          field: "content"
        }
      ]
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
    newBonds() {
      //   console.log(this.$refs);

      this.bidMoneyFormModel = {};
      this.bonusDialogFormVisible = true;
    },
    loadAnnex(item) {
      if (item.bondannex && item.bondannex != "0") {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.bondannex
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
    commit() {
      this.$refs.refForm.validateFields(flag => {
        if (flag) {
          this.$post(
            {
              action: "P_SUP_Bid_Bond",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.noticeid || "",
              p4: this.purchasematterid || "",
              p5: this.bidMoneyFormModel["content"] || "",
              p6: this.bidMoneyFormModel["file"] || ""
            },
            res => {
              if (res.code == "0") {
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
                this.bonusDialogFormVisible = false;
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
    loadData() {
      this.$post(
        {
          action: "P_SUP_Bid_GetBondList",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.noticeid || "",
          p4: this.purchasematterid || "",
          p5: this.page,
          p6: this.pageSize
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
    }
  }
};
</script>
<style lang="scss" scoped>
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
.state-tag {
  &.approved {
    color: rgb(127, 183, 98);
  }
  &.pending {
    color: rgb(231, 90, 22);
  }
  &.rejected {
    color: #999;
  }
  &.danger {
    color: rgb(238, 48, 67);
  }
}
</style>


