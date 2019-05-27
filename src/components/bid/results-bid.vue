<template>
  <div class="results-bid" v-loading="loading">
    <div class="stat-newbar">
      <el-row>
        <el-col :span="16">
          <span class="stat">共{{totalSize}}条</span>
        </el-col>
      </el-row>
    </div>
    <div class="list">
      <el-table key="bidResultTable" :data="tableData" stripe style="width: 100%">
        <el-table-column label="投标事项名称" prop="mattersubname"></el-table-column>
        <el-table-column label="通知书附件" width="280">
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
        <el-table-column label="是否中标" width="120">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.bidstate == '20'">未中标</el-tag>
            <el-tag type="success" v-if="scope.row.bidstate == '10'">已中标</el-tag>
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
  </div>
</template>
<script>
export default {
  name: "results-bid",
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
  data() {
    return {
      page: 1,
      totalSize: 0,
      pageSize: 20,
      tableData: [],
      previewImage: null,
      dialogPreviewVisible: false,
      loading: false,
      dialogFormVisible: false
    };
  },
  watch: {
    purchasematterid() {
      this.loadData();
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
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
          action: "P_SUP_Bid_GetBidResult",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.purchasematterid || "",
          p4: this.page,
          p5: this.pageSize
        },
        res => {
          this.loading = false;
          // console.log(res);
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
      if (item.bidnoticeannex && item.bidnoticeannex != "0") {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item.bidnoticeannex
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


