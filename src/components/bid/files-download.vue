<template>
  <div class="files-download">
    <el-tabs key="filesTab" v-model="tabName">
      <el-tab-pane label="标书下载" name="0">
        <table class="table">
          <tr v-for="(item,index) in downloadFiles" :key="index">
            <td class="label">{{item.label}}</td>
            <td class="value">
              <div class="file-list">
                <span
                  @click="previewFile(file)"
                  class="file-item"
                  v-for="file in item.fileList"
                  :key="file.url"
                >{{file.name}}</span>
              </div>
            </td>
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="标书补充资料下载" name="1">
        <el-table :data="attachmentData" key="faqTable135" stripe style="width: 100%">
          <el-table-column prop="uploaddesc" label="标书补充说明"></el-table-column>
          <el-table-column label="补充资料附件">
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
          <el-table-column prop="uploaddate" label="发布时间" width="180"></el-table-column>
          <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img
        :src="previewImage"
        style="max-width: 100%"
        @load="imgLoaded = true"
        class="preview-image"
        :class="{loaded:imgLoaded, loading: !imgLoaded}"
      >
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "files-download",
  props: {
    noticeid: {
      type: String
    },
    purchasematterid: {
      type: String
    },
    candownload: {
      type: String
    }
  },
  data() {
    return {
      tabName: "0",
      dialogPreviewVisible: false,
      previewImage: null,
      attachmentData: [],
      downloadFiles: [],
      imgLoaded: false
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    tabName() {
      this.loadData();
    },
    purchasematterid() {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      this.$post(
        {
          action: "P_SUP_Bid_GetBidAnnexs",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.noticeid || "",
          p4: this.purchasematterid || "",
          p5: this.tabName
        },
        res => {
          // console.log(res);
          if (this.tabName == "0") {
            this.loadDone1(res);
          } else {
            this.loadDone2(res);
          }
        }
      );
    },
    loadDone1(res) {
      if (res.code == "0") {
        let arr = res.data;
        if (arr.length > 0) {
          let item = arr[0];
          let temp = [];
          temp.push({ label: "招标文件正文", value: item["bidtextannexs"] });
          temp.push({
            label: "合同模板及附件",
            value: item["bidcontractannexs"]
          });
          temp.push({ label: "招标图纸", value: item["bidpicannexs"] });
          temp.push({ label: "招标清单", value: item["bidlistannexs"] });
          temp.push({ label: "技术要求", value: item["bidtechannexs"] });
          temp.push({
            label: "施工及材料界面",
            value: item["bidconstructannexs"]
          });
          temp.push({ label: "其他文件", value: item["bidotherannexs"] });

          this.downloadFiles = temp;
          this.downloadFiles.forEach(item => {
            this.loadAnnexes(item);
          });
        }
      }
    },
    loadDone2(res) {
      if (res.code == "0") {
        this.attachmentData = res.data;

        this.attachmentData.forEach(item => {
          this.loadAnnexes(item);
        });
      }
    },
    loadAnnexes(item) {
      if (
        (item.value && item.value != "0") ||
        (item.addannexs && item.addannexs != "0")
      ) {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.addannexs || item.value
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
      if (this.candownload == "0") {
        this.$message({
          type: "error",
          message: "您已弃标，不能下载招标附件"
        });
        return;
      }
      this.imgLoaded = false;
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    loaded() {
      // console.log(123);
      // this.dialogPreviewVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.files-download {
  padding: 0 30px 30px;
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
      text-decoration: underline;
    }
    // }
  }
}
.file-list {
  .file-item {
    display: block;
    font-size: 14px;
    line-height: 14px;
    padding: 10px 0;
    color: rgb(231, 90, 22);
    text-decoration: underline;
    cursor: pointer;
    // border-bottom: 1px dashed #ccc;
    &:last-child {
      border-bottom: 0;
    }
  }
}

.preview-image {
  &.loaded {
    opacity: 1;
  }
  &.loading {
    opacity: 0;
  }
}
</style>


