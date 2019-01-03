<template>
  <div class="tree-data">
    <ul>
      <item
        class="item"
        @selected="selectedItem"
        v-for="(el,index) in data"
        :key="index"
        :model="el"
      ></item>
    </ul>
  </div>
</template>
<script>
export default {
  name: "tree-data",
  props: {
    data: Array
  },
  components: {
    item: function(resolve) {
      require(["@/components/tree-data/item"], resolve);
    }
  },
  mounted() {
    // console.log(this.data);
  },
  methods: {
    selectedItem(e) {
      this.$emit("selected", e);
      //   console.log(e);
      //   this.$set(this.target, "value", e);
    }
  }
};
</script>

