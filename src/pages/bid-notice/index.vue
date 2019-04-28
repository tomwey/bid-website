<template>
  <div class="home-main-wrap container">
    <!-- <div class="search-toolbar">
      <el-row>
        <el-col :span="8">
          <span class="label">报名截止时间:</span>
          <el-date-picker v-model="end_date" type="date" placeholder="选择日期"></el-date-picker>
        </el-col>
        <el-col :span="8">
          <span class="label">报名状态:</span>
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
        <el-table-column prop="name" label="标题">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row);">
              <span class="unread dot" v-if="scope.row.unread"></span>
              <span class="read dot" v-if="!scope.row.unread"></span>
              {{scope.row.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="publish_date" label="发布时间" width="120"></el-table-column>
        <el-table-column prop="expire_date" label="报名截止时间" width="180"></el-table-column>
        <el-table-column label="报名状态" width="120">
          <template slot-scope="scope">
            <span
              class="state-tag"
              :class="{success:scope.row.state == '已报名', info:scope.row.state == '已放弃', warning:scope.row.state == '报名中', danger:scope.row.state == '未通过'}"
            >{{scope.row.state}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="50"
        :page-size="20"
        :current-page="1"
      ></el-pagination>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "bid-notice",
  data() {
    return {
      end_date: null,
      stateOptions: [
        { label: "全部", value: "-1" },
        { label: "报名中", value: "0" },
        { label: "已过期", value: "1" },
        { label: "已放弃", value: "2" }
      ],
      state: null,
      keyword: null,
      tableData: [
        {
          id: 111,
          name:
            "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "已报名",
          type: "success",
          unread: true
        },
        {
          id: 114,
          name:
            "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告合能地产集团成都公司枫丹西悦二期渠道",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "已放弃",
          type: "danger",
          unread: true
        },
        {
          id: 115,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "已过期",
          type: "info",
          unread: true
        },
        {
          id: 116,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 117,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 118,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 119,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 120,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 121,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 122,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        },
        {
          id: 123,
          name: "合能地产集团成都公司枫丹西悦二期渠道合作公司招标公告",
          publish_date: "2019-01-01",
          expire_date: "2019-01-05 18:30",
          state: "报名中",
          type: "warning"
        }
      ]
    };
  },
  methods: {
    search() {},
    selectItem(item) {
      // console.log(item);
      this.$router.push({ path: "/bid_notice/" + item.id });
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


