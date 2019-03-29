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
          <tr v-for="(item, index) in items" :key="index">
            <td align="center" v-for="(field,index2) in fields" :key="index2">
              <value-item :item="item" :field="field.value" v-if="field.value !== 'actions'"/>
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


