<template>
  <div class="upload-wrapper">
    <el-upload
      class="upload-demo"
      action="http://erp20-app.heneng.cn:16681/upload"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      multiple
      :before-upload="beforeUpload"
      :limit="limit"
      :accept="accept"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :ref="'upload' + control.id"
      :data="{ mid: '0', domanid: control.domanid, tablename: control.tablename, fieldname: control.fieldname }"
    >
      <el-button size="small">选择文件</el-button>
      <div slot="tip" class="el-upload__tip">
        {{control.upload_tips || calcUploadTips}}
        <div class="tpl-wrap" v-if="control.tpl_files && control.tpl_files.length > 0">
          <a
            :href="file.url"
            target="_blank"
            v-for="file in control.tpl_files"
            :key="file.url"
          >{{file.name}}</a>
        </div>
      </div>
    </el-upload>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "bid-upload",
  props: {
    control: {
      type: Object,
      required: true
    },
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      previewImage: null,
      dialogPreviewVisible: false,
      fileList: [],
      limit: this.control.limit || 1,
      accept: this.control.accept || ".jpg,.png,.gif,.webp,.jpeg",
      fileSize: this.control.fileSize || 10
    };
  },
  mounted() {
    // console.log(this.value);
    if (this.value && this.value != "0") {
      this.loadAnnexes();
    }
  },
  watch: {
    value(newVal) {
      // console.log(newVal);
      if (!newVal || newVal == "0") {
        this.fileList = [];
      } else {
        this.loadAnnexes();
      }
    }
  },
  computed: {
    calcUploadTips() {
      return `附件格式为：${this.accept}，大小不超过${this.fileSize}MB`;
    }
  },
  methods: {
    changeValues(id, isAdd) {
      // console.log(this.fileList);
      if (isAdd) {
        var temp = [];
        // console.log(this.value);
        if (this.value) {
          if (this.value == 0) {
            temp = [];
          } else {
            temp = this.value.split(",");
          }
        }

        temp.push(id);
        // this.value = temp.join(",");
        this.$emit("input", temp.join(","));
      } else {
        // console.log(this.value);
        if (this.value) {
          var temp = this.value.split(",");
          const index = temp.indexOf(id);
          if (index !== -1) {
            temp.splice(index, 1);
          }
          // this.value = temp.join(",");

          this.$emit("input", temp.join(","));
        }
      }
    },
    handleSuccess(res, file) {
      this.changeValues(res.IDS, true);
      // console.log(this.fileList);
    },
    loadAnnexes() {
      this.$post(
        {
          action: "P_SY_GetAnnex",
          p1: this.value
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];
            arr.forEach(file => {
              // console.log(file);
              let fileName = file.filename || "";
              temp.push({
                name: file.filename,
                url: file.url,
                annexid: file.annexid,
                isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              });
            });
            this.fileList = temp;
          }
        }
      );
    },
    beforeUpload(file) {
      // const fileSize = this.control.fileSize || 2;
      const isLt2M = file.size / 1024 / 1024 < this.fileSize;

      var index = file.name.lastIndexOf(".");
      //获取后缀
      var ext = file.name.substr(index + 1);
      const isRightFile = this.accept.indexOf(ext) !== -1;

      if (!isRightFile) {
        this.$message.error(`${this.control.label}只能是 ${this.accept} 格式!`);
      }

      if (!isLt2M) {
        this.$message.error(
          `${this.control.label}大小不能超过 ${this.fileSize}MB!`
        );
      }

      return isLt2M && isRightFile;
    },
    handlePreview(file) {
      // console.log(file);
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    beforeRemove(file, fileList) {
      return true;
    },
    handleRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      // if (file.response) {
      // const index = this.fileList.indexOf(file);
      // if (index !== -1) {
      //   this.fileList.splice(index, 1);
      // }
      this.changeValues(file.annexid, false);
      // }
    },
    handleExceed(files, fileList) {
      const limit = this.control.limit || 1;
      this.$message.warning(`${this.control.label}最多只能上传${limit}个文件`);
    }
  }
};
</script>
<style lang="scss" scoped>
.tpl-wrap {
  a {
    color: #e46623;
    font-size: 14px;
    text-decoration: underline;
    display: block;
    line-height: 14px;
    padding: 10px 0;
  }
}

.el-upload__tip {
  line-height: 14px;
}
</style>


