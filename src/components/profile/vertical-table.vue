<template>
  <div class="list-box">
    <!-- <list :items="items"/> -->
    <table class="table">
      <tr v-for="(item,index) in tableData" :key="index">
        <td class="td-label">{{item.label}}</td>
        <td class="td-value">
          <span v-if="item.type === 1">{{item.value}}</span>
          
          <img v-if="item.filetype === 'image'" :src="item.fileurl">
          <!-- <div v-if="item.filetype === 3" v-html="item.value"></div> -->
          <a
            :href="item.fileurl"
            v-if="item.filetype === 'file'"
            class="file-link"
            target="_blank"
          >{{item.filename}}</a>
        </td>
      </tr>
    </table>

    <div class="empty-error-box" v-if="!tableData || tableData.length === 0">暂无数据显示</div>
  </div>
</template>
<script>
export default {
  name: "vertical-table",
  props: {
    step: String,
    items: Array
  },
  data() {
    console.log(1111);
    return { tableData: [] };
  },
  // components: {
  //   list: function(resolve) {
  //     require(["@/components/profile/list"], resolve);
  //   }
  // },
  mounted() {
    console.log("########: ", this.step);
    this.handleData();
  },
  methods: {
    handleData() {
      let obj = this.$store.state.supprofile;
      if (this.step === "7") {
        if (
          this.$store.state.supprofile.otherfiles &&
          this.$store.state.supprofile.otherfiles.length > 0
        ) {
          obj = this.$store.state.supprofile.otherfiles[0];
        } else {
          obj = {};
        }
      }

      console.log(obj);
      // console.log("####123");
      console.log(this.items);
      // console.log("####123");

      let arr = [];

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

        arr.push(item);
        // end if
      });

      this.tableData = arr;

      console.log(this.tableData);
    }
  }
};
</script>
<style lang="scss" scoped>
.list-box {
  padding: 15px 30px 60px;
  .table {
    margin: 0;
    padding: 0;
    width: 100%;
    td {
      border-top: 0;
      vertical-align: top;
      padding: 0;
      margin: 0;
      padding: 10px 10px 0 0;
      font-size: 14px;
      // border-top: 1px dashed #eee;
    }

    .file-link {
      text-decoration: underline;
      color: #e46623;
    }

    .td-label {
      width: 30%;
      color: #999;
    }
    .td-value {
      width: 70%;
      color: #333;
      img {
        max-width: 200px;
        height: auto;
        margin: 0;
      }
    }
  }
}
</style>


