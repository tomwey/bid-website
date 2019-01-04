<template>
  <div class="area">
    <div class="box">
      <card-head title="服务区域" @edit="edit"/>
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
      items: []
    };
  },
  mounted() {
    this.items = [
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
    ];
  },
  methods: {
    edit() {
      // console.log("ddddddd");
      this.$router.push({ name: "profile", query: { s: 3 } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

