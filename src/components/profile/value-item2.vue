<template>
  <div class="value-item">
    <span v-if="!isFile">{{textValue}}</span>
    <div v-if="isFile">
      <div class="files" v-for="(file,index) in fileList" :key="index">
        <img :src="file.url" v-if="file.isimage">
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
      fileList: []
    };
  },
  mounted() {
    if (this.isFile) {
      this.loadAnnexes();
    }
  },
  methods: {
    loadAnnexes() {
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
    isFile() {
      const urlKey = this.field + "url";
      let urlVal = this.item[urlKey];
      return !!urlVal;
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


