<template>
  <div class="fields-wrap">
    <table class="table" :class="{readonly:readonly===true}">
      <tr v-for="(item,index) in formData" :key="index">
        <td class="label">
          <label :for="item.id">
            <span class="required" v-if="!readonly && item.required">*</span>
            {{item.label}}
          </label>
        </td>
        <td class="input-control">
          <b-form-input
            :id="item.id"
            :type="item.subtype"
            v-if="item.type === 1"
            v-model="item.value"
            :placeholder="item.placeholder || `输入${item.label}` "
          ></b-form-input>
          <b-form-select
            v-if="item.type === 2"
            v-model="item.value"
            :options="item.options"
            :placeholder="item.placeholder"
          />
          <b-form-checkbox-group
            v-if="item.type === 3"
            :id="item.id"
            v-model="item.value"
            :options="item.options"
          ></b-form-checkbox-group>
          <b-form-file
            v-if="item.type === 4"
            v-model="item.value"
            :multiple="item.multiple"
            accept="image/jpeg, image/png, image/gif"
            :placeholder="item.placeholder || `选择文件`"
          ></b-form-file>
        </td>
      </tr>
      <tr v-if="!readonly">
        <td class="label"></td>
        <td class="input-control">
          <span class="custom-btn outline" @click="reset">重置</span>
          <span class="custom-btn" @click="next">下一步</span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name: "base-fields",
  props: {
    readonly: Boolean,
    formData: Array
  },
  methods: {
    reset() {
      this.$emit("reset");
    },
    next() {
      this.$emit("savenext");
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.fields-wrap {
  padding: 30px 60px;
  .table {
    margin: 0;
    padding: 0;
    width: 100%;
    &.readonly {
      border-top: 1px solid #eee;

      .form-control {
        border: 0;
      }

      .custom-select {
        background: #fff;
      }
    }

    .custom-file-input .custom-file-label::after {
      content: "浏览" !important;
    }

    td {
      vertical-align: middle;
      border-top: 0;
      padding: 0.75rem 0.75rem 0.75rem 0;
    }
    .label {
      width: 120px;
      label {
        vertical-align: middle;
        line-height: 14px;
        /* padding: 0; */
        margin: 0;
      }
      .required {
        color: $theme-color;
        font-size: 12px;
      }
    }
  }

  .custom-btn {
    display: inline-block;
    width: 160px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background: $theme-color;
    cursor: pointer;
    margin-right: 15px;
    box-sizing: content-box;
    &.outline {
      background: #fff;
      color: $theme-color;
      border: 1px solid $theme-color;
    }
  }
}
</style>


