<template>
  <div class="table-wrap">
    <table class="table">
      <tr>
        <th v-for="(field, index1) in fields" :key="index1">{{field.label}}</th>
      </tr>
      <tr v-for="(item, index) in items" :key="index">
        <td v-for="(field,index2) in fields" :key="index2">
          <!-- <span v-if="!item.filetype">{{item.value}}</span>
          
          <img v-if="item.filetype === 'image'" :src="item.fileurl">
          <a
            :href="item.fileurl"
            v-if="item.filetype === 'file'"
            class="file-link"
            target="_blank"
          >{{item.filename}}</a>-->
          <!-- {{item[field.value]}} -->
          <value-item :item="item" :field="field.value" v-if="field.value !== 'actions'"/>
          <div class="actions" v-if="field.value === 'actions'">
            <b-button v-for="(btn,index4) in btnActions(item)" :key="index4">{{btn.name}}</b-button>
          </div>
        </td>
      </tr>
    </table>
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
      require(["@/components/profile/value-item"], resolve);
    }
  },
  methods: {
    btnActions(item) {
      return item["actions"] || this.actions;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


