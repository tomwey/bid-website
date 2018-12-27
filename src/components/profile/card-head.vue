<template>
  <div class="card-head">
    <h2>
      {{title}}
      <span class="float-right" style="margin-top:-5px;">
        <b-button size="sm" @click="gotoStep">编辑</b-button>
      </span>
    </h2>
  </div>
</template>
<script>
export default {
  name: "card-head",
  props: {
    title: String
    // step: Number
  },
  methods: {
    gotoStep() {
      this.$emit("edit");
    }
  }
};
</script>

