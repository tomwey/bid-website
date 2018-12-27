<template>
  <div class="other-attachments">
    <div class="box">
      <card-head title="其他附件" @edit="edit"/>
      <div class="list-box">
        <list :items="items"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "other-attachments",
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
        label: "近三年财务审计报告（附件）",
        value: "http://",
        type: 4
      },
      {
        label: "认证或荣誉证书（附件）",
        value: "http://",
        type: 4
      },
      {
        label: "外地备案证（附件）",
        value: "http://",
        type: 4
      }
    ];
  }
};
</script>
<style lang="scss" scoped>
</style>

