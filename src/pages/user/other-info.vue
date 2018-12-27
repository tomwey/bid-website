<template>
  <div class="other-info-list">
    <div class="box">
      <card-head title="其他信息" @edit="edit"/>
      <div class="list-box">
        <list :items="items"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "other-info",
  components: {
    list: function(resolve) {
      require(["@/components/profile/list"], resolve);
    },
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    }
  },
  data() {
    return {
      items: []
    };
  },
  mounted() {
    this.items = [
      {
        label: "分公司信息",
        value: "成都第八建筑有限公司",
        type: 1
      },
      {
        label: "关联公司信息",
        value: "成都三合科技有限公司；成都由乙方科技有限公司",
        type: 1
      }
    ];
  }
};
</script>
<style lang="scss" scoped>
</style>

