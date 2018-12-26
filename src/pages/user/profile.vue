<template>
  <div class="profile">
    <div class="box">
      <h2>供方资料维护</h2>
      <div class="steps">
        <div
          class="step"
          :class="{active:currentStep === step.step}"
          @click="selectStep(step)"
          v-for="(step,index) in steps"
          :key="index"
        >
          <span class="step-index">{{step.step}}</span>
          {{step.name}}
        </div>
      </div>
      <div class="form-wrap">
        <base-fields
          v-if="currentStep === 1"
          v-on:reset="resetBaseForm"
          v-on:savenext="saveBaseForm"
          :readonly="false"
          :form-data="baseFormData"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "profile",
  components: {
    baseFields: function(resolve) {
      require(["@/components/profile/base-fields"], resolve);
    }
  },
  data() {
    return {
      currentStep: 1,
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
          step: 1
        },
        {
          name: "联系方式",
          step: 2
        },
        {
          name: "服务区域",
          step: 3
        },
        {
          name: "服务类别",
          step: 4
        },
        {
          name: "公司业绩",
          step: 5
        },
        {
          name: "其他信息",
          step: 6
        },
        {
          name: "其他附件",
          step: 7
        }
      ]
    };
  },
  methods: {
    selectStep(step) {
      this.currentStep = step.step;
    },
    resetBaseForm() {
      this.baseFormData.forEach(item => {
        item.value = null;
      });
    },
    saveBaseForm() {
      console.log(this.baseFormData);
      this.currentStep++;
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
}
</style>
