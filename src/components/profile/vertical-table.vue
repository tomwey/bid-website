<template>
  <div class="list-box">
    <list :items="items"/>
  </div>
</template>
<script>
export default {
  name: "vertical-table",
  props: {
    step: Number,
    items: Array
  },
  components: {
    list: function(resolve) {
      require(["@/components/profile/list"], resolve);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$post(
        {
          action: "P_SUP_GetSupInfo",
          p1: this.$store.state.token,
          p2: (this.step || 1).toString()
        },
        res => {
          if (res.code === "0") {
            const arr = res.data;
            if (arr.length > 0) {
              const obj = arr[0];
              this.items.forEach(item => {
                let key = item.field + "name";
                let value = obj[key] || obj[item.field] || "";
                value = value.replace("00:00:00 +0000 UTC", "");
                item.value = value;

                let annexUrlKey = item.field + "url";
                // console.log(annexUrlKey);
                // console.log(obj[annexUrlKey]);
                if (obj[annexUrlKey]) {
                  const filename = obj[item.field + "name"];

                  item["filename"] = filename;
                  item["fileurl"] = obj[annexUrlKey];

                  if (filename) {
                    if (
                      filename.indexOf(".png") !== -1 ||
                      filename.indexOf(".gif") !== -1 ||
                      filename.indexOf(".jpg") !== -1 ||
                      filename.indexOf(".jpeg") !== -1 ||
                      filename.indexOf(".webp") !== -1
                    ) {
                      item["filetype"] = "image";
                    } else {
                      item["filetype"] = "file";
                    }
                  }

                  //   console.log(item);
                }
                // end if
              });
            }
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.list-box {
  padding: 15px 30px 60px;
}
</style>


