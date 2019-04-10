<template>
  <div class="bid-list">
    <!-- 即将上线... -->
    <h2 class="title">报名通知列表</h2>
    <div class="search-toolbar">
      <el-row>
        <el-col :span="8">
          <span class="label">截止时间:</span>
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
    <div class="list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="招标事项">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="截止时间" width="140"></el-table-column>
        <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">
            <span
              class="state-tag"
              :class="{success:scope.row.state == '已报名', info:scope.row.state == '已查看',warning:scope.row.state == '未查看'}"
            >{{scope.row.state}}</span>
            <!-- <el-tag type="success" v-if="scope.row.state == '已报名'">{{scope.row.state}}</el-tag>
            <el-tag type="info" v-if="scope.row.state == '已查看'">{{scope.row.state}}</el-tag>
            <el-tag type="warning" v-if="scope.row.state == '未查看'">{{scope.row.state}}</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small">报名</el-button>&nbsp;
            <el-button type="danger" size="small" @click="abandon">放弃</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="50"
          :page-size="20"
          :current-page="1"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="放弃报名"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <form-fields
        form-ref="form"
        ref="dialogForm"
        :controls="applyControls"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bid-notify-list",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    //业务量饱和、招标业务体量不匹配、支付方式不接受、对我司合作评估不佳、其他
    return {
      dialogFormVisible: false,
      applyControls: [
        {
          field: "reason",
          type: 2,
          label: "放弃原因",
          options: [
            {
              label: "业务量饱和",
              value: "业务量饱和"
            },
            {
              label: "招标业务体量不匹配",
              value: "招标业务体量不匹配"
            },
            {
              label: "支付方式不接受",
              value: "支付方式不接受"
            },
            {
              label: "对我司合作评估不佳",
              value: "对我司合作评估不佳"
            },
            {
              label: "其他",
              value: "其他"
            }
          ]
        },
        {
          field: "file",
          type: 8,
          label: "放弃函件"
          // subtype: "textarea"
        },
        {
          field: "memo",
          type: 1,
          label: "备注信息",
          subtype: "textarea"
        }
      ],
      applyFormModel: {},
      tableData: [
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已查看",
          id: 110
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "未查看",
          id: 111
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已报名",
          id: 112
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已查看",
          id: 110
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "未查看",
          id: 111
        },
        // {
        //   title: "合能集团成都公司总包招投标",
        //   date: "2019-03-13",
        //   state: "已报名",
        //   id: 112
        // },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已查看",
          id: 110
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "未查看",
          id: 111
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已报名",
          id: 112
        }
      ]
    };
  },
  watch: {
    $route: function(to) {
      // console.log(to);
    }
  },
  methods: {
    selectItem(item) {
      this.$router.push({ path: "/admin/apply-bid/" + item.id });
    },
    abandon() {
      this.dialogFormVisible = true;
    },
    commit() {}
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  color: #333;
}
.title {
  font-size: 16px;
  color: #333;
  padding: 15px 10px;
  border-bottom: 1px solid #f2f2f2;
}

.bid-list {
  background: #fff;
  .name {
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
    width: 120px !important;
  }
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
}
</style>

