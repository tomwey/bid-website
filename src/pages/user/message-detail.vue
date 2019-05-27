<template>
  <div class="message-detail">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/messages' }">消息列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
      <h2 class="title">{{message.msgtitle}}</h2>
      <p class="time">{{message.createdate}}</p>
      <p class="body">{{message.msgcontent}}</p>
      <div class="btn-wrap">
        <el-button v-if="hasDetail" @click="jumpTo">点击查看</el-button>
      </div>
    </div>

    <el-dialog
      title="通知详情"
      :visible.sync="notifyTableVisible"
      :append-to-body="true"
      center
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <el-table key="notifyTable" :data="notifyTableData" stripe style="width: 100%">
        <el-table-column label="商务议标要点" prop="biddisscuspoints" width="280"></el-table-column>
        <el-table-column label="其他议标要点" prop="otherbidpoints" width="280"></el-table-column>
        <el-table-column label="议标约谈时间" prop="biddiscussdate" width="120"></el-table-column>
        <el-table-column label="议标通知综述" prop="bidnoticesummary" width="120"></el-table-column>
        <el-table-column label="议标通知">
          <template slot-scope="scope">
            <div class="file-list">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in scope.row['biddiscussnotice_fileList']"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>-->
      <div style="text-align:center" v-if="notifyTableData.length === 0">暂无数据</div>
      <table class="table">
        <tr v-for="(item,index) in notifyTableData" :key="index">
          <td class="label">
            <div class="label-box">{{item.label}}</div>
          </td>
          <td class="value">
            <div class="content" v-html="item.value" v-if="item.type === 1"></div>
            <div class="file-list" v-if="item.type === 2">
              <span
                @click="previewFile(file)"
                class="file-item"
                v-for="file in item.value_fileList"
                :key="file.url"
              >{{file.name}}</span>
            </div>
          </td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="notifyTableVisible = false">关 闭</el-button>
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
export default {
  name: "message-detail",
  data() {
    return {
      message: {},
      notifyTableVisible: false,
      dialogPreviewVisible: false,
      previewImage: null,
      imgLoaded: false,
      notifyTableData: []
    };
  },
  mounted() {
    this.loadMsg();
  },
  computed: {
    hasDetail() {
      const arr = [
        "1011",
        "1021",
        "1012",
        "1022",
        // "1015",
        "1025",
        // "1101",
        // "1019",
        // "1029",
        "1201",
        "1202",
        "1203",
        "1204",
        "1205",
        "1206",
        "1401"
      ];
      return arr.indexOf((this.message.msgtype || "0").toString()) === -1;
    }
  },
  methods: {
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
    previewFile(file) {
      this.imgLoaded = false;
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    jumpTo() {
      switch (this.message.msgtype) {
        case "1003": {
          // 招标公告
          this.$router.push({
            path: "/admin/apply-bid/" + `${this.message.jumpid}-0`
          });
          return;
        }
        case "1101": {
          this.notifyTableVisible = true;
          this.$post(
            {
              action: "P_SUP_Bid_GetBidDdiscussNoticeDetail",
              p1: this.$store.state.supinfo.accountid || "",
              p2: this.$store.state.token || "",
              p3: this.message.jumpid || "0"
            },
            res => {
              if (res.code == "0") {
                if (res.data.length > 0) {
                  let item = res.data[0];
                  let temp = [];
                  temp.push({
                    label: "商务议标要点",
                    value: item.biddisscuspoints,
                    type: 1
                  });
                  temp.push({
                    label: "其他议标要点",
                    value: item.otherbidpoints,
                    type: 1
                  });
                  temp.push({
                    label: "议标约谈时间",
                    value: item.biddiscussdate,
                    type: 1
                  });
                  temp.push({
                    label: "议标通知综述",
                    value: item.bidnoticesummary,
                    type: 1
                  });
                  let obj = {
                    label: "议标通知",
                    value: item.biddiscussnotice,
                    type: 2
                  };
                  temp.push(obj);

                  this.loadAnnex(obj, "value");

                  this.notifyTableData = temp;
                }
              }
            }
          );
          return;
        }
        case "1014":
        case "1024": {
          // 我的报名
          this.$router.push({ name: "user_apply" });
          return;
        }
        case "1015": {
          // 我的入围
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-1-0-1`
          });
          return;
        }
        case "1006":
        case "1007": {
          // 我的投标—下载招标文件
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-1-0-2`
          });
          return;
        }
        case "1019":
        case "1029": {
          // 我的投标-投标保证金
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-3-0-2`
          });
          return;
        }
        case "1008": {
          // 我的投标—答疑—回复
          localStorage.setItem("from", "/admin/bids");

          this.$router.push({
            path: "/admin/bids/" + `${this.message.jumpid}-0-2-0-2`
          });
          return;
        }
        case "1311":
        case "1321": {
          // 我的投标—中标通知
          // localStorage.setItem("from", "/admin/bids");

          // this.$router.push({
          //   path: "/admin/bids/" + `${this.message.jumpid}-0-100-0-2`
          // });
          if (!this.message.bidnoticeannex) {
            this.$message({
              type: "error",
              message: "中标结果附件不存在"
            });
            return;
          }
          this.$PreviewFile(this.message.bidnoticeannex);
          return;
        }
        default:
          return;
      }
    },
    loadMsg() {
      // console.log(this.$route.params.id);
      const msgID = this.$route.params.id;
      this.$post(
        {
          action: "P_SUP_Bid_GetMsgDetail",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: msgID
        },
        res => {
          // console.log(res);
          if (res.code == 0) {
            const arr = res["data"];
            if (arr.length > 0) {
              this.message = arr[0];
            }
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.breadcrumb-wrapper {
  background: #fff;
  padding: 15px;
  margin-bottom: 15px;
  // border-bottom: 1px solid #f2f2f2;
}
.detail {
  .title {
    text-align: center;
    font-size: 18px;
    color: #333;
    font-weight: 700 !important;
    margin-bottom: 20px;
  }
  .time {
    font-size: 14px;
    color: #999;
    text-align: center;
  }
  .body {
    font-size: 14px;
    color: #333;
  }
  .btn-wrap {
    margin-top: 60px;
    text-align: center;
  }
  background: #fff;
  padding: 30px;
  min-height: 688px;
}

.table {
  width: 100%;
  font-size: 14px !important;
  color: #333 !important;
  border: 1px solid #f2f2f2;
  tr,
  td {
    border: 1px solid #f2f2f2;
  }
  .label {
    color: #888;
    width: 180px;
    .label-box {
      width: 180px;
    }
  }
  .value {
    width: calc(100% - 180px);
    .content {
      width: 100%;
      overflow: auto;
    }

    .content table {
      table-layout: auto !important;
    }
    // width: 30% !important;
    img {
      max-width: 100%;
    }
    p {
      font-size: 14px !important;
    }
  }
  // .value {
  .file-link {
    color: rgb(231, 90, 22) !important;
  }
  // }
}
</style>



    