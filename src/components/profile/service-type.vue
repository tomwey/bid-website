<template>
  <div class="service-type">
    <b-row>
      <b-col cols="8">
        共
        <span class="digit">{{items.length}}</span>条联系方式
      </b-col>
      <b-col cols="4">
        <b-button v-b-modal.contactModal>新增服务类别</b-button>
      </b-col>
    </b-row>
    <!-- <b-table striped hover responsive :items="items" :fields="fields"></b-table> -->
    <horizontal-table :items="items" :fields="fields" :actions="actions"/>
    <div class="empty-error-box" v-if="items.length === 0">暂无服务类别</div>
    <!-- <div class="new-btn-wrap">
      <b-button v-b-modal.contactModal>新增联系方式</b-button>
    </div>-->
    <b-modal
      id="contactModal"
      centered
      :title="modalTitle || '新增服务类别'"
      ok-title="保存"
      ok-variant="danger"
      size="lg"
      cancel-title="取消"
      @ok="commit"
      @cancel="reset"
      @hide="reset"
    >
      <comm-fields :form-data="typeFormData" ref="form"/>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "service-type",
  // props: {
  //   items: Array,
  //   fields: Object
  // },
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
      modalTitle: null,
      serviceTypes: {},
      items: [],
      actions: [
        {
          name: "编辑"
        }
      ],
      fields: [
        {
          label: "对口服务类别",
          value: "servertype"
        },
        {
          label: "是否主要类别",
          value: "ismain"
        },
        {
          label: "资质名称",
          value: "quaname"
        },
        {
          label: "资质级别",
          value: "qualevel"
        },
        {
          label: "资质审核到期日期",
          value: "quaexaminedate"
        },
        {
          label: "其他说明",
          value: "othermemo"
        }
      ],
      serviceTypeItems: [],
      typeFormData: [
        {
          id: "service-type",
          type: 7,
          label: "对口服务类别",
          value: null,
          field: "servertype",
          required: true,
          options: []
        },
        {
          id: "is-main-type",
          label: "是否主要类别",
          field: "ismain",
          required: true,
          type: 5
        },
        {
          id: "zz-name",
          type: 1,
          subtype: "text",
          required: true,
          field: "quaname",
          label: "资质名称"
        },
        {
          id: "zz-level",
          type: 1,
          subtype: "text",
          field: "qualevel",
          label: "资质级别"
        },
        {
          id: "zz-approve-date",
          type: 1,
          subtype: "date",
          label: "资质审核到期日期",
          field: "quaexaminedate",
          required: true
        },
        {
          id: "memo",
          type: 1,
          subtype: "text",
          label: "其他说明",
          field: "othermemo",
          required: true
        }
      ]
    };
  },
  mounted() {
    this.loadConfigs();
    this.loadServiceTypeData();
  },
  methods: {
    loadServiceTypeData() {
      this.$post(
        {
          action: "P_SUP_GetSupInfo",
          p1: this.$store.state.token,
          p2: "4"
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
      this.$post(
        {
          action: "P_SY_GetAreaOrType",
          p1: "2",
          p2: "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];

            // console.log(arr);

            arr.forEach(ele => {
              temp.push({
                value: ele.suptypeid,
                text: ele.suptypename,
                childcount: ele.subcount
              });
            });

            // console.log(arr);

            this.typeFormData[0].options = temp;
          }
        }
      );
    },
    // resetForm() {},
    commit() {
      //   console.log(this.manFormData);
      let obj = {};
      // console.log(this.typeFormData);

      this.typeFormData.forEach(control => {
        if (control.type === 7) {
          // console.log(control);
          obj[control.field + "name"] = control.value.text;
          obj[control.field + "id"] = control.value.value;
        } else if (control.type === 5) {
          obj[control.field] = control.value === true ? "是" : "否";
        } else {
          obj[control.field] = control.value;
        }
      });

      // console.log(obj);

      this.items.push(obj);

      // this.reset();

      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
<style lang="scss" scoped>
.service-type {
  padding: 15px;

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


