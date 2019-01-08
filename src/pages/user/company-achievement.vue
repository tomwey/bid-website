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
    </div>
  </div>
</template>
<script>
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
      fields: [
        {
          label: "城市",
          value: "cityname"
        },
        {
          label: "项目名称",
          value: "projectname"
        },
        {
          label: "合作单位名称",
          value: "partnername"
        },
        {
          label: "是否标杆企业",
          value: "ismodel"
        },
        {
          label: "项目经理",
          value: "manager"
        },
        {
          label: "合同金额(万)",
          value: "contractmoney"
        },
        {
          label: "合同规模",
          value: "contractsize"
        },
        {
          label: "开始日期",
          value: "begindate"
        },
        {
          label: "结束日期",
          value: "enddate"
        },
        {
          label: "合同附件",
          value: "contractannex"
        },
        {
          label: "其他说明",
          value: "othermemo"
        }
      ]
    };
  },
  mounted() {
    // this.loadData();
    // this.loadData2();
    this.yearOutput =
      (this.$store.state.supprofile["outputvalueyear"] || "--") + "万";
    this.yearSale =
      (this.$store.state.supprofile["turnoveryear"] || "--") + "万";

    this.items = this.$store.state.supprofile.yj_data || [];
  },
  methods: {
    loadData2() {
      this.$post(
        {
          action: "P_SUP_GetSupInfo",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: "1"
        },
        res => {
          console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            // this.items = arr;
            if (arr.length > 0) {
              let obj = arr[0];
              this.yearOutput = obj["outputvalueyear"] + "万";
              this.yearSale = obj["turnoveryear"] + "万";
            }
          }
        }
      );
    },
    loadData() {
      this.$post(
        {
          action: "P_SUP_GetSupInfo",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: "5"
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            this.items = arr;
          }
        }
      );
    },
    edit() {
      // console.log("ddddddd");
      this.$router.push({ name: "profile", query: { s: 5 } });
    }
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

