<template>
  <div class="value-item">
    <span v-if="!imageValue && !fileValue">{{textValue}}</span>
    <img :src="imageValue.url" v-if="imageValue">
    <a :href="fileValue.url" v-if="fileValue && !imageValue">{{fileValue.name}}</a>
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
    textValue() {
      let key = this.field + "name";
      let value = this.item[key] || this.item[this.field] || "";
      value = value.replace("00:00:00 +0000 UTC", "");
      value = value.replace("+0000 UTC", "");
      if (value === "true") {
        return "是";
      }

      if (value === "false") {
        return "否";
      }

      return value;
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
  }
}
</style>


