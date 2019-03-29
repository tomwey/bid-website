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
      require(["@/components/profile/horizontal-table2"], resolve);
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
        // this.formModel = Object.assign({}, data);
        let obj = {};
        for (let i = 0; i < this.formData.length; i++) {
          const control = this.formData[i];
          if (control.type === 5) {
            if (
              data[control.field] == "true" ||
              data[control.field] == "是" ||
              data[control.field] == "1"
            ) {
              obj[control.field] = true;
            } else {
              obj[control.field] = false;
            }
          } else if (control.type === 8) {
            // 附件
            obj[control.field + "url"] = data[control.field + "url"];
            obj[control.field] = data[control.field];
          } else if (control.type === 9) {
            obj[control.field + "name"] = data[control.field + "name"];
            obj[control.field] =
              (data[control.field + "id"] || data[control.field]) == "0"
                ? ""
                : data[control.field + "id"] || data[control.field];
          } else {
            obj[control.field] = data[control.field];
          }
        }

        this.formModel = obj;

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
    newItem() {
      this.currentEditItem = null;

      this.reset();

      let object = {};
      this.formData.forEach(control => {
        object[control.field] = "";
        if (control.type == 5) {
          object[control.field] = false;
        }
      });

      this.formModel = object;

      this.dialogFormVisible = true;
    },
    commit(evt) {
      // console.log(this.formModel);
      this.$refs.dialogForm.validateFields(flag => {
        if (flag) {
          let obj = Object.assign({}, this.formModel);

          // this.dialogFormVisible = false;

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
