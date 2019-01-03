<template>
  <li>
    <div @click.stop="toggle">
      <span class="caret" :class="{opened:open, closed:!open}" v-if="isFolder"></span>
      {{model.text}}
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        @selected="selectedItem"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model"
      ></item>
    </ul>
  </li>
</template>
<script>
export default {
  name: "item",
  props: {
    model: Object
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    isFolder: function() {
      return this.model.childcount > 0;
    }
  },
  mounted() {
    // console.log(this.model);
  },
  methods: {
    loadConfigs(pid, callback) {
      this.$post(
        {
          action: "P_SY_GetAreaOrType",
          p1: "2",
          p2: pid || "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];

            // console.log(arr);

            arr.forEach(ele => {
              temp.push({
                value: ele.suptypeid,
                text: ele.suptypename,
                childcount: ele.subcount
              });
            });

            // console.log(arr);

            this.model.children = temp;

            // this.typeFormData[0].options = temp;
          }

          if (callback) {
            callback();
          }
        }
      );
    },
    toggle() {
      if (this.isFolder) {
        if (this.model.children && this.model.children.length > 0) {
          this.open = !this.open;
        } else {
          this.loadConfigs(this.model.value, () => {
            this.open = !this.open;
          });
        }
      } else {
        // console.log(this.model);
        // this.$emit("selected", this.model);
        this.$emit("selected", this.model);
        this.open = false;
      }
    },
    selectedItem(e) {
      this.$emit("selected", e);
      this.open = false;
    }
  }
};
</script>
<style scoped lang="scss">
.item {
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: #333;

  .caret {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-right: 5px;
    margin-top: -2px;
    &.closed {
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 4px solid #333;
    }

    &.opened {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #333;
    }
  }
}

// .bold {
//   // font-size: 16px;
//   font-weight: 700;
//   ul,
//   li {
//     list-style: none;
//   }
// }
</style>



