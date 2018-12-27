<template>
  <div class="company-achievement">
    <div class="box">
      <card-head title="公司业绩" @edit="edit"/>
      <table class="table">
        <tr>
          <td class="td-label">年产值额</td>
          <td class="td-value">30,000,000</td>
          <td class="td-label">年营业额</td>
          <td class="td-value">10,000,000</td>
        </tr>
      </table>
      <div class="man-wrap">
        <b-table striped hover responsive :items="achieveData" :fields="achieveFields"></b-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "company-achievement",
  components: {
    cardHead: function(resolve) {
      require(["@/components/profile/card-head"], resolve);
    }
  },
  data() {
    return {
      achieveData: [
        {
          city: "成都",
          projname: "枫丹铂麓一期",
          partnercompany: "成都建工集团",
          isgoodcompany: "是",
          projmanager: "张三",
          contractmoney: 300000,
          contractscale: "",
          startdate: "2018-10-10",
          enddate: "2018-12-30",
          memo: "测试",
          contractfile: null
        }
      ],
      achieveFields: {
        city: {
          label: "城市"
        },
        projname: {
          label: "项目名称"
        },
        partnercompany: {
          label: "合作单位名称"
        },
        isgoodcompany: {
          label: "是否标杆企业"
        },
        projmanager: {
          label: "项目经理"
        },
        contractmoney: {
          label: "合同金额"
        },
        contractscale: {
          label: "合同规模"
        },
        startdate: {
          label: "开始日期"
        },
        enddate: {
          label: "结束日期"
        },
        memo: {
          label: "其他说明"
        },
        contractfile: {
          label: "合同附件"
        }
      }
    };
  },
  methods: {
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

