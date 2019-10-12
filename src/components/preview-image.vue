<template>
  <div class="preview-image">
    <img :src="file.url" v-for="file in images" :key="file.url" @click="previewImage(file)" />
  </div>
</template>
<script>
export default {
  name: "preview-image",
  props: {
    annexids: {
      type: String
    }
  },
  data() {
    return {
      images: []
    };
  },
  mounted() {
    this.loadAnnexes();
  },
  methods: {
    previewImage(file) {},
    loadAnnexes() {
      if (!this.annexids) {
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
            this.images = temp;
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.preview-image {
  img {
    max-width: 120px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>