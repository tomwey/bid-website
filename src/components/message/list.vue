<template>
  <div class="message-list">
    <div class="messages">
      <el-table :data="messages" stripe style="width: 100%">
        <el-table-column prop="msgtitle" label="标题">
          <template slot-scope="scope">
            <span class="title" @click="showDetail(scope.row);">{{scope.row.msgtitle}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdate" label="时间" width="180"></el-table-column>
        <el-table-column prop="msgtype" label="消息类型" width="120"></el-table-column>
      </el-table>
    </div>
    <!-- <div class="empty-error-box" v-if="messages.length === 0">暂无消息</div> -->
  </div>
</template>
<script>
export default {
  name: "message-list",
  props: {
    messages: {
      type: Array
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    showDetail(item) {
      this.$router.push({ path: "/admin/messages/" + item.msgid });
    }
  }
};
</script>
<style lang="scss" scoped>
.messages {
  padding: 0 15px 15px;
  .title {
    // flex: 1;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: rgb(231, 90, 22);
    }
    // display: inline-block;
    // height: 100%;
    // line-height: 1;
    // vertical-align: middle;
  }
  .message {
    display: flex;
    border-bottom: 1px dashed #eee;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    // &:hover {
    //   background: #f2f2f2;
    // }
    .title,
    .time {
      margin: 0;
      padding: 15px 0;
    }
    // .title {
    //   flex: 1;
    //   color: #333;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   white-space: nowrap;
    //   &:hover {
    //     text-decoration: underline;
    //     cursor: pointer;
    //   }
    // }
    .time {
      flex: 0 0 150px;
      width: 150px;
      text-align: right;
      color: #999;
    }
  }
}
</style>


