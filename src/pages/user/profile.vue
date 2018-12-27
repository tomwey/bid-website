<template>
  <div class="profile">
    <div class="box">
      <h2>供方资料维护</h2>
      <div class="steps">
        <div
          class="step"
          :class="{active:currentStep.step === step.step}"
          @click="selectStep(step)"
          v-for="(step,index) in steps"
          :key="index"
        >
          <span class="step-index">{{step.step}}</span>
          {{step.name}}
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-fields">
          <comm-fields
            v-if="currentStep.step === 1"
            :form-data="baseFormData"
            :ref="`step${currentStep.step}`"
          />
          <comm-fields
            v-if="currentStep.step === 6"
            :form-data="otherInfoFormData"
            :ref="`step${currentStep.step}`"
          />
          <comm-fields
            v-if="currentStep.step === 7"
            :form-data="otherFilesFormData"
            :ref="`step${currentStep.step}`"
          />
          <comm-fields
            v-if="currentStep.step === 3"
            :form-data="areaFormData"
            :ref="`step${currentStep.step}`"
          />
        </div>
        <man-list v-if="currentStep.step === 2" :items="manData" :fields="manFields"/>
        <service-type
          v-if="currentStep.step === 4"
          :items="serviceTypeData"
          :fields="serviceTypeFields"
        />
        <company-achieve
          v-if="currentStep.step === 5"
          :items="achieveData"
          :fields="achieveFields"
        />
      </div>
      <div class="buttons">
        <span class="custom-btn" @click="prevClick" v-if="currentStep.step > 1">上一步</span>
        <span class="custom-btn outline" @click="resetClick" v-if="currentStep.needReset">重置</span>
        <span class="custom-btn" @click="nextClick" v-if="currentStep.step < steps.length">下一步</span>
        <span class="custom-btn" @click="commit" v-if="currentStep.step === steps.length">保存</span>
      </div>
    </div>
  </div>
</template>
<script>
import merge from "webpack-merge";

