<template>
  <div class="business-bid" v-loading="loading">
    <div class="stat-newbar">
      <el-alert title="若多次投标，我们将以最新一次为准。" effect="dark" type="warning"></el-alert>
      <el-row style="margin-top: 20px">
        <el-col :span="16">
          <span class="stat">共{{totalSize}}条</span>
        </el-col>
        <!-- <el-col :span="8" style="text-align:right;">
          <el-button type="primary" @click="newPriceBid">新增商务回标</el-button>
        </el-col>-->
      </el-row>
    </div>
    <div class="list">
      <el-table key="bidPriceTableParent" :data="tableData" stripe style="width: 100%">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              key="bidPriceTable"
              :data="props.row.bidList || []"
              stripe
              style="width: 100%"
            >
              <el-table-column label="回标报价总金额（含税总价，单位元）" prop="money" width="280">
                <template slot-scope="scope">
                  <span
                    @click="showMoney(scope.row);"
                  >{{scope.row.showmoney ? scope.row.money : "********"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="税率(%)" prop="rate" width="120"></el-table-column>
              <el-table-column label="商务标附件">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >附件</a>
                </template>
              </el-table-column>
              <el-table-column label="其它标书附件">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="投标时间" width="180"></el-table-column>
            </el-table>
          </template>
        </el-table-column>-->
        <el-table-column label="事项名称" prop="mattersubname"></el-table-column>
        <el-table-column label="所属项目" prop="project_name" width="120"></el-table-column>
        <el-table-column label="楼栋/标段" prop="section" width="120"></el-table-column>
        <el-table-column label="投标截止时间" prop="enddate" width="180"></el-table-column>
        <el-table-column label="通知附件" prop="bidnoticeannexs" width="180">
          <template slot-scope="scope">
            <div class="file-list">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in scope.row['bidnoticeannexs_fileList']"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" @click="viewBids(scope.row)">投标历史</el-button>
            <el-button type="primary" size="small" @click="newPriceBid(scope.row)">投标</el-button>
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
      title="新增商务回标"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      center
      v-loading="commiting"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.refForm.$refs.form && $refs.refForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="refForm"
        :controls="bidPriceFormControls"
        :form-model="bidPriceFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="投标历史"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      center
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table key="bidPriceTable" :data="subTableData" stripe style="width: 100%">
        <el-table-column label="回标报价总金额（含税总价，单位元）" prop="totalamount" width="280">
          <template slot-scope="scope">
            <span
              @click="showMoney(scope.row);"
            >{{scope.row.showmoney ? scope.row.totalamount : "********"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="税率(%)" prop="taxrate" width="120"></el-table-column>
        <el-table-column label="商务标附件">
          <template slot-scope="scope">
            <div class="file-list">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in scope.row['annexids_fileList']"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="其它标书附件">
          <template slot-scope="scope">
            <div class="file-list">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in scope.row['otherannexids_fileList']"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="biddate" label="投标时间" width="180"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="commit">提 交</el-button> -->
      </div>
    </el-dialog>
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
import { MessageBox } from "element-ui";
export default {
  name: "business-bid",
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
      loading: false,
      commiting: false,
      dialogPreviewVisible: false,
      previewImage: null,
      currPurchaseMatterSubID: null,
      currBidReid: null,
      tableData: [],
      totalSize: 0,
      pageSize: 20,
      imgLoaded: false,
      page: 1,
      dialogFormVisible: false,
      dialogTableVisible: false,
      subTableData: [],
      //   bidPriceData: [],
      bidPriceFormControls: [
        {
          id: "price-money",
          type: 1,
          subtype: "number",
          label: "回标总金额",
          field: "money",
          unit: "元",
          rules: [
            { required: true, message: "回标总金额不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-rate",
          type: 1,
          subtype: "number",
          label: "税率",
          field: "rate",
          unit: "%",
          rules: [{ required: true, message: "税率不能为空", trigger: "blur" }]
        },
        {
          id: "price-file",
          type: 8,
          //   subtype: "file",
          label: "商务标附件",
          field: "file1",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_Return_doc",
          fieldname: "annexids",
          rules: [
            { required: true, message: "商务标附件不能为空", trigger: "blur" }
          ]
        },
        {
          id: "other-file",
          type: 8,
          label: "其它标书附件",
          field: "file2",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_SUP_Bid_Return_doc",
          fieldname: "otherannexids"
        }
      ],
      bidPriceFormModel: {}
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
    pageChange(val) {
      this.page = val;
      this.loadData();
    },
    previewFile(file) {
      this.imgLoaded = false;
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    expandChange(row, expandedRows) {
      let index = expandedRows.indexOf(row);
      if (index !== -1) {
        this.loadSubData(row);
      }
    },
    // loadSubData(item) {
    //   this.$post(
    //     {
    //       action: "P_SUP_Bid_GetSubBidList",
    //       p1: this.$store.state.supinfo.accountid || "",
    //       p2: this.$store.state.token || "",
    //       p3: item.purchasemattersubid || ""
    //     },
    //     res => {
    //       if (res.code == "0") {
    //         this.$set(item, "bidList", res.data || []);
    //       }
    //     }
    //   );
    // },
    viewBids(item) {
      this.dialogTableVisible = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetSubBidList",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: item.purchasemattersubid || "",
          p4: "20"
        },
        res => {
          if (res.code == "0") {
            this.subTableData = res.data;
            this.subTableData.forEach(item => {
              this.loadAnnex(item, "annexids");
              this.loadAnnex(item, "otherannexids");
            });
            // this.$set(item, "bidList", res.data || []);
          }
        }
      );
    },
    loadAnnex(item, fieldName) {
      if (item[fieldName] && item[fieldName] != "0") {
        this.$post(
          {
            action: "P_SY_GetAnnex",
            p1: item[fieldName]
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
              this.$set(item, fieldName + "_fileList", temp);
            }
          }
        );
      }
    },
    loadData() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetMatterSubList",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.purchasematterid || "0",
          p4: this.page,
          p5: this.pageSize
        },
        res => {
          this.loading = false;
          this.tableData = res["data"];
          if (this.tableData.length > 0) {
            this.totalSize = parseInt(this.tableData[0]["totalcount"]);
          }

          this.tableData.forEach(item => {
            this.loadAnnex(item, "bidnoticeannexs");
          });
        }
      );
    },
    showMoney(item) {
      this.$set(item, "showmoney", true);
    },
    newPriceBid(item) {
      this.currPurchaseMatterSubID = item.purchasemattersubid;
      this.currBidReid = item.bidreid;
      this.bidPriceFormModel = {};
      this.dialogFormVisible = true;
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
              this.commiting = true;
              this.$post(
                {
                  action: "P_SUP_Bid_CreateBusinessBid",
                  p1: this.$store.state.supinfo.accountid || "",
                  p2: this.$store.state.token || "",
                  p3: this.currBidReid || "0",
                  p4: this.purchasematterid || "0",
                  p5: this.currPurchaseMatterSubID || "0",
                  p6: (this.bidPriceFormModel["money"] || "").toString(),
                  p7: (this.bidPriceFormModel["rate"] || "").toString(),
                  p8: this.bidPriceFormModel["file1"] || "",
                  p9: this.bidPriceFormModel["file2"] || ""
                },
                res => {
                  this.commiting = false;
                  if (res.code == "0") {
                    this.dialogFormVisible = false;
                    this.$message({
                      type: "success",
                      message: "提交成功"
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.codemsg
                    });
                  }
                }
              );
            })
            .catch(() => {});
        } else {
          this.commiting = false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
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


