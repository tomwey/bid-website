<template>
  <div class="table-wrap">
    <div class="table-responsive">
      <table class="table table-bordered" style="table-layout: fixed;">
        <thead class="thead-light">
          <tr>
            <th
              style="text-align:center;"
              :width="field.width"
              v-for="(field, index1) in fields"
              :key="index1"
            >{{field.label}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td align="center" v-for="(field,index2) in fields" :key="index2">
              <value-item
                ref="valueItem"
                :item="item"
                :field="field.value"
                :key="itemKey"
                @previewimg="previewImage"
                v-if="field.value !== 'actions'"
              />
              <div class="actions" v-if="field.value === 'actions'">
                <span
                  class="action-btn"
                  v-for="(btn,index4) in btnActions(item)"
                  :key="index4"
                  @click="click(btn, item);"
                >
                  <v-icon :name="btn.icon" :scale="btn.scale"/>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogPreviewImageVisible" append-to-body>
      <img :src="currentImageUrl" style="max-width: 100%">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "horizontal-table",
  props: {
    items: Array,
    fields: Array,
    actions: Array
  },
  data() {
    return {
      tableData: this.items,
      itemKey: "itemkey",
      currentImageUrl: null,
      dialogPreviewImageVisible: false
    };
  },
  watch: {
    // tableData() {
    //   console.log(123);
    //   // console.log(this.$refs);
    //   // console.log(this.items);

    //   this.$refs["valueItem"].forEach(comp => {
    //     comp.reloadAnnexesIfNeeded();
    //   });
    // }
    items(newVal) {
      this.tableData = Object.assign([], this.items);
      // console.log(this.tableData);
      this.itemKey = "itemkey-" + new Date().getTime();
    }
  },
  components: {
    valueItem: function(resolve) {
      require(["@/components/profile/value-item2"], resolve);
    }
  },
  methods: {
    btnActions(item) {
      return item["actions"] || this.actions;
    },
    click(btn, item) {
      this.$emit("actionclick", { action: btn, data: item });
    },
    previewImage(url) {
      this.currentImageUrl = url;
      this.dialogPreviewImageVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.table-wrap {
  padding-bottom: 20px;
  width: 100%;
  // overflow-x: auto;
  .table {
    width: 100%;
    td {
      vertical-align: middle;
    }
  }

  .actions {
    text-align: center;
    width: 100%;
    .btn {
      // margin-bottom: 10px;
      margin: 0 5px;
    }

    .action-btn {
      display: inline-block;
      color: #333;
      cursor: pointer;
      user-select: none;
      font-size: 16px;
      padding: 10px 5px;
    }
  }
}
</style>


