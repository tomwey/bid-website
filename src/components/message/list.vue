<template>
  <div class="messages">
    <div class="message" v-for="(item,index) in messages" :key="index">
      <p class="title">{{item.title}}</p>
      <p class="time">{{item.time}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "message-list",
  props: ["messages"]
};
</script>
<style lang="scss" scoped>
.messages {
  padding: 0 15px 15px;
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
    .title {
      flex: 1;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      flex: 0 0 150px;
      width: 150px;
      text-align: right;
      color: #999;
    }
  }
}
</style>


