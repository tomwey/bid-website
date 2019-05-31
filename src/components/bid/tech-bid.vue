<template>
  <div class="tech-bid" v-loading="loading">
    <div class="stat-newbar">
      <el-alert title="若多次投标，我们将以最新一次为准。" effect="dark" type="warning"></el-alert>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <span class="stat">共{{totalSize}}条</span>
        </el-col>
        <el-col :span="12">
          <p class="enddate-tip">技术标投标截止时间: {{enddate}}</p>
        </el-col>
        <el-col :span="6" style="text-align:right;">
          <el-button type="primary" @click="newBid" :disabled="cantech == '0'">我要投标</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table key="bidFuncTable" :data="tableData" stripe style="width: 100%">
        <el-table-column label="技术标投标附件" width="240">
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
        <el-table-column prop="bidexplain" label="投标说明"></el-table-column>
        <el-table-column prop="biddate" label="投标时间" width="180"></el-table-column>
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
      title="投技术标"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.refForm.$refs.form && $refs.refForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="refForm"
        :controls="bidFuncFormControls"
        :form-model="bidFuncFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit" :loading="loading">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%">
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox } from "element-ui";
export default {
  name: "tech-bid",
  props: {
    noticeid: {
      type: String
    },
    purchasematterid: {
      type: String
    },
    bidreid: {
      type: String
    },
    enddate: {
      type: String
    },
    cantech: {
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
      page: 1,
      totalSize: 0,
      pageSize: 20,
      tableData: [],
      previewImage: null,
      dialogPreviewVisible: false,
      loading: false,
      dialogFormVisible: false,
      bidFuncData: [],
      commiting: false,
      bidFuncFormControls: [
        {
          id: "faq-content",
          type: 1,
          subtype: "textarea",
          label: "投标说明",
          field: "content",
          rules: [
            { required: true, message: "投标说明不能为空", trigger: "blur" }
          ]
        },
        {
          id: "faq-file",
          type: 8,
          label: "技术标附件",
          field: "file",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Bid_Return_Doc",
          fieldname: "annexids",
          rules: [
            { required: true, message: "技术标附件不能为空", trigger: "change" }
          ]
        }
      ],
      bidFuncFormModel: {}
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    purchasematterid() {
      this.loadData();
    }
  },
  methods: {
    newBid() {
      this.bidFuncFormModel = {};
      this.dialogFormVisible = true;
    },
    pageChange(val) {
      this.page = val;
      this.loadData();
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
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetBidTech",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.purchasematterid || "",
          p4: this.page,
          p5: this.pageSize
        },
        res => {
          this.loading = false;
          //   console.log(res);
          if (res.code == "0") {
            this.tableData = res.data;
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
    loadAnnex(item) {
      if (item.annexids && item.annexids != "0") {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.annexids
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
    commit() {
      this.$refs.refForm.validateFields(flag => {
        if (flag) {
          MessageBox({
            title: "提示",
            message: "您确定要提交吗？",
            confirmButtonText: "确定",
            showCancelButton: true,
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.doSend();
            })
            .catch(() => {});
        }
      });
    },
    doSend() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_CreateTechBid",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.bidreid || "0",
          p4: this.purchasematterid || "0",
          p5: this.bidFuncFormModel["file"] || "",
          p6: this.bidFuncFormModel["content"] || ""
        },
        res => {
          //   console.log(res);
          this.loading = false;
          if (res.code == "0") {
            this.$message({
              type: "success",
              message: "提交成功！"
            });
            this.dialogFormVisible = false;
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
.enddate-tip {
  font-size: 14px;
  color: rgb(231, 90, 22);
  height: 40px;
  line-height: 40px;
  text-align: center;
}
</style>


