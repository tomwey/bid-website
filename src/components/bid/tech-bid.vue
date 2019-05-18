<template>
  <div class="tech-bid" v-loading="loading">
    <div class="stat-newbar">
      <el-row>
        <el-col :span="16">
          <span class="stat">共{{totalSize}}条</span>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <el-button type="primary" @click="newBid">新增技术回标</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table key="bidFuncTable" :data="tableData" stripe style="width: 100%">
        <el-table-column label="技术附件" width="240">
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
      title="新增技术回标"
      :visible.sync="dialogFormVisible"
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
        :controls="bidFuncFormControls"
        :form-model="bidFuncFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
          this.loading = true;
          this.$post(
            {
              action: "P_SUP_Bid_CreateTechBid",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.bidreid || "",
              p4: this.purchasematterid || "",
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
      });
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
</style>


