<template>
  <div class="card-head">
    <h2>
      {{title}}
      <span class="float-right hn-btn-style" style="margin-top:-5px;">
        <!-- <el-button plain type="primary" @click="gotoStep">编辑</el-button> -->
        <b-button size="sm" variant="secondary-outline" @click="gotoStep">编辑</b-button>
      </span>
    </h2>
  </div>
</template>
<script>
export default {
  name: "card-head",
  props: {
    title: String,
    step: String
    // step: Number
  },
  methods: {
    gotoStep() {
      // this.$emit("edit");
      this.$post(
        {
          action: "P_SUP_CanModifySubInfo",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            this.$store.commit("changeeditstate", res.code === "0");
            this.$router.push({ name: "profile", query: { s: this.step } });
          } else {
            // alert(res.codemsg);
            this.$message({
              message: res.codemsg,
              type: "error"
            });
          }
        }
      );
    }
  }
};
</script>

