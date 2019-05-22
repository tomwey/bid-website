<template>
  <div class="message-list">
    <div class="messages">
      <el-table :data="messages" stripe style="width: 100%">
        <el-table-column prop="msgtitle" label="标题">
          <template slot-scope="scope">
            <span
              class="title"
              :class="{unread:scope.row.readstate == '0', read:scope.row.readstate == '1'}"
              @click="showDetail(scope.row);"
            >{{scope.row.msgtitle}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdate" label="时间" width="180"></el-table-column>
        <el-table-column prop="msgtypename" label="消息类型" width="120">
          <template slot-scope="scope">
            <span
              class="message-type"
              :class="'type-' + scope.row.msgtype"
            >{{scope.row.msgtypename}}</span>
          </template>
        </el-table-column>
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
    },
    msgtype: {
      type: Number
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    showDetail(item) {
      // if (this.msgtype === 0) {
      let obj = Object.assign({}, this.$store.state.supinfo);
      let count = parseInt(obj.msgunreadcount || 0);
      if (count > 0 && item.readstate == "0") {
        obj.msgunreadcount = count - 1;
        this.$store.commit("updatesupinfo", obj);
      }
      // }
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
    padding-left: 10px;
    white-space: nowrap;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: rgb(231, 90, 22);
    }
    &.unread {
      position: relative;
      &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: block;
        background: rgb(231, 90, 22);
        position: absolute;
        top: 50%;
        margin-top: -3px;
        left: 0px;
      }
    }
    &.read {
      color: #888 !important;
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

.message-type {
  &.type-1 {
    color: #333;
  }

  &.type-2 {
    color: rgb(231, 90, 22);
  }

  &.type-3 {
    color: cornflowerblue;
  }

  &.type-4 {
    color: brown;
  }

  &.type-5 {
    color: darkolivegreen;
  }

  &.type-6 {
    color: fuchsia;
  }

  &.type-7 {
    color: goldenrod;
  }

  &.type-8 {
    color: green;
  }

  &.type-9 {
    color: khaki;
  }

  &.type-10 {
    color: lightblue;
  }

  &.type-11 {
    color: maroon;
  }

  &.type-12 {
    color: teal;
  }

  &.type-13 {
    color: saddlebrown;
  }

  &.type-14 {
    color: rosybrown;
  }
}
</style>


