<template>
  <div class="list-wrap">
    <table class="table">
      <tr v-for="(item,index) in items" :key="index">
        <td class="label">{{item.label}}</td>
        <td class="value">
          <span v-if="item.type === 1">{{item.value}}</span>
          <img v-if="item.type === 2" :src="item.value">
          <div v-if="item.type === 3" v-html="item.value"></div>
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
</style>


