<template>
  <div class="value-item">
    <span v-if="!isfile">{{textValue}}</span>
    <div v-if="isfile">
      <div class="files" v-for="(file,index) in fileList" :key="index">
        <img :src="file.url" v-if="file.isimage" @click="previewImage(file.url)">
        <a :href="file.url" v-if="!file.isimage">{{file.name}}</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "value-item",
  props: {
    item: Object,
    field: String
  },
  data() {
    return {
      // isfile: false,
      fileList: [],
      isfile: false,
      dialogPreviewVisible: false
    };
  },
  mounted() {
    // console.log("ddd");
    this.reloadAnnexesIfNeeded();
  },
  methods: {
    reloadAnnexesIfNeeded() {
      // this.itemKey = this.field + new Date().getTime();
      // console.log("dddd");
      if (this.isFile()) {
        this.isfile = true;
        this.loadAnnexes();
      } else {
        this.isfile = false;
      }
    },
    isFile() {
      // console.log(this.field);
      // console.log(this.item);
      const urlKey = this.field + "url";
      let urlVal = this.item[urlKey];
      // console.log(urlVal);
      return !!urlVal || this.field.indexOf("annex") !== -1;
    },

    previewImage(url) {
      // this.dialogPreviewVisible = true;
      this.$emit("previewimg", url);
    },

    loadAnnexes() {
      // console.log(this.item);
      // console.log("loading...");
      if (!this.item[this.field]) {
        this.fileList = [];
        return;
      }
      this.$post(
        {
          action: "P_SY_GetAnnex",
          p1: this.item[this.field]
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
  },
  computed: {
    textValue() {
      // console.log(this.item);

      let key = this.field + "name";
      let value = this.item[key] || this.item[this.field] || "";

      if (this.field == "contacttype") {
        return value.split("-")[0];
      }

      if (key == "quaidname" && value == "0") {
        return "";
      }

      if (key == "qualevelidname" && value == "0") {
        return "";
      }

      if (this.field == "ismain" || this.field == "ismodel") {
        if (value === "true" || value === true) {
          return "是";
        }
        if (!value || value === "false" || value === false) {
          return "否";
        }
      }

      return value;
    }
  }
};
</script>
<style lang="scss" scoped>
.value-item {
  img {
    max-height: 60px;
  }
  a {
    font-size: 14px;
    color: #e46623;
    text-decoration: underline;
    width: 100%;
    overflow: hidden;
    word-wrap: break-word;
    // text-wrap: unrestricted;
  }

  .files {
    img {
      max-width: 100%;
    }
  }

  span {
    width: 100%;
    overflow: hidden;
    word-wrap: break-word;
  }
}
</style>


