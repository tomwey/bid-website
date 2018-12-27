<template>
  <div class="company">
    <div class="box">
      <card-head title="基本信息" @edit="edit"/>
      <div class="list-box">
        <list :items="items"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "company",
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
        label: "企业名称",
        value: "成都建工集团",
        type: 1
      }
    ];
  },
  methods: {
    edit() {
      console.log("ddddddd");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

