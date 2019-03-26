<template>
  <div class="comm-form-list">
    <b-row>
      <b-col cols="8">
        共
        <span class="digit">{{items.length}}</span>
        条{{this.name}}
      </b-col>
      <b-col cols="4" class="hn-btn-style">
        <!-- <b-button @click="newItem">新增{{this.name}}</b-button> -->
        <el-button @click="newItem" plain type="primary">新增{{this.name}}</el-button>
      </b-col>
    </b-row>
    <horizontal-table
      :items="items"
      @actionclick="actionClick"
      :fields="fields"
      :actions="actions"
    />
    <div class="empty-error-box" v-if="items.length === 0">暂无{{this.name}}</div>

    <el-dialog
      :title="currentEditItem ? '编辑' + name : '新增' + name"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <form-fields form-ref="form" ref="dialogForm" :controls="formData" :form-model="formModel"></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">保 存</el-button>
      </div>
    </el-dialog>
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
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    },
    horizontalTable: function(resolve) {
      require(["@/components/profile/horizontal-table"], resolve);
    }
  },
  data() {
    return {
      formModel: {},
      dialogFormVisible: false,
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
    reset() {
      // console.log(123);
      this.$nextTick(() => {
        if (
          this.$refs["dialogForm"] &&
          this.$refs["dialogForm"].$refs["form"]
        ) {
          // console.log(234);
          this.$refs["dialogForm"].$refs["form"].clearValidate();
        }
      });
    },
    changeValue(val) {
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
      const action = ev.action;
      const data = ev.data;
      if (action.code === "edit") {
        // this.$refs.dialogForm.clearValidate();
        this.$nextTick(() => {
          if (
            this.$refs["dialogForm"] &&
            this.$refs["dialogForm"].$refs["form"]
          ) {
            this.$refs["dialogForm"].$refs["form"].clearValidate();
          }
        });

        this.currentEditItem = data;
        this.formModel = Object.assign({}, data);

        if (this.model === "man") {
          for (let i = 0; i < this.formData.length; i++) {
            const control = this.formData[i];
            if (control.field === "contacttype") {
              if (
                this.formModel["contacttype"] &&
                this.formModel["contacttype"].indexOf("第一联系人") !== -1
              ) {
                control.changeFunc(this.formModel["contacttype"]);
              }
              break;
            }
          }
        }

        this.dialogFormVisible = true;
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

      this.$nextTick(() => {
        if (
          this.$refs["dialogForm"] &&
          this.$refs["dialogForm"].$refs["form"]
        ) {
          this.$refs["dialogForm"].$refs["form"].resetFields();
        }
      });

      let object = {};
      this.formData.forEach(control => {
        object[control.field] = "";
      });

      this.formModel = object;

      this.dialogFormVisible = true;
    },
    commit(evt) {
      // evt.preventDefault();
      let obj = {};

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
        this.items.push(obj);
      }
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
