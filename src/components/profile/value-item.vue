<template>
  <div class="value-item">
    <span v-if="!isFile">{{textValue}}</span>
    <div v-if="isFile">
      <div class="files" v-for="(file,index) in files" :key="index">
        <img :src="file._fileurl" v-if="file._isimage">
        <a :href="file._fileurl" v-if="!file._isimage">{{file._filename}}</a>
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
  computed: {
    isFile() {
      let urlKey = this.field + "url";
      let urlValue = this.item[urlKey];
      if (urlValue) {
        let nameKey = this.field + "name";
        let filename = this.item[nameKey];
        this.$set(this.item, this.item.field + "_files", [
          {
            _fileurl: urlValue,
            _filename: filename,
            _isimage:
              filename.indexOf(".png") !== -1 ||
              filename.indexOf(".gif") !== -1 ||
              filename.indexOf(".jpg") !== -1 ||
              filename.indexOf(".jpeg") !== -1 ||
              filename.indexOf(".webp") !== -1
          }
        ]);

        return true;
      }

      let key = this.field + "_isfile";
      return this.item[key];
    },
    textValue() {
      // console.log(this.item);

      let key = this.field + "name";
      let value = this.item[key] || this.item[this.field] || "";

      if (key == "quaidname" && value == "0") {
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
    },
    files() {
      // console.log(this.item);
      // console.log(this.field);

      if (!this.item[this.field]) return null;

      if (this.item[this.field + "_files"]) {
        return this.item[this.field + "_files"];
      } else {
        let urlKey = this.field + "url";
        let urlValue = this.item[urlKey];

        if (urlValue) {
          let nameKey = this.field + "name";
          let filename = this.item[nameKey];
          let isimage =
            filename.indexOf(".png") !== -1 ||
            filename.indexOf(".gif") !== -1 ||
            filename.indexOf(".jpg") !== -1 ||
            filename.indexOf(".jpeg") !== -1 ||
            filename.indexOf(".webp") !== -1;

          return [
            {
              _fileurl: urlValue,
              _filename: filename,
              _isimage: isimage
            }
          ];
          // if (
          // filename.indexOf(".png") !== -1 ||
          // filename.indexOf(".gif") !== -1 ||
          // filename.indexOf(".jpg") !== -1 ||
          // filename.indexOf(".jpeg") !== -1 ||
          // filename.indexOf(".webp") !== -1
          // ) {
          //   return {
          //     url: urlValue,
          //     name: filename
          //   };
          // }
        } else {
          return [];
        }
      }
    },
    imageValue() {
      let urlKey = this.field + "url";
      let urlValue = this.item[urlKey];
      if (urlValue) {
        let nameKey = this.field + "name";
        let filename = this.item[nameKey];
        if (
          filename.indexOf(".png") !== -1 ||
          filename.indexOf(".gif") !== -1 ||
          filename.indexOf(".jpg") !== -1 ||
          filename.indexOf(".jpeg") !== -1 ||
          filename.indexOf(".webp") !== -1
        ) {
          return {
            url: urlValue,
            name: filename
          };
        }
      }
      return null;
    },
    fileValue() {
      let urlKey = this.field + "url";
      let urlValue = this.item[urlKey];
      if (urlValue) {
        let nameKey = this.field + "name";
        let filename = this.item[nameKey];
        return {
          url: urlValue,
          name: filename
        };
      }
      return null;
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

  span {
    width: 100%;
    overflow: hidden;
    word-wrap: break-word;
  }
}
</style>


