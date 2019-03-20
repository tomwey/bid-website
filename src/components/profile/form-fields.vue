<template>
  <div class="fields-wrap">
    <el-form :ref="formRef" :rules="formRules" label-width="180px" :model="formModel">
      <el-form-item
        :label="control.label"
        :prop="control.field"
        v-for="control in controls"
        :key="control.id"
      >
        <el-input
          v-model="formModel[control.field]"
          v-if="control.type === 1 && control.subtype !== 'number'"
          :type="control.subtype || 'text'"
          :rows="6"
          :disabled="control.disabled"
          :placeholder="control.placeholder || '输入' + control.label"
        >
          <template slot="append" v-if="!!control.unit">{{control.unit}}</template>
        </el-input>

        <!-- 文本输入数字控件 type = 1 && subtype = number -->
        <el-input
          v-model.number="formModel[control.field]"
          v-if="control.type === 1 && control.subtype === 'number'"
          :type="control.subtype || 'text'"
          :disabled="control.disabled"
          :placeholder="control.placeholder || '输入' + control.label"
        >
          <template slot="append" v-if="!!control.unit">{{control.unit}}</template>
        </el-input>

        <!-- 下拉选控件 type = 2 -->
        <el-select
          v-if="control.type === 2"
          :multiple="control.multiple"
          v-model="formModel[control.field]"
          :disabled="control.disabled"
          :placeholder="control.placeholder || '选择' + control.label"
        >
          <el-option
            v-for="item in control.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 单选框控件 type = 3 -->
        <el-radio-group
          :disabled="control.disabled"
          v-if="control.type === 3"
          v-model="formModel[control.field]"
        >
          <el-radio
            :label="item.value"
            v-for="item in control.options"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>

        <!-- 复选框控件 type = 4 -->
        <el-checkbox-group
          v-if="control.type === 4"
          :disabled="control.disabled"
          v-model="formModel[control.field]"
          @change="itemChange(control, $event)"
        >
          <el-checkbox
            v-for="item in control.options"
            :label="item.value"
            :key="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>

        <!-- 开关控件 type = 5 -->
        <el-switch
          :disabled="control.disabled"
          v-if="control.type === 5"
          v-model="formModel[control.field]"
          :active-text="control.yesText"
          :inactive-text="control.noText"
        ></el-switch>

        <!-- 时间选择器 type = 6 -->
        <el-time-select
          :disabled="control.disabled"
          v-if="control.type === 6"
          v-model="formModel[control.field]"
          :picker-options="control.pickerOptions"
          :placeholder="control.placeholder || '选择' + control.label"
        ></el-time-select>

        <!-- 日期选择器 type = 7 -->
        <el-date-picker
          :disabled="control.disabled"
          v-if="control.type === 7"
          v-model="formModel[control.field]"
          type="date"
          :placeholder="control.placeholder || '选择' + control.label"
          value-format="yyyy-MM-dd"
        ></el-date-picker>

        <!-- 上传组件 type = 8 -->
        <bid-upload v-if="control.type === 8" :control="control" v-model="formModel[control.field]"></bid-upload>
        <!-- <el-upload
          v-if="control.type === 8"
          class="upload-demo"
          action="http://erp20-app.heneng.cn:16681/upload"
          :on-preview="handlePreview"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          multiple
          :before-upload="beforeUpload"
          :limit="control.limit || 1"
          :accept="control.accept"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :ref="'upload' + control.id"
          :data="{ mid: '0', domanid: control.domanid, tablename: control.tablename, fieldname: control.fieldname }"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "form-fields",
  components: {
    bidUpload: resolve => {
      require(["@/components/bid-upload"], resolve);
    }
  },
  props: {
    controls: {
      type: Array,
      required: true
    },
    formModel: {
      type: Object,
      required: true
    },
    formRef: {
      type: String,
      required: true
    }
  },
  computed: {
    formRules() {
      let temp = {};
      this.controls.forEach(control => {
        if (control.rules && control.rules.length > 0) {
          temp[control.field] = control.rules;
        }
      });
      return temp;
    }
  },
  data() {
    return {
      fileList: []
    };
  },
  mounted() {
    // console.log("@@@@@@@@");
  },
  methods: {
    inputBlur(item) {
      let type = null;
      if (item.field == "comname") {
        type = "0";
      } else if (item.field == "comuscc") {
        type = "1";
      } else {
        return;
      }

      this.$post(
        {
          action: "P_SY_IsDuplicateUSCCOrCom",
          p1: item.value,
          p2: type,
          p3: this.$store.state.supinfo.supid || ""
        },
        res => {
          // console.log(res);
          if (res.code == "1") {
            // item.error_tips = `${item.name}已存在`;
            // console.log(item);
            this.$set(item, "error_tips", `${item.label}已存在`);
          } else {
            // item.error_tips = null;
            this.$set(item, "error_tips", null);
          }
        }
      );
    },
    itemChange(item, ev) {
      if (item.changeFunc) {
        item.changeFunc(ev);
      }
      // this.$emit("change", { control: item, data: ev });
    },
    toggle(item) {
      if (item.options.length === 0) return;

      this.openTreeData = !this.openTreeData;
      this.currentItem = item;
    },
    selectedItem(val) {
      // console.log(val);
      if (this.currentItem) {
        this.$set(this.currentItem, "value", val);
        // this.$set(this.currentItem, this.currentItem.field + "name", val.text);
        this.openTreeData = false;
        // console.log(this.currentItem);
        this.$emit("change", { control: this.currentItem, data: val });
        // this.currentItem = null;
      }
    },
    reset() {
      // console.log("1111111");
      this.formData.forEach(item => {
        // if (item.type === 4) {
        //   const ref = item.id.replace(/-/g, "");
        //   const fileInput = this.$refs[ref][0];
        //   fileInput && fileInput.reset();
        // }

        item.value = null;
      });

      // this.$emit("reset");
    },
    commit() {},
    uploadFiles(ev, item) {
      // console.log(ev);
      let files = ev.target.files;
      if (files && files.length > 0) {
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i]);
        }
        formData.append("mid", "0");
        formData.append("domanid", (item.uid || 0).toString());
        formData.append("tablename", item.tablename || "H_Sup_Annex");
        formData.append("fieldname", item.fieldname || "AnnexID");

        this.$axios
          .post("http://erp20-app.heneng.cn:16681/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            onUploadProgress: progressEvent => {
              let loaded = progressEvent.loaded;
              let total = progressEvent.total;
              let percent = (parseFloat(loaded) / parseFloat(total)).toFixed(2);
              percent = parseInt(percent * 100);
              this.$set(item, "progress", percent);
            }
          })
          .then(res => {
            this.$set(item, "progress", 100);
            if (res.data && res.data.code === "0") {
              item.value = res.data.IDS;
              this.$post(
                {
                  action: "P_SY_GetAnnex",
                  p1: res.data.IDS
                },
                res => {
                  // console.log(res);
                  if (res.code === "0") {
                    let arr = res.data;
                    let temp = [];
                    arr.forEach(file => {
                      let fileName = file.filename || "";
                      temp.push({
                        _filename: file.filename,
                        _fileurl: file.url,
                        _isimage:
                          fileName.indexOf(".png") !== -1 ||
                          fileName.indexOf(".gif") !== -1 ||
                          fileName.indexOf(".jpg") !== -1 ||
                          fileName.indexOf(".jpeg") !== -1 ||
                          fileName.indexOf(".webp") !== -1
                      });
                    });
                    // item._files = temp;
                    this.$set(item, item.field + "_files", temp);
                  }
                }
              );
            }
          })
          .catch(() => {
            // console.log(error);
            // alert("上传失败!");
            this.$message({
              message: "上传失败！",
              type: "error"
            });
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;

.error-tips {
  font-size: 14px;
  color: $theme-color;
  margin-top: 3px;
}

.download-link {
  margin-top: 5px;
  color: #e46623;
  font-size: 14px;
  a {
    color: #e46623;
    font-size: 14px;
    text-decoration: underline;
  }
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}

.tree-data-wrap {
  position: relative;
  cursor: pointer;
  user-select: none;
  width: 100%;
  height: 30px;
  line-height: 30px;
  .caret {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    margin-top: -2px;

    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #333;
  }

  .tree-data {
    position: absolute;
    max-height: 300px;
    width: 100%;
    z-index: 100;
    background: #fff;
    border: 1px solid #eee;
    left: 0;
    top: 30px;
    overflow: auto;
  }
}
.fields-wrap {
  .upload-help-text {
    font-size: 14px;
    color: #999;
    font-style: italic;
    margin: 0;
    margin-top: 5px;
    padding: 0;
    line-height: 18px;
  }

  .special {
    color: $theme-color;
  }

  .file-preview {
    margin-top: 10px;
    img {
      max-height: 60px;
    }

    a {
      font-size: 14px;
      color: $theme-color;
      text-decoration: underline;
    }
  }
  // padding: 30px 60px;
  .table {
    margin: 0;
    padding: 0;
    width: 100%;
    .form-control {
      font-size: 14px !important;
    }
    &.readonly {
      border-top: 1px solid #eee;

      .form-control {
        border: 0;
      }

      .custom-select {
        background: #fff;
      }
    }

    .custom-file-input .custom-file-label::after {
      content: "浏览" !important;
    }

    td {
      vertical-align: middle;
      border-top: 0;
      padding: 0.75rem 0.75rem 0.75rem 0;
    }
    .label {
      width: 240px;
      label {
        vertical-align: middle;
        line-height: 14px;
        /* padding: 0; */
        margin: 0;
      }
      .required {
        color: $theme-color;
        font-size: 16px;
        font-weight: 700;
        vertical-align: -3px;
      }
    }
  }

  .custom-btn {
    display: inline-block;
    width: 120px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background: $theme-color;
    cursor: pointer;
    margin-right: 15px;
    box-sizing: content-box;
    &.outline {
      background: #fff;
      color: $theme-color;
      border: 1px solid $theme-color;
    }
  }

  .progress-box {
    .progress {
      margin-top: 15px;
    }
    .percent {
      font-size: 14px;
      color: #333;
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: right;
    }
  }
}
</style>


