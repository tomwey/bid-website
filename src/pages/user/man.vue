<template>
  <div class="man-list">
    <!-- <man-list :items="manData" :fields="manFields"/> -->
    <div class="box">
      <card-head title="联系方式" step="2"/>
      <horizontal-table :items="items" :fields="fields"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "man-list",
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
          label: "联系人类型",
          value: "contacttype"
        },
        {
          label: "联系人职位",
          value: "contactposition"
        },
        {
          label: "联系人姓名",
          value: "contactname"
        },
        {
          label: "联系人电话",
          value: "contacttel"
        },
        {
          label: "联系人手机",
          value: "contactphone"
        },
        {
          label: "电子邮件",
          value: "email"
        },
        {
          label: "身份证号码",
          value: "contactidno"
        },
        {
          label: "联系人社保证明",
          value: "sscertificateannex"
        },
        {
          label: "附件委托",
          value: "authdelegationannex"
        }
      ]
    };
  },
  mounted() {
    this.items = this.$store.state.supprofile.man;
  }
};
</script>
<style lang="scss" scoped>
</style>

