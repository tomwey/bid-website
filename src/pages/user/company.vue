<template>
  <div class="company">
    <div class="box">
      <card-head title="基本信息" @edit="edit"/>
      <div class="list-box">
        <list :items="items"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "company",
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
        label: "企业名称",
        value: "成都建工集团",
        type: 1
      },
      {
        label: "企业性质",
        value: "私营企业",
        type: 1
      },
      {
        label: "统一社会信用代码",
        value: "91510100331069645M",
        type: 1
      },
      {
        label: "营业执照",
        value:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545890758605&di=ac9b5b54fc75d88a7017d36ba4407550&imgtype=0&src=http%3A%2F%2Fimg1.a.maoyia.com%2F201803%2F03%2F15%2F15-24-23-55-1405149.jpg",
        type: 2
      },
      {
        label: "纳税人状态",
        value: "小规模纳税人",
        type: 1
      },
      {
        label: "增值税一般纳税人申请认定表",
        value: "http://",
        type: 4
      },
      {
        label: "企业注册日期",
        value: "2015年4月23日",
        type: 1
      },
      {
        label: "企业注册地址",
        value: "成都市高新区府城大道234号",
        type: 1
      },
      {
        label: "注册资本",
        value: "500万",
        type: 1
      },
      {
        label: "法定代表人",
        value: "张三",
        type: 1
      },
      {
        label: "法定代表人身份证号",
        value: "51010619760101263X",
        type: 1
      },
      {
        label: "安全生产许可证",
        value: "http",
        type: 4
      },
      {
        label: "安全许可证到期日",
        value: "2015年4月23日",
        type: 1
      },
      {
        label: "体系认证",
        value: "9000:质量管理体系认证；18000系:职业健康安全管理体系认证",
        type: 1
      },
      {
        label: "质量保证体系认证文件",
        value: "http://",
        type: 4
      },
      {
        label: "管理体系认证（ISO9001/14001/HSE等附件）",
        value: "http://",
        type: 4
      },
      {
        label: "银行信用等级和授信额度（附件）",
        value: "http://",
        type: 4
      },
      {
        label: "（总部）办公地址",
        value: "成都市青羊区西大街25号",
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
<style lang="scss">
.list-box {
  padding: 15px 30px 60px;
}
</style>

<style lang="scss" scoped>
</style>

