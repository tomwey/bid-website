<template>
  <div class="man-list">
    <b-row v-if="items.length > 0">
      <b-col cols="8">
        共
        <span class="digit">2</span>条联系方式
      </b-col>
      <b-col cols="4">
        <b-button v-b-modal.contactModal>新增联系方式</b-button>
      </b-col>
    </b-row>
    <b-table striped hover responsive="lg" :items="items" :fields="fields"></b-table>

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
    items: Array,
    fields: Object
  },
  components: {
    commFields: function(resolve) {
      require(["@/components/profile/comm-fields"], resolve);
    }
  },
  data() {
    return {
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
            },
            {
              value: "第一联系人",
              text: "第一联系人"
            },
            {
              value: "普通联系人",
              text: "普通联系人"
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
          options: [
            {
              value: null,
              text: "选择联系人职位"
            },
            {
              value: "公司总经理",
              text: "公司总经理"
            },
            {
              value: "分管经营负责人",
              text: "分管经营负责人"
            },
            {
              value: "业务对接人",
              text: "业务对接人"
            },
            {
              value: "其他",
              text: "其他"
            }
          ]
        },
        {
          id: "name",
          label: "联系人姓名",
          required: true,
          field: "contactname",
          type: 1,
          subtype: "text"
        },
        {
          id: "phone",
          label: "联系人电话",
          required: true,
          field: "contacttel",
          type: 1,
          subtype: "tel"
        },
        {
          id: "mobile",
          label: "联系人手机",
          required: true,
          type: 1,
          field: "contactphone",
          subtype: "tel"
        },
        {
          id: "email",
          label: "电子邮件",
          required: false,
          type: 1,
          field: "email",
          subtype: "email"
        },
        {
          id: "idcard",
          label: "身份证号码",
          required: false,
          field: "contactidno",
          type: 1,
          subtype: "text"
        }
      ]
    };
  },
  methods: {
    // resetForm() {},
    commit() {
      //   console.log(this.manFormData);
      this.reset();

      console.log(this.manFormData);

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
      //   console.log(val);
      if (val === "第一联系人") {
        if (this.manFormData.length === 7) {
          const fields = [
            {
              id: "shebao",
              label: "联系人社保证明",
              required: true,
              field: "sscertificateannex",
              type: 4
              //   subtype: "text"
            },
            {
              id: "entrust",
              label: "授权委托（附件）",
              required: true,
              field: "authdelegationannex",
              type: 4
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

