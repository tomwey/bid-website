<template>
  <div class="company">
    <div class="box">
      <card-head title="基本信息" step="1"/>
      <vertical-table :items="items" step="1"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "company",
  components: {
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    },
    verticalTable: function(resolve) {
      require(["@/components/profile/vertical-table"], resolve);
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
        value: "",
        type: 1,
        field: "comname"
      },
      {
        label: "企业性质",
        value: "",
        type: 1,
        field: "comtype"
      },
      {
        label: "统一社会信用代码",
        value: "",
        field: "comuscc",
        type: 1
      },
      {
        label: "统一社会信用代码有效期",
        value: "",
        field: "comusccinvaliddate",
        type: 1
      },
      {
        label: "营业执照",
        value: "",
        field: "combi",
        type: 2
      },
      {
        label: "纳税人状态",
        value: "",
        field: "taxpayerstate",
        type: 1
      },
      {
        label: "增值税一般纳税人申请认定表",
        value: "",
        field: "addtaxapplytable",
        type: 4
      },
      {
        label: "企业注册日期",
        value: "",
        field: "comregdate",
        type: 1
      },
      {
        label: "企业注册地址",
        value: "",
        field: "comregaddr",
        type: 1
      },
      {
        label: "注册资本",
        value: "",
        field: "regmoney",
        type: 1
      },
      {
        label: "法定代表人",
        value: "",
        field: "corporateman",
        type: 1
      },
      {
        label: "法定代表人身份证号",
        value: "",
        field: "corporatemanidno",
        type: 1
      },
      {
        label: "安全生产许可证",
        value: "",
        field: "safeproductionl",
        type: 4
      },
      {
        label: "安全许可证到期日",
        value: "",
        field: "safeproductionldate",
        type: 1
      },
      {
        label: "体系认证",
        value: "",
        field: "sysauth",
        type: 1
      },
      {
        label: "质量保证体系认证文件",
        value: "",
        field: "quaauthannex",
        type: 4
      },
      {
        label: "管理体系认证（ISO9001/14001/HSE等附件）",
        value: "",
        field: "manageauthannex",
        type: 4
      },
      {
        label: "银行信用等级和授信额度（附件）",
        value: "",
        field: "banklevelandcredit",
        type: 4
      },
      {
        label: "（总部）办公地址",
        value: "",
        field: "hqaddr",
        type: 1
      }
    ];
  },
  methods: {
    edit() {
      // console.log("ddddddd");
      this.$router.push({ name: "profile", query: { s: 1 } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

