<template>
  <div class="home-main-wrap container">
    <!-- <div class="search-toolbar">
      <el-row>
        <el-col :span="6">
          报名截止时间:
          <el-date-picker v-model="end_date" type="date" placeholder="选择日期"></el-date-picker>
        </el-col>
        <el-col :span="6">
          报名状态:
          <el-select v-model="state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input v-model="keyword" placeholder="输入关键字搜索"></el-input>
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "bid-notice",
  data() {
    return {
      end_date: null,
      stateOptions: [
        { label: "全部", value: "-1" },
        { label: "报名中", value: "0" },
        { label: "已过期", value: "1" },
        { label: "已放弃", value: "2" }
      ],
      state: null,
      keyword: null
    };
  }
};
</script>
<style lang="scss" scoped>
</style>


