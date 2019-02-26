<template>
  <div class="comm-form-list">
    <b-row>
      <b-col cols="8">
        共
        <span class="digit">{{items.length}}</span>
        条{{this.name}}
      </b-col>
      <b-col cols="4" class="hn-btn-style">
        <b-button @click="newItem">新增{{this.name}}</b-button>
      </b-col>
    </b-row>
    <horizontal-table
      :items="items"
      @actionclick="actionClick"
      :fields="fields"
      :actions="actions"
    />
    <div class="empty-error-box" v-if="items.length === 0">暂无{{this.name}}</div>

    <b-modal
      id="formModal"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      centered
      size="lg"
      :title="'新增' + this.name"
      ref="formModal"
    >
      <b-form ref="form">
        <comm-fields :form-data="formData" @change="changeValue"/>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <div class="modal-btns">
          <span class="hn2-btn cancel" @click="cancel">取&emsp;消</span>
          <span class="hn2-btn" @click="commit">保&emsp;存</span>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "comm-form-list",
  props: {
    items: Array,
    fields: Array,
    model: String,
    name: String,
    formData: Array
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
      currentEditItem: null,
      actions: [
        {
          name: "编辑",
          code: "edit",
          icon: "edit",
          scale: 1.1,
          variant: "secondary"
        },
        {
          name: "删除",
          code: "delete",
          icon: "trash-alt",
          scale: 1.0,
          variant: "danger"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    changeValue(val) {
      // console.log(val);
      // if (this.model === "man") {
      //   this._handleManForm(val);
      // }
      this.$emit("controlvaluechanged", val);
    },
    actionClick(ev) {
      // console.log(ev);
      const action = ev.action;
      const data = ev.data;
      if (action.code === "edit") {
        this.currentEditItem = data;
        // data.edit = true;
        this.formData.forEach(control => {
          if (control.type === 2) {
            // console.log(data);
            if (data[control.field]) {
              control.value = `${data[control.field + "name"]}-${
                data[control.field]
              }`;
            } else {
              control.value = null;
            }
          } else if (control.type === 7) {
            // 树形控件
            control.value = {
              value: data[control.field],
              text: data[control.field + "name"],
              childcount: 0
            };
          } else {
            control.value = data[control.field];
          }
        });

        // console.log(this.formData);

        this.$refs.formModal.show();
      } else if (action.code === "delete") {
        var a = confirm("您确定要删除吗？");
        if (a) {
          const index = this.items.indexOf(data);
          if (index !== -1) {
            this.items.splice(index, 1);
          }
        }
      }
    },
    newItem() {
      this.currentEditItem = null;

      this.$refs.form.reset();
      this.formData.forEach(control => {
        control.value = null;
        delete control["progress"];
        delete control["_files"];
      });

      this.$refs.formModal.show();
    },
    cancel() {
      this.$refs.formModal.hide();
    },
    commit(evt) {
      evt.preventDefault();
      let obj = {};

      for (let i = 0; i < this.formData.length; i++) {
        let control = this.formData[i];
        if (control.required && control.type !== 5 && !control.value) {
          alert(control.label + "不能为空");
          return;
        }

        if (control.pattern) {
          let reg = new RegExp(control.pattern);
          if (!!control.value && !reg.test(control.value)) {
            alert(control.label + "不正确");
            return;
          }
        }

        if (control.subtype === "date") {
          if (control.value) {
            let val = control.value
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "")
              .replace("/", "-");
            console.log(val);
            let reg = new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/);
            if (!reg.test(val)) {
              alert(control.label + "不正确");
              return;
            }
          }
        }

        if (control.type === 2 && control.value) {
          obj[control.field] = control.value.split("-")[1];
          obj[control.field + "name"] = control.value.split("-")[0];
        } else if (control.type === 7 && control.value) {
          obj[control.field] = control.value.value;
          obj[control.field + "name"] = control.value.text;
          obj[control.field + "id"] = control.value.value;
        } else if (control.type === 5) {
          obj[control.field] = control.value ? "是" : "否";
        } else {
          if (control.type === 4) {
            obj[control.field + "_isfile"] = true;
            // let files = control._files;
            obj._files = control._files;
          }
          obj[control.field] = control.value;
        }
      }

      //   this.$emit("changeitem", {
      //     item: obj,
      //     currentItem: this.currentEditItem
      //   });

      console.log(obj);

      if (this.currentEditItem) {
        // 编辑
        const index = this.items.indexOf(this.currentEditItem);
        if (index !== -1) {
          this.items.splice(index, 1, obj);
        }
      } else {
        // 新增
        this.items.push(obj);
      }

      // this.reset();
      this.$refs.formModal.hide();
    }
  }
};
</script>
<style lang="scss" scoped>
.comm-form-list {
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
