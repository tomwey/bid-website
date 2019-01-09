<template>
  <div class="service-types">
    <div class="box">
      <card-head title="服务类别" step="4"/>
      <div class="list-wrap">
        <!-- <b-table striped hover responsive :items="serviceTypeData" :fields="serviceTypeFields"></b-table> -->
        <horizontal-table :items="items" :fields="fields"/>
        <div class="empty-error-box" v-if="items.length === 0">暂无服务类别</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "service-type",
  components: {
    horizontalTable: function(resolve) {
      require(["@/components/profile/horizontal-table"], resolve);
    },
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    }
  },
  data() {
    return {
      items: [],
      fields: [
        {
          label: "对口服务类别",
          value: "servertype"
        },
        {
          label: "是否主要类别",
          value: "ismain"
        },
        {
          label: "资质名称",
          value: "quaname"
        },
        {
          label: "资质级别",
          value: "qualevel"
        },
        {
          label: "资质审核到期日期",
          value: "quaexaminedate"
        },
        {
          label: "其他说明",
          value: "othermemo"
        }
      ]
    };
  },
  mounted() {
    this.items = this.$store.state.supprofile.types || [];
  }
};
</script>
<style lang="scss" scoped>
</style>

