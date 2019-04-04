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
        <el-table-column prop="state" label="状态" width="120"></el-table-column>
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
  </div>
</template>
<script>
export default {
  name: "bid-list",
  data() {
    return {
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
    }
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

