<template>
  <div class="service-types">
    <div class="box">
      <card-head title="服务类别" @edit="edit"/>
      <div class="list-wrap">
        <b-table striped hover responsive :items="serviceTypeData" :fields="serviceTypeFields"></b-table>

        <div class="empty-error-box" v-if="serviceTypeData.length === 0">暂无服务类别</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "service-type",
  components: {
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    }
  },
  data() {
    return {
      serviceTypeData: [
        {
          typename: "类别1",
          ismaintype: "是",
          name: "测试名字",
          zz_level: "其他",
          zz_approve_date: "2018-12-21",
          memo: ""
        },
        {
          typename: "类别1",
          ismaintype: "是",
          name: "测试名字",
          zz_level: "其他",
          zz_approve_date: "2018-12-21",
          memo: ""
        }
      ],
      serviceTypeFields: {
        typename: {
          label: "对口服务类别"
        },
        ismaintype: {
          label: "是否主要类别"
        },
        name: {
          label: "资质名称"
        },
        zz_level: {
          label: "资质级别"
        },
        zz_approve_date: {
          label: "资质审核到期日期"
        },
        memo: {
          label: "其他说明"
        }
      }
    };
  },
  methods: {
    edit() {
      // console.log("ddddddd");
      this.$router.push({ name: "profile", query: { s: 4 } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

