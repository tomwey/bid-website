<template>
  <div class="project container">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/bid_notice' }">招标公告列表</el-breadcrumb-item>
        <el-breadcrumb-item>公告详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
      <h2 class="title">合能地产成都公司68亩沉降观测合同招标公告</h2>
      <div class="summary">
        <span class="date">发布日期: 2019-01-01</span>&emsp;
        <span class="company">招标单位: 成都兴露合能地产开发有限公司</span>&emsp;
        <span class="view-count">浏览次数: 135</span>
      </div>
      <div class="apply-wrapper">
        <p class="end-date-tip">
          距离报名截止日期还剩
          <span class="countdown">15天12小时32分20秒</span>
        </p>
        <!-- <el-button type="primary">立即报名</el-button> -->
      </div>
      <div class="other-info">
        <table class="table">
          <tr v-for="(item,index) in tableData" :key="index">
            <td class="label">{{item.label}}</td>
            <td class="value">
              <div class="content" v-html="item.value"></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="buttons">
        <el-button plain @click="back">返回</el-button>&emsp;
        <el-button type="primary">立即报名</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "notice-detail",
  data() {
    return {
      tableData: [
        {
          label: "招标事项",
          value: "合能地产成都公司68亩沉降观测合同招标公告"
        },
        {
          label: "招标法人主体",
          value: "成都兴露合能地产开发有限公司"
        },
        {
          label: "招标基本条件要求",
          value:
            "1、必须满足条件一<br>2、条件二<br>3、条件二<br>4、条件二<br>5、条件二"
        },
        {
          label: "公告说明",
          value:
            "这里是公告说明这里是公告说明这里是公告说明这里是公告说明这里是公告说明这里是公告说明这里是公告说明这里是公告说明这里是公告说明"
        },
        {
          label: "报名截止时间",
          value: "2019-05-03 19:30"
        },
        {
          label: "招标公告附件",
          value: `<a href="#" style="color: rgb(231,90,22);text-decoration:underline;">1、附件一</a><br><a style="color: rgb(231,90,22);text-decoration:underline;">2、附件2</a><br><a href="#" style="color: rgb(231,90,22);text-decoration:underline;">3、附件3</a>`
        },
        {
          label: "延迟后报名时间",
          value: "2019-05-23 19:30"
        }
      ]
    };
  },
  methods: {
    back() {
      this.$router.push({ path: "/bid_notice" });
    }
  }
};
</script>
<style lang="scss" scoped>
.project {
  padding-top: 80px;
  padding-bottom: 20px;
  .breadcrumb-wrapper {
    background: #fff;
    padding: 15px;
  }

  .detail {
    margin-top: 20px;
    padding: 30px 15px;
    background: #fff;
    min-height: 660px;
    .title {
      text-align: center;
      font-size: 24px;
      color: #333;
    }
    .summary {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #999;
      margin-bottom: 20px;
    }
    .apply-wrapper {
      text-align: center;
      .end-date-tip {
        font-size: 16px;
        text-align: center;
        color: #333;
        padding: 0 20px;
      }
      .countdown {
        color: rgb(231, 90, 22);
      }
    }

    .other-info {
      padding: 0 30px;
      margin-top: 30px;
      .table {
        width: 100%;
        font-size: 14px;
        color: #333;
        border: 1px solid #f2f2f2;
        tr,
        td {
          border: 1px solid #f2f2f2;
        }
        .label {
          color: #888;
          width: 180px;
        }
        // .value {
        .file-link {
          color: rgb(231, 90, 22) !important;
        }
        // }
      }
    }
    .buttons {
      text-align: center;
      margin-top: 60px;
    }
  }
}
</style>


