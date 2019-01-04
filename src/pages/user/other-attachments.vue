<template>
  <div class="other-attachments">
    <div class="box">
      <card-head title="其他附件" @edit="edit"/>
      <vertical-table :items="items" step="7"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "other-attachments",
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
        label: "近三年财务审计报告（附件）",
        value: "",
        type: 4,
        field: "threeyfinancialreports"
      },
      {
        label: "认证或荣誉证书（附件）",
        value: "",
        type: 4,
        field: "honorcertificate"
      },
      {
        label: "外地备案证（附件）",
        value: "",
        type: 4,
        field: "fieldcertificate"
      }
    ];
  },
  methods: {
    edit() {
      // console.log("ddddddd");
      this.$router.push({ name: "profile", query: { s: 7 } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

