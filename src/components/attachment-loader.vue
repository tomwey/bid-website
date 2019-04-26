<template>
  <div class="attachment-loader-wrap">
    <div class="attachment-loader">
      <span
        class="file-item"
        @click="previewFile(file);"
        v-for="file in fileList"
        :key="file.url"
      >{{file.name}}</span>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "attachment-loader",
  props: {
    annexids: {
      type: String
    }
  },
  data() {
    return {
      fileList: [],
      dialogPreviewVisible: false,
      previewImage: null
    };
  },
  mounted() {
    // console.log(1123);
    // console.log(this.annexids);
    this.loadAnnexes();
  },
  methods: {
    previewFile(file) {
      if (file.isimage) {
        this.previewImage = file.url;
        this.dialogPreviewVisible = true;
      } else {
        window.open(file.url);
      }
    },
    loadAnnexes() {
      //   console.log(this.annexids);
      if (!this.annexids || this.annexids == "0") {
        return;
      }

      this.$post(
        {
          action: "P_SY_GetAnnex",
          p1: this.annexids
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
    }
  }
};
</script>
<style lang="scss" scoped>
.file-item {
  display: block;
  font-size: 14px;
  color: rgb(231, 90, 22);
  text-decoration: underline;
  cursor: pointer;
  padding: 5px 0;
}
</style>


