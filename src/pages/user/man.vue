<template>
  <div class="man-list">
    <!-- <man-list :items="manData" :fields="manFields"/> -->
    <div class="box">
      <card-head title="联系方式" @edit="edit"/>
      <div class="man-wrap">
        <b-table striped hover responsive :items="manData" :fields="manFields"></b-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "man-list",
  components: {
    // manList: function(resolve) {
    //   require(["@/components/profile/man-list"], resolve);
    // },
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    }
  },
  data() {
    return {
      manData: [
        {
          typename: "普通联系人",
          job: "公司总经理",
          name: "张三",
          phone: "028-81234567",
          mobile: "13012345678",
          email: "",
          idcard: "",
          shebao: "",
          entrust: ""
        },
        {
          typename: "第一联系人",
          job: "公司总经理",
          name: "张三",
          phone: "028-81234567",
          mobile: "13012345678",
          email: "",
          idcard: "",
          shebao: "",
          entrust: ""
        }
      ],
      manFields: {
        typename: {
          label: "联系人类型"
        },
        job: {
          label: "联系人职位"
        },
        name: {
          label: "联系人姓名"
        },
        phone: {
          label: "联系人电话"
        },
        mobile: {
          label: "联系人手机"
        },
        email: {
          label: "电子邮件"
        },
        idcard: {
          label: "身份证号码"
        },
        shebao: {
          label: "联系人社保证明"
        },
        entrust: {
          label: "授权委托（附件）"
        }
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.man-list {
  .man-wrap {
    // padding: 15px 0;
  }
}
</style>

