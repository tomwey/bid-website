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
          id: "service-type",
          type: 2,
          label: "服务类别",
          field: "servicetype",
          options: [],
          placeholder: "请选择服务类别",
          rules: [
            { required: true, message: "服务类别不能为空", trigger: "change" }
          ]
        },
        {
          id: "service-area",
          type: 4,
          label: "服务区域",
          field: "serverareaids",
          options: [
            {
              label: "成都",
              value: "成都"
            },
            {
              label: "西安",
              value: "西安"
            },
            {
              label: "长沙",
              value: "长沙"
            }
          ],
          rules: [
            { required: true, message: "服务区域不能为空", trigger: "change" }
          ]
        },
        {
          id: "found-money",
          type: 1,
          subtype: "number",
          label: "注册资本",
          field: "regmoney",
          unit: "万",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "grade",
          type: 2,
          label: "评估分级",
          field: "grade",
          options: [],
          placeholder: "请选择评估分级",
          rules: [
            { required: true, message: "评估分级不能为空", trigger: "change" }
          ]
        },
        {
          id: "grade1",
          type: 2,
          label: "档次分档",
          field: "grade1",
          options: [],
          placeholder: "请选择档次分档",
          rules: [
            { required: true, message: "档次分档不能为空", trigger: "change" }
          ]
        },
        {
          id: "requirement",
          type: 1,
          // subtype: "number",
          label: "资质要求",
          field: "requirement",
          // unit: "万",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "is-model",
          label: "是否具备标杆企业业绩",
          field: "ismodel",
          // required: true,
          type: 5
          // rules: [{ required: true, message: "是否主要类别", trigger: "blur" }]
        },
        {
          id: "is-company",
          label: "是否要求展示区类单位",
          field: "iscompany",
          // required: true,
          type: 5
          // rules: [{ required: true, message: "是否主要类别", trigger: "blur" }]
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


