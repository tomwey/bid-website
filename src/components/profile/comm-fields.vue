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
          <b-form-input
            :id="item.id"
            :type="item.subtype"
            v-if="item.type === 1"
            v-model="item.value"
            :placeholder="item.placeholder || `输入${item.label}` "
          ></b-form-input>
          <b-form-select
            v-if="item.type === 2"
            v-model="item.value"
            :options="item.options"
            :placeholder="item.placeholder"
            @change="item.changeFunc"
          />
          <b-form-checkbox-group
            v-if="item.type === 3"
            :id="item.id"
            v-model="item.value"
            :options="item.options"
            @change="item.changeFunc"
          ></b-form-checkbox-group>

          <b-form-radio-group
            v-if="item.type === 6"
            :id="item.id"
            v-model="item.value"
            :options="item.options"
          ></b-form-radio-group>
          <div class="input-file-box" v-if="item.type === 4">
            <input
              type="file"
              :accept="`${item.accept || 'image/jpeg, image/png, image/gif'}`"
              :ref="`${item.id.replace(/-/g, '')}`"
              :id="item.id"
              :multiple="item.multiple"
              :placeholder="item.placeholder || `选择文件`"
              @change="uploadFiles($event, item);"
            >
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
          </div>

          <b-form-checkbox v-if="item.type === 5" :id="item.id" v-model="item.value">{{item.label}}</b-form-checkbox>
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
    formData: Array
  },
  data() {
    return {
      progress: 0
    };
  },
  methods: {
    reset() {
      this.formData.forEach(item => {
        if (item.type === 4) {
          const ref = item.id.replace(/-/g, "");
          const fileInput = this.$refs[ref][0];
          fileInput && fileInput.reset();
        }

        item.value = null;
      });

      // this.$emit("reset");
    },
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
            item.value = res.IDS;
          })
          .catch(error => {
            console.log(error);
            alert("上传失败!");
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.bg-custom-progress-color {
  background-color: $theme-color !important;
}
.fields-wrap {
  // padding: 30px 60px;
  .table {
    margin: 0;
    padding: 0;
    width: 100%;
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
        font-size: 12px;
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


