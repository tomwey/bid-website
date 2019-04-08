<template>
  <div class="bid-list">
    <!-- 即将上线... -->
    <h2 class="title">招标事项列表</h2>
    <div class="list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="招标事项">
          <template slot-scope="scope">
            <span class="name" @click="selectItem(scope.row)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="时间" width="140"></el-table-column>
        <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '已通过'">{{scope.row.state}}</el-tag>
            <el-tag type="info" v-if="scope.row.state == '已放弃'">{{scope.row.state}}</el-tag>
            <el-tag type="warning" v-if="scope.row.state == '审核中'">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <!-- <el-button type="success" size="small">报名</el-button> -->
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
      title="放弃投标"
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
  name: "bid-list",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
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
          state: "已放弃",
          id: 110
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "审核中",
          id: 111
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已通过",
          id: 112
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已通过",
          id: 113
        },
        {
          title: "合能集团成都公司总包招投标",
          date: "2019-03-13",
          state: "已通过",
          id: 114
        }
      ]
    };
  },
  watch: {
    $route: function(to) {
      console.log(to);
    }
  },
  methods: {
    selectItem(item) {
      this.$router.push({ path: "/admin/bids/" + item.id });
    },
    abandon() {
      this.dialogFormVisible = true;
    },
    commit() {}
  }
};
</script>
<style lang="scss" scoped>
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
</style>

