<template>
  <div class="company-achieve">
    <table class="table">
      <tr>
        <td class="label">
          <label for="year-output">年产值额</label>
        </td>
        <td class="input-control">
          <b-form-input id="year-output" v-model="yearOutput" placeholder="输入年产值额" type="number"></b-form-input>
        </td>
        <td class="label">
          <label for="year-sale">年营业额</label>
        </td>
        <td class="input-control">
          <b-form-input id="year-sale" v-model="yearSale" placeholder="输入年营业额" type="number"></b-form-input>
        </td>
      </tr>
    </table>

    <b-row v-if="items.length > 0">
      <b-col cols="8">
        共
        <span class="digit">{{items.length}}</span>条公司业绩
      </b-col>
      <b-col cols="4" style="text-align: right;">
        <b-button v-b-modal.yjModal>新增公司业绩</b-button>
      </b-col>
    </b-row>

    <b-table striped hover responsive :items="items" :fields="fields"></b-table>

    <div class="empty-error-box" v-if="items.length === 0">暂无公司业绩</div>

    <b-modal
      id="yjModal"
      centered
      :title="modalTitle || '新增公司业绩'"
      ok-title="保存"
      ok-variant="danger"
      size="lg"
      cancel-title="取消"
      @ok="commit"
      @cancel="reset"
      @hide="reset"
    >
      <comm-fields :form-data="yjFormData" ref="form"/>
    </b-modal>
  </div>
</template>
<script>
// import CommFields from "@/components/profile/comm-fields";

export default {
  name: "company-achieve",
  props: {
    items: Array,
    fields: Object,
    yearOutput: String,
    yearSale: String
  },
  components: {
    commFields: function(resolve) {
      require(["@/components/profile/comm-fields"], resolve);
    }
  },
  data() {
    return {
      modalTitle: null,
      yjFormData: [
        {
          id: "city",
          type: 1,
          subtype: "text",
          required: true,
          field: "city",
          label: "城市"
        },
        {
          id: "proj-name",
          type: 1,
          subtype: "text",
          required: true,
          field: "projectname",
          label: "项目名称"
        },
        {
          id: "partner-company",
          type: 1,
          subtype: "text",
          required: true,
          field: "partnername",
          label: "合作单位名称"
        },
        {
          id: "is-good-company",
          type: 5,
          field: "ismodel",
          required: true,
          label: "是否标杆企业"
        },
        {
          id: "proj-manager",
          type: 1,
          subtype: "text",
          required: true,
          field: "manager",
          label: "项目经理"
        },
        {
          id: "contract-money",
          type: 1,
          subtype: "number",
          required: true,
          field: "contractmoney",
          label: "合同金额"
        },
        {
          id: "contract-scale",
          type: 1,
          subtype: "number",
          field: "contractsize",
          required: true,
          label: "合同规模"
        },
        {
          id: "start-date",
          type: 1,
          subtype: "date",
          required: true,
          field: "begindate",
          label: "开始日期"
        },
        {
          id: "end-date",
          type: 1,
          subtype: "date",
          required: true,
          field: "enddate",
          label: "结束日期"
        },
        {
          id: "contract-file",
          type: 4,
          required: true,
          label: "合同附件",
          field: "contractannex",
          domanid: (
            JSON.parse(localStorage.getItem("userinfo")).accountid || ""
          ).toString(),
          tablename: "H_Sup_Achievement_Info",
          fieldname: "contractannex"
        },
        {
          id: "summary",
          type: 1,
          subtype: "text",
          required: false,
          field: "othermemo",
          label: "其他说明"
        }
      ]
    };
  },
  methods: {
    commit() {
      //   console.log(this.manFormData);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
<style lang="scss" scoped>
.company-achieve {
  padding: 0 20px;

  .digit {
    padding-right: 4px;
    color: #e46623;
  }

  .row {
    margin: 20px 0 20px;
    padding: 0;
    .col-8 {
      font-size: 16px;
      padding: 0;
      padding-top: 10px;
    }
    .col-4 {
      text-align: right;
      padding: 0;
    }
  }
}
.table {
  margin: 0;
  padding: 0;
  td {
    border-top: 0;
    vertical-align: middle;
  }

  .label {
    width: 80px;
    &:first-child {
      padding-left: 0;
      padding-right: 0;
    }

    label {
      vertical-align: middle;
      line-height: 14px;
      /* padding: 0; */
      margin: 0;
    }
    // .required {
    //   color: $theme-color;
    //   font-size: 12px;
    // }
  }

  .input-control {
    width: calc(100% - 160px) / 2;
    padding-left: 0;
    &:last-child {
      padding-right: 0;
    }
  }
}
</style>


