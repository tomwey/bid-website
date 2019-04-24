<template>
  <div class="message-detail">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/messages' }">消息列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
      <h2 class="title">消息标题</h2>
      <p class="body">消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容内容消息内容消息内容消息内容消息内容</p>
      <el-button>点击查看</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "message-detail"
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
    font-size: 16px;
    color: #333;
  }
  .body {
    font-size: 14px;
    color: #333;
  }
  background: #fff;
  padding: 30px;
  min-height: 688px;
}
</style>



    