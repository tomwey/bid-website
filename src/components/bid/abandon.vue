<template>
  <div class="abandon-wrap">
    <el-button type="danger" size="small" @click="btnClick">放弃</el-button>
    <el-dialog
      title="放弃报名"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <form-fields form-ref="form" ref="dialogForm" :controls="controls" :form-model="formModel"></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "abandon",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      controls: [
        {
          field: "reason",
          type: 2,
          label: "放弃原因",
          options: [],
          rules: [
            { required: true, message: "放弃原因不能为空", trigger: "change" }
          ]
        },
        {
          field: "file",
          type: 8,
          label: "放弃函件"
          // subtype: "textarea"
        },
        {
          field: "memo",
          type: 1,
          label: "备注信息",
          subtype: "textarea"
        }
      ],
      formModel: {}
    };
  },
  mounted() {
    this.loadOptions();
  },
  methods: {
    loadOptions() {
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "10"
        },
        res => {
          if (res.code == 0) {
            let arr = res["data"];
            let temp = [];
            arr.forEach(ele => {
              temp.push({ label: ele.sy_name, value: ele.sy_value });
            });
            this.controls[0].options = temp;
          }
        }
      );
    },
    btnClick() {
      this.formModel = {};
      this.dialogFormVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.abandon-wrap {
  display: inline-block;
}
</style>


