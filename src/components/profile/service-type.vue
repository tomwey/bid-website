<template>
  <div class="service-type">
    <b-row>
      <b-col cols="8">
        共
        <span class="digit">2</span>条联系方式
      </b-col>
      <b-col cols="4">
        <b-button v-b-modal.contactModal>新增服务类别</b-button>
      </b-col>
    </b-row>
    <b-table striped hover responsive :items="items" :fields="fields"></b-table>

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
      typeFormData: [
        {
          id: "service-type",
          type: 2,
          label: "对口服务类别",
          value: null,
          options: [
            {
              value: null,
              text: "选择对口服务类别"
            },
            {
              value: "类别1",
              text: "类别1"
            },
            {
              value: "类别2",
              text: "类别2"
            }
          ]
        },
        {
          id: "is-main-type",
          label: "是否主要类别",
          type: 5
        },
        {
          id: "zz-name",
          type: 1,
          subtype: "text",
          label: "资质名称"
        },
        {
          id: "zz-level",
          type: 2,
          label: "资质级别",
          value: null,
          options: [
            {
              value: null,
              text: "选择资质级别"
            },
            {
              value: "壹级",
              text: "壹级"
            },
            {
              value: "贰级",
              text: "贰级"
            },
            {
              value: "叁级",
              text: "叁级"
            },
            {
              value: "其他",
              text: "其他"
            }
          ]
        },
        {
          id: "zz-approve-date",
          type: 1,
          subtype: "date",
          label: "资质审核到期日期"
        },
        {
          id: "memo",
          type: 1,
          subtype: "text",
          label: "其他说明"
        }
      ]
    };
  },
  methods: {
    // resetForm() {},
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


