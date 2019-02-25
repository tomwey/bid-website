<template>
  <div class="company-achieve">
    <table class="table">
      <tr>
        <td class="label">
          <label for="year-output">年产值额</label>
        </td>
        <td class="input-control">
          <b-input-group append="万">
            <b-form-input
              id="year-output"
              v-model="yearData.output"
              placeholder="输入年产值额"
              type="number"
            ></b-form-input>
          </b-input-group>
        </td>
        <td class="label">
          <label for="year-sale">年营业额</label>
        </td>
        <td class="input-control">
          <b-input-group append="万">
            <b-form-input id="year-sale" v-model="yearData.sale" placeholder="输入年营业额" type="number"></b-form-input>
          </b-input-group>
        </td>
      </tr>
    </table>

    <b-row>
      <b-col cols="8">
        共
        <span class="digit">{{items.length}}</span>条公司业绩
      </b-col>
      <b-col cols="4" style="text-align: right;">
        <b-button v-b-modal.yjModal>新增公司业绩</b-button>
      </b-col>
    </b-row>

    <!-- <b-table striped hover responsive :items="items" :fields="fields"></b-table> -->
    <horizontal-table :items="items" :fields="fields"/>

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
    // fields: Object,
    yearData: Object
  },
  components: {
    commFields: function(resolve) {
      require(["@/components/profile/comm-fields"], resolve);
    },
    horizontalTable: function(resolve) {
      require(["@/components/profile/horizontal-table"], resolve);
    }
  },
  data() {
    return {
      // items: [],
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
          label: "合同体量",
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
      ],
      modalTitle: null,
      yjFormData: [
        {
          id: "city",
          type: 1,
          subtype: "text",
          required: true,
          field: "cityname",
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
          label: "是否标杆企业（地产前100强为标杆企业）"
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
          label: "合同金额",
          append: "万"
        },
        {
          id: "contract-scale",
          type: 1,
          subtype: "text",
          field: "contractsize",
          required: true,
          label: "合同体量"
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
          domanid: this.$store.state.supinfo.accountid || "0",
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
  mounted() {
    this.items = this.$store.state.supprofile.yj_data || [];
  },
  methods: {
    commit() {
      //   console.log(this.manFormData);
      // this.reset();
      let obj = {};

      for (let i = 0; i < this.yjFormData.length; i++) {
        const control = this.yjFormData[i];

        if (control.subtype === "date") {
          if (control.value) {
            let val = control.value
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "");
            let reg = new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/);
            if (!reg.test(val)) {
              alert(control.label + "不正确");
              return;
            }
          }
        }

        if (control.type === 5) {
          obj[control.field] = control.value === true ? "是" : "否";
        } else {
          obj[control.field] = control.value;
        }
      }

      // this.yjFormData.forEach(control => {
      //   if (control.type === 5) {
      //     obj[control.field] = control.value === true ? "是" : "否";
      //   } else {
      //     obj[control.field] = control.value;
      //   }
      // });

      this.items.push(obj);

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


