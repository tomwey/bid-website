<template>
  <div class="comm-form-list">
    <b-row>
      <b-col cols="8">
        共
        <span class="digit">{{tableData.length}}</span>
        条{{this.name}}
      </b-col>
      <b-col cols="4" class="hn-btn-style">
        <!-- <b-button @click="newItem">新增{{this.name}}</b-button> -->
        <el-button @click="newItem" plain type="primary">新增{{this.name}}</el-button>
      </b-col>
    </b-row>
    <horizontal-table
      :key="name + 'list'"
      :items="tableData"
      @actionclick="actionClick"
      :fields="fields"
      :actions="actions"
    />
    <div class="empty-error-box" v-if="items.length === 0">暂无{{this.name}}</div>

    <el-dialog
      :title="currentEditItem ? '编辑' + name : '新增' + name"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
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
    formData: Array,
    formModel: Object
  },
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    },
    horizontalTable: function(resolve) {
      require(["@/components/profile/horizontal-table2"], resolve);
    }
  },
  data() {
    return {
      // formModel: {},
      dialogFormVisible: false,
      currentEditItem: null,
      tableData: this.items,
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
      // console.log(data);
      if (action.code === "edit") {
        this.$nextTick(() => {
          if (
            this.$refs["dialogForm"] &&
            this.$refs["dialogForm"].$refs["form"]
          ) {
            this.$refs["dialogForm"].$refs["form"].clearValidate();
          }
        });

        this.currentEditItem = data;

        this.$emit("openform", { func: this.model, data: data });

        this.dialogFormVisible = true;
      } else if (action.code === "delete") {
        var a = confirm("您确定要删除吗？");
        if (a) {
          const index = this.tableData.indexOf(data);
          if (index !== -1) {
            this.tableData.splice(index, 1);
          }
        }
      }
    },
    newItem() {
      this.currentEditItem = null;

      this.reset();

      this.$emit("openform", { func: this.model });

      this.dialogFormVisible = true;
    },
    commit(evt) {
      // console.log(this.formModel);
      this.$refs.dialogForm.validateFields(flag => {
        if (flag) {
          // let obj = Object.assign({}, this.formModel);

          let obj = {};
          // console.log(this.formModel);
          // console.log(this.formData);

          this.formData.forEach(control => {
            // console.log(control);
            if (control.type == 2) {
              if (this.formModel[control.field]) {
                // console.log(this.formModel[control.field]);
                let arr = this.formModel[control.field].split("-");
                if (arr.length === 2) {
                  obj[control.field] = arr[1];
                  obj[control.field + "name"] = arr[0];
                } else if (arr.length === 1) {
                  obj[control.field] = arr[0];
                  obj[control.field + "name"] = arr[0];
                } else {
                  obj[control.field] = "";
                  obj[control.field + "name"] = "";
                }
              } else {
                obj[control.field] = "";
                obj[control.field + "name"] = "";
              }
              // obj[control.field + "name"] = this.formModel[control.field];
              // obj[control.field] = this.formModel[control.field];
            } else if (control.type == 9) {
              obj[control.field] = this.formModel[control.field];
              obj[control.field + "name"] = this.formModel[
                control.field + "name"
              ];
            } else {
              obj[control.field] = this.formModel[control.field];
            }

            // 特殊处理普通联系人的附件
            if (
              control.field == "contacttype" &&
              this.formModel[control.field] &&
              this.formModel[control.field].indexOf("普通联系人") !== -1
            ) {
              obj["sscertificateannex"] = null;
              obj["authdelegationannex"] = null;
            }

            if (control.field == "servertype") {
              obj["servertypeid"] = this.formModel[control.field];
            }

            if (control.field == "contractmoney") {
              obj["contractmoney"] = (
                this.formModel[control.field] || "0"
              ).toString();
            }
          });

          // console.log(obj);

          if (this.currentEditItem) {
            // 编辑
            const index = this.tableData.indexOf(this.currentEditItem);
            if (index !== -1) {
              this.tableData.splice(index, 1, obj);
            }
          } else {
            // 新增
            this.tableData.push(obj);
          }

          // console.log(this.tableData);

          this.dialogFormVisible = false;
        }
      });
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
