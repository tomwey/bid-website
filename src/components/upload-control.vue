<template>
  <div class="upload-control">
    <div class="control-wrap">
      <b-form-file
        :accept="`${accept || 'image/*'}`"
        placeholder="选择文件"
        :multiple="multiple"
        @change="uploadFiles($event);"
        plain
      ></b-form-file>
      <p class="upload-help-text">{{upload_desc || "图片格式为：jpg,jpeg,png,gif"}}</p>
      <div class="progress-box" v-show="progress > 0">
        <b-row>
          <b-col cols="10">
            <b-progress height="4px" variant="custom-progress-color" :value="progress || 0"></b-progress>
          </b-col>
          <b-col cols="2">
            <span class="percent">{{error ? error : (progress || 0).toString() + '%'}}</span>
          </b-col>
        </b-row>
      </div>
    </div>

    <div class="download-link" v-if="!!tplFile">
      <a :href="tplFile.url" target="_blank">{{tplFile.name}}</a>
    </div>
  </div>
</template>
<script>
export default {
  name: "upload-control",
  props: {
    tplFile: Object,
    multiple: Boolean,
    accept: String,
    tablename: String,
    fieldname: String,
    upload_desc: String
  },
  data() {
    return {
      progress: 0,
      attachmentIDs: null,
      error: null
    };
  },
  mounted() {
    console.log(this.tplFile);
  },
  methods: {
    uploadFiles(ev) {
      // console.log(ev);
      let files = ev.target.files;
      if (files && files.length > 0) {
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i]);
        }
        formData.append("mid", "0");

        let uid = this.$store.state.supinfo.accountid || "0";

        formData.append("domanid", (uid || 0).toString());
        formData.append("tablename", this.tablename || "H_Sup_Annex");
        formData.append("fieldname", this.fieldname || "AnnexID");

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
              this.progress = percent;
              //   this.$set(item, "progress", percent);
            }
          })
          .then(res => {
            // this.$set(item, "progress", 100);
            this.progress = 100;
            if (res.data && res.data.code === "0") {
              this.attachmentIDs = res.data.IDS;

              this.$emit("fileuploaded", this.attachmentIDs);
            }
          })
          .catch(error => {
            // console.log(error);
            this.error = "上传失败";
            // alert("上传失败!");
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-control {
  width: 100%;

  padding: 10px;

  .upload-help-text {
    font-size: 14px;
    color: #999;
    font-style: italic;
    margin: 0;
    margin-top: 5px;
    padding: 0;
    line-height: 14px;
  }

  .control-wrap {
    // padding: 0 10px;
    input {
      width: 98%;
    }
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


