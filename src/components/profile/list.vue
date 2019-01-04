<template>
  <div class="list-wrap">
    <table class="table">
      <tr v-for="(item,index) in items" :key="index">
        <td class="td-label">{{item.label}}</td>
        <td class="td-value">
          <span v-if="item.type === 1">{{item.value}}</span>
          
          <img v-if="item.filetype === 'image'" :src="item.fileurl">
          <!-- <div v-if="item.filetype === 3" v-html="item.value"></div> -->
          <a
            :href="item.fileurl"
            v-if="item.filetype === 'file'"
            class="file-link"
            target="_blank"
          >{{item.filename}}</a>
        </td>
      </tr>
    </table>

    <div class="empty-error-box" v-if="!items || items.length === 0">暂无数据显示</div>
  </div>
</template>
<script>
export default {
  name: "list",
  props: {
    items: Array
  }
};
</script>
<style lang="scss" scoped>
.table {
  margin: 0;
  padding: 0;
  width: 100%;
  td {
    border-top: 0;
    vertical-align: top;
    padding: 0;
    margin: 0;
    padding: 10px 10px 0 0;
    font-size: 14px;
    // border-top: 1px dashed #eee;
  }

  .file-link {
    text-decoration: underline;
    color: #e46623;
  }

  .td-label {
    width: 30%;
    color: #999;
  }
  .td-value {
    width: 70%;
    color: #333;
    img {
      max-width: 200px;
      height: auto;
      margin: 0;
    }
  }
}
</style>