export default {
  name: "profile",
  components: {
    commFields: function(resolve) {
      require(["@/components/profile/comm-fields"], resolve);
    },
    manList: function(resolve) {
      require(["@/components/profile/man-list"], resolve);
    },
    serviceType: function(resolve) {
      require(["@/components/profile/service-type"], resolve);
    },
    companyAchieve: function(resolve) {
      require(["@/components/profile/company-achieve"], resolve);
    }
  },
  data() {
    return {
      currentStep: null,
      achieveData: [
        {
          city: "成都",
          projname: "枫丹铂麓一期",
          partnercompany: "成都建工集团",
          isgoodcompany: "是",
          projmanager: "张三",
          contractmoney: 300000,
          contractscale: "",
          startdate: "2018-10-10",
          enddate: "2018-12-30",
          memo: "测试",
          contractfile: null
        }
      ],
      achieveFields: {
        city: {
          label: "城市"
        },
        projname: {
          label: "项目名称"
        },
        partnercompany: {
          label: "合作单位名称"
        },
        isgoodcompany: {
          label: "是否标杆企业"
        },
        projmanager: {
          label: "项目经理"
        },
        contractmoney: {
          label: "合同金额"
        },
        contractscale: {
          label: "合同规模"
        },
        startdate: {
          label: "开始日期"
        },
        enddate: {
          label: "结束日期"
        },
        memo: {
          label: "其他说明"
        },
        contractfile: {
          label: "合同附件"
        }
      },
      serviceTypeData: [
        {
          typename: "类别1",
          ismaintype: "是",
          name: "测试名字",
          zz_level: "其他",
          zz_approve_date: "2018-12-21",
          memo: ""
        },
        {
          typename: "类别1",
          ismaintype: "是",
          name: "测试名字",
          zz_level: "其他",
          zz_approve_date: "2018-12-21",
          memo: ""
        }
      ],
      serviceTypeFields: {
        typename: {
          label: "对口服务类别"
        },
        ismaintype: {
          label: "是否主要类别"
        },
        name: {
          label: "资质名称"
        },
        zz_level: {
          label: "资质级别"
        },
        zz_approve_date: {
          label: "资质审核到期日期"
        },
        memo: {
          label: "其他说明"
        }
      },
      manData: [
        {
          typename: "普通联系人",
          job: "公司总经理",
          name: "张三",
          phone: "028-81234567",
          mobile: "13012345678",
          email: "",
          idcard: "",
          shebao: "",
          entrust: ""
        },
        {
          typename: "第一联系人",
          job: "公司总经理",
          name: "张三",
          phone: "028-81234567",
          mobile: "13012345678",
          email: "",
          idcard: "",
          shebao: "",
          entrust: ""
        }
      ],
      manFields: {
        typename: {
          label: "联系人类型"
        },
        job: {
          label: "联系人职位"
        },
        name: {
          label: "联系人姓名"
        },
        phone: {
          label: "联系人电话"
        },
        mobile: {
          label: "联系人手机"
        },
        email: {
          label: "电子邮件"
        },
        idcard: {
          label: "身份证号码"
        },
        shebao: {
          label: "联系人社保证明"
        },
        entrust: {
          label: "授权委托（附件）"
        }
      },
      areaFormData: [
        {
          id: "service-area",
          type: 3,
          label: "服务区域",
          placeholder: "",
          options: [
            {
              value: "成都",
              text: "成都"
            },
            {
              value: "西安",
              text: "西安"
            },
            {
              value: "长沙",
              text: "长沙"
            },
            {
              value: "宁波",
              text: "宁波"
            },
            {
              value: "深圳",
              text: "深圳"
            }
          ],
          changeFunc: this.areaChange
          //   required: true
        },
        {
          id: "main-service-area",
          type: 6,
          label: "主要服务区域",
          options: []
        }
      ],
      otherInfoFormData: [
        {
          id: "child-company-name",
          type: 1,
          subtype: "text",
          label: "分公司信息",
          placeholder: ""
          //   required: true
        },
        {
          id: "relate-company-name",
          type: 1,
          subtype: "text",
          label: "关联公司信息",
          placeholder: ""
          //   required: true
        }
      ],
      otherFilesFormData: [
        {
          id: "finance-approve-file",
          type: 4,
          //   subtype: "file",
          label: "近三年财务审计报告(附件)",
          placeholder: ""
        },
        {
          id: "auth-license-file",
          type: 4,
          //   subtype: "file",
          label: "认证或荣誉证书(附件)",
          placeholder: ""
        },
        {
          id: "beian-file",
          type: 4,
          //   subtype: "file",
          label: "外地备案证(附件)",
          placeholder: ""
        }
      ],
      baseFormData: [
        {
          id: "company-name",
          type: 1,
          subtype: "text",
          label: "企业名称",
          placeholder: "",
          required: true
        },
        {
          id: "company-nature",
          type: 2,
          label: "企业性质",
          required: true,
          options: [
            {
              value: "null",
              text: "请选择企业性质"
            },
            {
              value: "国有企业",
              text: "国有企业"
            },
            {
              value: "中外合资企业",
              text: "中外合资企业"
            },
            {
              value: "外商独资企业",
              text: "外商独资企业"
            },
            {
              value: "私营企业",
              text: "私营企业"
            },
            {
              value: "其他",
              text: "其他"
            }
          ],
          placeholder: "请选择企业性质",
          value: null
        },
        {
          id: "company-id",
          type: 1,
          subtype: "text",
          label: "统一社会信用代码",
          placeholder: ""
        },
        {
          id: "license-file",
          type: 4,
          //   subtype: "file",
          label: "营业执照附件",
          placeholder: ""
        },
        {
          id: "tax-type",
          type: 2,
          label: "纳税人状态",
          options: [
            {
              value: "null",
              text: "请选择纳税人状态"
            },
            {
              value: "一般纳税人",
              text: "一般纳税人"
            },
            {
              value: "小规模纳税人",
              text: "小规模纳税人"
            }
          ],
          placeholder: "请选择纳税人状态",
          value: null
        },
        {
          id: "apply-cert-file",
          type: 4,
          label: "增值税一般纳税人申请认定表",
          placeholder: ""
        },
        {
          id: "found-date",
          type: 1,
          subtype: "date",
          label: "企业注册日期",
          placeholder: ""
        },
        {
          id: "found-address",
          type: 1,
          subtype: "text",
          label: "企业注册地址",
          placeholder: ""
        },
        {
          id: "found-money",
          type: 1,
          subtype: "text",
          label: "注册资本",
          placeholder: ""
        },
        {
          id: "law-man-name",
          type: 1,
          subtype: "text",
          label: "法定代表人",
          placeholder: ""
        },
        {
          id: "law-man-idcard",
          type: 1,
          subtype: "text",
          label: "法定代表人身份证",
          placeholder: ""
        },
        {
          id: "safe-product-license-file",
          type: 4,
          label: "安全生产许可证",
          placeholder: ""
        },
        {
          id: "safe-license-expire-date",
          type: 1,
          subtype: "date",
          label: "安全许可证到期日",
          placeholder: ""
        },
        {
          id: "iso-supports",
          type: 3,
          options: [
            {
              value: "9000系:质量管理体系认证",
              text: "9000系:质量管理体系认证"
            },
            {
              value: "14000系:环境管理体系认证",
              text: "14000系:环境管理体系认证"
            },
            {
              value: "18000系:职业健康安全管理体系认证",
              text: "18000系:职业健康安全管理体系认证"
            },
            {
              value: "其他",
              text: "其他"
            }
          ],
          label: "体系认证",
          placeholder: ""
        },
        {
          id: "mgr-license-file",
          type: 4,
          multiple: true,
          label: "管理体系认证（ISO9001/14001/HSE等附件）",
          placeholder: ""
        },
        {
          id: "bank-auth-file",
          type: 4,
          multiple: true,
          label: "银行信用等级和授信额度（附件）",
          placeholder: ""
        },
        {
          id: "address",
          type: 1,
          subtype: "text",
          label: "(总部)办公地址",
          placeholder: ""
        }
      ],
      steps: [
        {
          name: "基本信息",
          step: 1,
          needReset: true
        },
        {
          name: "联系方式",
          step: 2,
          needReset: false
        },
        {
          name: "服务区域",
          step: 3,
          needReset: true
        },
        {
          name: "服务类别",
          step: 4,
          needReset: false
        },
        {
          name: "公司业绩",
          step: 5,
          needReset: false
        },
        {
          name: "其他信息",
          step: 6,
          needReset: true
        },
        {
          name: "其他附件",
          step: 7,
          needReset: true
        }
      ]
    };
  },
  created() {
    // console.log(1221);
    const route = this.$router.currentRoute;
    // console.log(route);

    let stepIndex = 1;
    if (route && route.query.s) {
      stepIndex = parseInt(route.query.s);
      if (isNaN(stepIndex)) {
        stepIndex = 1;
      } else {
        if (stepIndex < 1 || stepIndex > 7) {
          stepIndex = 1;
        }
      }
    }

    this.currentStep = this.steps[stepIndex - 1];
  },
  watch: {
    currentStep: function(newVal) {
      // console.info(oldVal, newVal);
      // console.log(this.$route);
      let query = this.$route.query;
      if (query && query.s) {
        this.$router.push({
          query: merge(this.$route.query, { s: newVal.step })
        });
      }
    }
  },
  methods: {
    selectStep(step) {
      this.currentStep = step;
    },
    areaChange(vals) {
      // console.log(vals);
      //   console.log(index);
      const area = this.areaFormData[1];
      area.options = vals;
    },
    prevClick() {
      //   this.currentStep--;
      const step = this.currentStep.step - 1;
      if (step > 0) {
        this.currentStep = this.steps[step - 1];
      }
    },
    nextClick() {
      //   this.currentStep--;
      const stepIndex = this.currentStep.step - 1;
      if (stepIndex < this.steps.length - 1) {
        this.currentStep = this.steps[stepIndex + 1];
      }
    },
    resetClick() {
      const form = this.$refs[`step${this.currentStep.step}`];
      form && form.reset();
      // if (this.currentStep.step === 3) {
      //   this.areaFormData[1].options = [];
      // }
    },
    commit() {
      //   console.info(this.baseFormData);
      //   console.info(this.otherInfoFormData);
      //   console.info(this.otherFilesFormData);
      //   console.log("save");
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.profile {
  background: #fff;
  .steps {
    display: flex;
    border-bottom: 2px solid #eee;
    width: 90%;
    margin: 30px auto 0;
    min-width: 740px;
    padding: 0 10px;
    // text-align: center;
    .step {
      flex: 1;
      //   background: red;
      text-align: center;
      padding: 10px 5px;
      font-size: 14px;
      font-weight: 500;
      color: #999;
      cursor: pointer;
      user-select: none;
      &.active {
        color: #333;
        position: relative;
        .step-index {
          background: $theme-color;
        }
        &::after {
          position: absolute;
          content: "";
          display: block;
          width: 100%;
          height: 2px;
          background: $theme-color;
          left: 0;
          bottom: -2px;
        }
      }
      .step-index {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        text-align: center;
        color: #fff;

        background: #cbcbcb;
      }
    }
  }

  .form-fields {
    padding: 20px 60px;
  }

  .buttons {
    padding: 30px;
    text-align: center;
    .custom-btn {
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 40px;
      background: $theme-color;
      color: #fff;
      margin: 0 10px;
      cursor: pointer;
      box-sizing: content-box;
      user-select: none;
      &.outline {
        border: 1px solid $theme-color;
        color: $theme-color;
        background: #fff;
      }
    }
  }
}
</style>
