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
    changeFormData(control, data) {
      let val = data["contacttype"];
      control.value = `${val}-${val}`;
      this.$emit("controlvaluechanged", {
        control: control,
        data: `${val}-${val}`
      });
    },
    actionClick(ev) {
      // console.log(ev);
      // this.$refs.form.reset();

      const action = ev.action;
      const data = ev.data;
      if (action.code === "edit") {
        this.currentEditItem = data;

        if (this.model == "man") {
          this.changeFormData(this.formData[0], data);
        }

        this.formData.forEach(control => {
          // console.log(control);
          if (control.type === 2) {
            // console.log(data);
            if (data[control.field]) {
              control.value = `${data[control.field + "name"]}-${
                data[control.field]
              }`;
            } else {
              control.value = null;
            }

            if (control.field == "quaid" && data["quaid"] == "0") {
              control.value = null;
            }
          } else if (control.type === 4) {
            // 文件附件
            const nameKey = control.field + "name";
            const urlKey = control.field + "url";
            if (data[urlKey] && data[nameKey]) {
              let fileUrl = data[urlKey];
              let fileName = data[nameKey];

              let file = {
                _fileurl: fileUrl,
                _filename: fileName,
                _isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              };
              control[control.field + "_files"] = [file];
              control.value = data[control.field] || null;
              // console.log(control);
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

          if (this.model == "service_type") {
            this.reformServiceForm(control, data);
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
    reformServiceForm(control, data) {
      // console.log(control);

      if (control.field == "servertype") {
        this.$emit("controlvaluechanged", {
          control: control,
          data: { text: data["servertypename"], value: data["servertypeid"] }
        });
      } else if (control.field == "quaid") {
        this.$emit("controlvaluechanged", {
          control: control,
          data: `${data["quaidname"]}-${data["quaid"]}`
        });
      }
    },
    newItem() {
      this.currentEditItem = null;

      if (this.model == "man") {
        if (this.formData.length === 9) {
          this.formData.splice(this.formData.length - 1, 1);
          this.formData.splice(this.formData.length - 1, 1);
        }
      } else if (this.model == "service_type") {
        if (this.formData.length === 6) {
          this.formData.splice(3, 1);
        }
      }

      this.formData.forEach(control => {
        control.value = null;
        delete control["progress"];
        delete control[control.field + "_files"];
      });

      this.$refs.form.reset();

      this.$refs.formModal.show();
    },
    cancel() {
      this.$refs.formModal.hide();
    },
    commit(evt) {
      evt.preventDefault();
      let obj = {};

      // console.log(this.items);

      for (let i = 0; i < this.formData.length; i++) {
        let control = this.formData[i];
        // console.log(control);
        if (
          control.required &&
          control.type == 7 &&
          (!control.value || !control.value.value)
        ) {
          this.$message({
            message: control.label + "不能为空",
            type: "error"
          });
          return;
        }

        if (control.required && control.type !== 5 && !control.value) {
          // alert(control.label + "不能为空");

          this.$message({
            message: control.label + "不能为空",
            type: "error"
          });
          return;
        }

        if (control.pattern) {
          let reg = new RegExp(control.pattern);
          if (!!control.value && !reg.test(control.value)) {
            // alert(control.label + "不正确");
            this.$message({
              message: control.label + "不正确",
              type: "error"
            });
            return;
          }
        }

        if (control.field == "ismain") {
          // console.log(control);
          let hasPrimary = false;
          if (control.value === true) {
            for (let index = 0; index < this.items.length; index++) {
              const ele = this.items[index];
              if (ele.ismain == "是" || ele.ismain == "true") {
                hasPrimary = true;
                break;
              }
            }
          }

          if (hasPrimary) {
            // alert("服务类别只能有一个主要类别");
            this.$message({
              message: "服务类别只能有一个主要类别",
              type: "error"
            });
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
            // console.log(val);
            let reg = new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/);
            if (!reg.test(val)) {
              this.$message({
                message: control.label + "不正确",
                type: "error"
              });
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
            obj[control.field + "_files"] = control[control.field + "_files"];
          }
          obj[control.field] = control.value;
        }
      }

      if (this.currentEditItem) {
        // 编辑
        const index = this.items.indexOf(this.currentEditItem);
        if (index !== -1) {
          this.items.splice(index, 1, obj);
        }
      } else {
        // 新增
        // console.log(obj);
        this.items.push(obj);
      }

      console.log(this.items);

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
