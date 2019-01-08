<template>
  <div class="area">
    <div class="box">
      <card-head title="服务区域" step="3"/>
      <vertical-table :items="items" step="1"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "service-area",
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
          label: "服务区域",
          value: "",
          type: 1,
          field: "serverareaids"
        },
        {
          label: "主要服务区域",
          value: "",
          type: 1,
          field: "mainareaid"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
</style>

