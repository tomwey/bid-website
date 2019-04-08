<template>
  <div class="project container">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/apply-notify' }">报名通知</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
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
        <el-button type="primary" @click="apply">立即报名</el-button>
      </div>
    </div>

    <el-dialog
      title="报名"
      :visible.sync="applyFormVisible"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <form-fields
        form-ref="form"
        ref="applyForm"
        :controls="applyControls"
        :form-model="applyFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "notice-detail",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      applyFormVisible: false,
      applyControls: [
        {
          id: "agency-file",
          type: 8,
          // subtype: "number",
          label: "委托书附件",
          field: "agencyfiles",
          // unit: "万",
          rules: [
            { required: true, message: "委托书附件不能为空", trigger: "blur" }
          ]
        },
        {
          id: "other-file",
          label: "其它附件",
          field: "otherfile",
          // required: true,
          type: 8
        }
      ],
      applyFormModel: {},
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
          value: `1、<strong>服务类别</strong>：类别一<br>
             2、<strong>服务区域</strong>：成都、西安<br>
             3、<strong>注册资本</strong>：1000万<br>
             4、<strong>评估分级</strong>：三级<br>
             5、<strong>档次分档</strong>：1档<br>
             6、<strong>资质要求</strong>：甲级<br>
             7、<strong>是否具备标杆企业业绩</strong>：否<br>
             8、<strong>是否要求展示区类单位</strong>：是`
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
        }
        // {
        //   label: "延迟后报名时间",
        //   value: "2019-05-23 19:30"
        // }
      ]
    };
  },
  methods: {
    back() {
      this.$router.push({ path: "/admin/apply-notify" });
    },
    apply() {
      this.applyFormVisible = true;
    },
    commit() {}
  }
};
</script>
<style lang="scss" scoped>
.project {
  // padding-top: 80px;
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


