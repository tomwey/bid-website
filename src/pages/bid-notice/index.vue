<template>
  <div class="home-main-wrap container" v-loading="loading">
    <div class="search-toolbar">
      <el-row>
        <el-col :span="8">
          <span class="label">报名截止时间:</span>
          <el-date-picker v-model="end_date" type="date" placeholder="选择日期"></el-date-picker>
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
        <el-col :span="8">
          <el-input placeholder="输入搜索内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="notices">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="noticetitle" label="标题">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row);">
              <span class="unread dot" v-if="scope.row.readstate == '0'"></span>
              <span class="read dot" v-if="scope.row.readstate != '0'"></span>
              {{scope.row.noticetitle}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="publishdate" label="发布时间" width="180"></el-table-column>
        <el-table-column prop="signenddate" label="报名截止时间" width="180"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <!-- <el-tag :type="scope.row.type">{{scope.row.state}}</el-tag> -->
            <span
              class="state-tag"
              :class="{success:scope.row.readstate == '1', warning:scope.row.readstate == '0'}"
            >{{scope.row.readstate == '0' ? '未查看' : '已查看'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>
<script>
export default {
  name: "bid-notice",
  data() {
    return {
      end_date: null,
      loading: false,
      stateOptions: [
        { label: "全部", value: "-1" },
        { label: "未查看", value: "0" },
        { label: "已查看", value: "1" }
        // { label: "已放弃", value: "2" }
      ],
      state: null,
      keyword: null,
      totalSize: 0,
      pageSize: 20,
      page: 1,
      tableData: []
    };
  },
  mounted() {
    this.loadNotices();
  },
  watch: {
    end_date() {
      this.search();
    },
    state() {
      this.search();
    }
  },
  methods: {
    search() {
      this.page = 1;
      this.loadNotices();
    },
    loadNotices() {
      this.loading = true;

      this.$post(
        {
          action: "P_SUP_Bid_GetNotice",
          p1: (this.$store.state.supinfo || {}).accountid || "",
          p2: this.$store.state.token || "",
          p3: this.page,
          p4: this.pageSize,
          p5: this.end_date || "",
          p6: this.state || "",
          p7: this.keyword || ""
        },
        res => {
          // console.log(res);
          this.loading = false;
          if (res.code == 0) {
            this.tableData = res["data"];
            if (this.tableData.length > 0) {
              this.totalSize = parseInt(this.tableData[0]["totalcount"]);
            }
          }
        }
      );
    },
    pageChange(val) {
      this.page = val;
      this.loadNotices();
    },
    selectItem(item) {
      // console.log(item);
      this.$router.push({
        path: "/bid_notice/" + `${item.noticeid}-${item.purchasematterid}`
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.home-main-wrap {
  padding-bottom: 20px;
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
    width: 240px !important;
  }
}
.notices {
  background: #fff;
  // margin-bottom: 30px;
  .name {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 2px;
      vertical-align: middle;
    }
    .unread {
      background: rgb(231, 90, 22);
      // color: #333 !important;
    }
    .read {
      background: #fff;
      // color: #999 !important;
    }
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


