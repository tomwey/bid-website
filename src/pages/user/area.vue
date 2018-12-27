<template>
  <div class="area">
    <div class="box">
      <card-head title="服务区域" @edit="edit"/>
      <div class="list-box">
        <list :items="items"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "service-area",
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
        label: "服务区域",
        value: "成都；西安；长沙",
        type: 1
      },
      {
        label: "主要服务区域",
        value: "成都",
        type: 1
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

