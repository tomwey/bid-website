<template>
  <div class="other-info-list">
    <div class="box">
      <card-head title="其他信息" step="6"/>
      <vertical-table :items="items" step="1"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "other-info",
  components: {
    verticalTable: function(resolve) {
      require(["@/components/profile/vertical-table"], resolve);
    },
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    }
  },
  data() {
    return {
      items: [
        {
          label: "分公司信息",
          value: "",
          type: 1,
          field: "branchinfo"
        },
        {
          label: "关联公司信息",
          value: "",
          type: 1,
          field: "relateinfo"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
</style>

