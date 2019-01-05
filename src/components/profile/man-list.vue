<template>
  <div class="man-list">
    <b-row>
      <b-col cols="8">
        共
        <span class="digit">{{items.length}}</span>条联系方式
      </b-col>
      <b-col cols="4">
        <b-button v-b-modal.contactModal>新增联系方式</b-button>
      </b-col>
    </b-row>
    <horizontal-table :items="items" :fields="fields" :actions="actions"/>
    <!-- <b-table striped hover responsive="lg" :items="items" :fields="fields"></b-table> -->
    <div class="empty-error-box" v-if="items.length === 0">暂无联系方式</div>
    <!-- <div class="new-btn-wrap">
      <b-button v-b-modal.contactModal>新增联系方式</b-button>
    </div>-->
    <b-modal
      id="contactModal"
      centered
      :title="modalTitle || '新增联系方式'"
      ok-title="保存"
      ok-variant="danger"
      size="lg"
      cancel-title="取消"
      @ok="commit"
      @cancel="reset"
      @hide="reset"
    >
      <comm-fields :form-data="manFormData" ref="form"/>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "man-list",
  props: {
    items: Array
    //   fields: Object
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
      actions: [
        // {
        //   name: "删除"
        // },
        {
          name: "编辑"
        }
      ],
      modalTitle: null,
      manFormData: [
        {
          id: "contact-type",
          label: "联系人类型",
          type: 2,
          required: true,
          value: null,
          field: "contacttype",
          options: [
            {
              value: null,
              text: "选择联系人类型"
            }
          ],
          changeFunc: this.changeContactType
        },
        {
          id: "contact-job",
          label: "联系人职位",
          type: 2,
          value: null,
          required: true,
          field: "contactposition",
          options: []
        },
        {
          id: "name",
          label: "联系人姓名",
          required: true,
          field: "contactname",
          type: 1,
          subtype: "text"
          // value: null
        },
        {
          id: "phone",
          label: "联系人电话",
          required: true,
          field: "contacttel",
          type: 1,
          subtype: "tel"
          // value: null
        },
        {
          id: "mobile",
          label: "联系人手机",
          required: true,
          type: 1,
          field: "contactphone",
          subtype: "tel"
          // value: null
        },
        {
          id: "email",
          label: "电子邮件",
          required: false,
          type: 1,
          field: "email",
          subtype: "email"
          // value: null
        },
        {
          id: "idcard",
          label: "身份证号码",
          required: false,
          field: "contactidno",
          type: 1,
          subtype: "text"
          // value: null
        }
      ],
      // items: [],
      fields: [
        {
          label: "联系人类型",
          value: "contacttype"
        },
        {
          label: "联系人职位",
          value: "contactposition"
        },
        {
          label: "联系人姓名",
          value: "contactname"
        },
        {
          label: "联系人电话",
          value: "contacttel"
        },
        {
          label: "联系人手机",
          value: "contactphone"
        },
        {
          label: "电子邮件",
          value: "email"
        },
        {
          label: "身份证号码",
          value: "contactidno"
        },
        {
          label: "联系人社保证明",
          value: "sscertificateannex"
        },
        {
          label: "附件委托",
          value: "authdelegationannex"
        },
        {
          label: "操作",
          value: "actions"
        }
      ]
    };
  },
  mounted() {
    this.loadConfigs();
    this.loadManData();
  },
  methods: {
    loadManData() {
      // console.log(123);
      this.$post(
        {
          action: "P_SUP_GetSupInfo",
          p1: this.$store.state.token,
          p2: "2"
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            this.items = res.data;
          } else {
          }
        }
      );
    },
    loadConfigs() {
      // 联系人类型
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "3",
          p2: "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [
              {
                value: null,
                text: "请选择联系人类型"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: `${ele.sy_name}-${ele.sy_value}`,
                text: ele.sy_name
              });
            });
            this.manFormData[0].options = temp;
          }
        }
      );

      // 联系人职位
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "4",
          p2: "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [
              {
                value: null,
                text: "请选择联系人职位"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: `${ele.sy_name}-${ele.sy_value}`,
                text: ele.sy_name
              });
            });
            this.manFormData[1].options = temp;
          }
        }
      );
    },
    // resetForm() {},
    commit() {
      // let temp = [];
      let obj = {};
      this.manFormData.forEach(control => {
        if (control.type === 2) {
          obj[control.field] = control.value.split("-")[0];
        } else {
          obj[control.field] = control.value;
        }
      });

      this.items.push(obj);

      this.reset();

      // this.items = this.items.push()
    },
    reset() {
      this.$refs.form.reset();
      if (this.manFormData.length === 9) {
        this.manFormData.splice(this.manFormData.length - 1, 1);
        this.manFormData.splice(this.manFormData.length - 1, 1);
      }
    },
    changeContactType(val) {
      // console.log(val);
      if (!val) return;

      val = val.split("-");
      if (val.length !== 2) return;
      val = val[1];

      if (val === "1") {
        if (this.manFormData.length === 7) {
          const fields = [
            {
              id: "shebao",
              label: "联系人社保证明",
              required: true,
              field: "sscertificateannex",
              type: 4,
              subtype: 1,
              domanid: this.$store.state.supinfo.accountid || "0",
              tablename: "H_Sup_Contact_Info",
              fieldname: "sscertificateannex"
            },
            {
              id: "entrust",
              label: "授权委托（附件）",
              required: true,
              field: "authdelegationannex",
              type: 4,
              subtype: 2, // 普通文件
              domanid: this.$store.state.supinfo.accountid || "0",
              tablename: "H_Sup_Contact_Info",
              fieldname: "authdelegationannex"
              //   subtype: "text"
            }
          ];
          this.manFormData = this.manFormData.concat(fields);
        }
      } else {
        if (this.manFormData.length === 9) {
          this.manFormData.splice(this.manFormData.length - 1, 1);
          this.manFormData.splice(this.manFormData.length - 1, 1);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.man-list {
  padding: 15px;
  .total-text {
    font-size: 16px;
  }

  .new-btn-wrap {
    text-align: center;
    padding: 30px;
  }

  .digit {
    color: #e46623;
    // padding: 0 2px;
    padding-right: 2px;
  }
  .row {
    margin: 0 0 20px;
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
</style>

