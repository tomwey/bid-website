<template>
  <div class="company-achievement">
    <div class="box">
      <card-head title="公司业绩" step="5"/>
      <table class="table">
        <tr>
          <td class="td-label">年产值额</td>
          <td class="td-value">{{yearOutput}}</td>
          <td class="td-label">年营业额</td>
          <td class="td-value">{{yearSale}}</td>
        </tr>
      </table>
      <!-- <div class="man-wrap">
        <b-table striped hover responsive :items="achieveData" :fields="achieveFields"></b-table>
      </div>-->
      <horizontal-table :items="items" :fields="fields"/>

      <div class="empty-error-box" v-if="items.length === 0">暂无公司业绩</div>
    </div>
  </div>
</template>
<script>
import tableFields from "@/utils/table-fields";
export default {
  name: "company-achievement",
  components: {
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    },
    horizontalTable: function(resolve) {
      require(["@/components/profile/horizontal-table"], resolve);
    }
  },
  data() {
    return {
      achieveData: [],
      yearOutput: null,
      yearSale: null,

      items: [],
      fields: tableFields.achieve
    };
  },
  mounted() {
    this.yearOutput =
      (this.$store.state.supprofile["outputvalueyear"] || "--") + "万";
    this.yearSale =
      (this.$store.state.supprofile["turnoveryear"] || "--") + "万";

    this.items = this.$store.state.supprofile.yj_data || [];
  }
};
</script>
<style lang="scss" scoped>
.table {
  margin: 20px 0;
  padding: 0;
  width: 100%;
  td {
    border-top: 0;
    font-size: 14px;
  }

  .td-label {
    width: 80px;
    color: #999;
  }
  .td-value {
    color: #333;
  }
}

.man-wrap {
  padding-bottom: 60px;
}
</style>

