<template>
  <div class="fields-wrap">
    <table class="table" :class="{readonly:readonly===true}">
      <tr v-for="(item,index) in formData" :key="index">
        <td class="label">
          <label :for="item.id" v-if="item.type !== 5">
            <span class="required" v-if="!readonly && item.required">*</span>
            {{item.label}}
          </label>
        </td>
        <td class="input-control">
          <!-- 单行输入控件 -->
          <b-form-input
            :id="item.id"
            :type="item.subtype"
            v-if="item.type === 1 && !item.append"
            v-model="item.value"
            :disabled="item.readonly"
            @blur.native="inputBlur(item);"
            :placeholder="item.placeholder || `输入${item.label}`"
          ></b-form-input>
          <div class="error-tips" v-if="!!item.error_tips">{{item.error_tips}}</div>

          <!-- 日期控件 -->
          <el-date-picker
            :id="item.id"
            v-model="item.value"
            v-if="item.type === 12"
            type="date"
            size="large"
            :disabled="item.readonly"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :placeholder="item.placeholder || `设置${item.label}`"
          ></el-date-picker>

          <b-input-group :append="item.append" v-if="item.type === 1 && item.append">
            <b-form-input
              :id="item.id"
              :type="item.subtype"
              v-if="item.type === 1"
              v-model="item.value"
              :placeholder="item.placeholder || `输入${item.label}` "
            ></b-form-input>
          </b-input-group>

          <!-- 下拉选控件 -->
          <b-form-select
            v-if="item.type === 2"
            v-model="item.value"
            :options="item.options"
            :placeholder="item.placeholder"
            @change="itemChange(item, $event);"
          />
          <!-- 复选框控件 -->
          <b-form-checkbox-group
            v-if="item.type === 3"
            :id="item.id"
            v-model="item.value"
            :options="item.options"
            @change="itemChange(item, $event);"
          ></b-form-checkbox-group>
          <!-- 文件上传控件 -->
          <div class="input-file-box" v-if="item.type === 4">
            <b-form-file
              :accept="`${item.accept || 'image/*'}`"
              :ref="`${item.id.replace(/-/g, '')}`"
              :id="item.id"
              :multiple="item.multiple"
              :placeholder="item.placeholder || `选择文件`"
              @change="uploadFiles($event, item);"
              plain
            ></b-form-file>
            <p class="upload-help-text">{{item.upload_desc || "上传附件为图片，格式建议：jpg,jpeg,png,gif"}}</p>
            <div class="download-link" v-if="!!item.tpl_file">
              <a :href="item.tpl_file.url" target="_blank">{{item.tpl_file.name}}</a>
            </div>
            <div class="progress-box" v-show="item.progress && item.progress > 0">
              <b-row>
                <b-col cols="10">
                  <b-progress
                    height="4px"
                    variant="custom-progress-color"
                    :value="item.progress || 0"
                  ></b-progress>
                </b-col>
                <b-col cols="2">
                  <span class="percent">{{item.progress || 0}}%</span>
                </b-col>
              </b-row>
            </div>
            <!-- <div class="file-preview-box" v-for="(_item,index) in item._files" :key="index"> -->
            <div
              class="file-preview"
              v-for="(file,index) in item[item.field + '_files']"
              :key="index"
            >
              <img :src="file._fileurl" v-if="file._isimage">
              <a :href="file._fileurl" target="_blank" v-if="!file._isimage">{{file._filename}}</a>
            </div>
            <!-- </div> -->
          </div>
          <!-- 单值checkbox控件 -->
          <b-form-checkbox v-if="item.type === 5" :id="item.id" v-model="item.value">
            {{item.label}}
            <span v-if="item.special_desc">
              （
              <span class="special" @click="showSpecial(item);">{{item.special_desc}}</span>）
            </span>
          </b-form-checkbox>

          <!-- 单选框控件 -->
          <b-form-radio-group
            v-if="item.type === 6"
            :id="item.id"
            v-model="item.value"
            :options="item.options"
          ></b-form-radio-group>

          <!-- 自定义树形控件 -->
          <div class="tree-data-wrap" v-if="item.type === 7">
            <span style="display:inline-block;min-width: 150px;" @click="toggle(item);">
              {{item.value ? item.value.text : "请选择" + item.label}}
              <span class="caret"></span>
            </span>
            <span class="special-text" v-if="!!item.special_text" v-html="item.special_text"></span>
            <tree-data
              @selected="selectedItem"
              v-show="openTreeData"
              v-if="item.type === 7"
              :data="item.options"
              :id="item.id"
              :target="item"
            ></tree-data>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name: "comm-fields",
  props: {
    readonly: Boolean,
    formData: Array,
    step: String
    // formEntity: Object
  },
  components: {
    treeData: function(resolve) {
      require(["@/components/tree-data/index"], resolve);
    }
  },
  data() {
    return {
      progress: 0,
      openTreeData: false,
      currentItem: null
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
      this.$emit("change", { control: item, data: ev });
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
    showSpecial(control) {
      // console.log(ev);
      if (control.clickCallback) {
        control.clickCallback();
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
  .special-text {
    display: inline-block;
    margin-left: 20px;
    font-size: 14px;
  }
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
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
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


