<template>
  <div class="man-list">
    <!-- <man-list :items="manData" :fields="manFields"/> -->
    <div class="box">
      <card-head title="联系方式" step="2"/>
      <div class>
        <horizontal-table :items="items" :fields="fields"/>
      </div>

      <div class="empty-error-box" v-if="items.length === 0">暂无联系方式</div>
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
          value: "contacttype",
          width: 150
        },
        {
          label: "联系人职位",
          value: "contactposition",
          width: 120
        },
        {
          label: "联系人姓名",
          value: "contactname",
          width: 120
        },
        {
          label: "联系人电话",
          value: "contacttel",
          width: 120
        },
        {
          label: "联系人手机",
          value: "contactphone",
          width: 120
        },
        {
          label: "电子邮件",
          value: "email",
          width: 120
        },
        {
          label: "身份证号码",
          value: "contactidno",
          width: 120
        },
        {
          label: "联系人社保证明",
          value: "sscertificateannex",
          width: 150
        },
        {
          label: "附件委托",
          value: "authdelegationannex",
          width: 150
        }
      ]
    };
  },
  mounted() {
    this.items = this.$store.state.supprofile.man || [];
  }
};
</script>
<style lang="scss" scoped>
</style>

