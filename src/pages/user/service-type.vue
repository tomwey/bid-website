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
import tableFields from "@/utils/table-fields";
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
      fields: tableFields.serviceType
    };
  },
  mounted() {
    this.items = this.$store.state.supprofile.types || [];
  }
};
</script>
<style lang="scss" scoped>
</style>

