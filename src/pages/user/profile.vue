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
            step="1"
          />
          <comm-fields
            v-if="currentStep.step === 6"
            :form-data="otherInfoFormData"
            :ref="`step${currentStep.step}`"
            step="1"
          />
          <comm-fields
            v-if="currentStep.step === 7"
            :form-data="otherFilesFormData"
            :ref="`step${currentStep.step}`"
            step="7"
          />
          <comm-fields
            v-if="currentStep.step === 3"
            :form-data="areaFormData"
            :ref="`step${currentStep.step}`"
            @change="areaChange"
            step="1"
          />
        </div>

        <comm-form-list
          v-if="currentStep.step === 2"
          model="man"
          name="联系方式"
          :items="manData"
          @controlvaluechanged="controlValueChanged"
          :fields="manFields"
          :form-data="manFormData"
        />

        <comm-form-list
          v-if="currentStep.step === 4"
          model="service_type"
          name="服务类别"
          :items="serviceTypeData"
          :fields="serviceTypeFields"
          :form-data="serviceTypeFormData"
        />

        <div class="achieve-wrap" v-if="currentStep.step === 5">
          <div class="input-table">
            <table class="table">
              <tr>
                <td class="label">
                  <label for="year-output">年产值额</label>
                </td>
                <td class="input-control">
                  <b-input-group append="万">
                    <b-form-input
                      id="year-output"
                      v-model="achieveYearData.output"
                      placeholder="输入年产值额"
                      type="number"
                    ></b-form-input>
                  </b-input-group>
                </td>
                <td class="label">
                  <label for="year-sale">年营业额</label>
                </td>
                <td class="input-control">
                  <b-input-group append="万">
                    <b-form-input
                      id="year-sale"
                      v-model="achieveYearData.sale"
                      placeholder="输入年营业额"
                      type="number"
                    ></b-form-input>
                  </b-input-group>
                </td>
              </tr>
            </table>
          </div>

          <comm-form-list
            model="yj_data"
            name="公司业绩"
            :items="achieveData"
            :fields="achieveFields"
            :form-data="achieveFormData"
          />
        </div>
      </div>
      <div class="buttons">
        <span class="custom-btn" @click="prevClick" v-if="currentStep.step > 1">上一步</span>
        <span class="custom-btn outline" @click="resetClick" v-if="currentStep.needReset">重置</span>
        <span class="custom-btn" @click="nextClick" v-if="currentStep.step < steps.length">下一步</span>
        <span class="custom-btn" @click="commit" v-if="currentStep.step === steps.length">提交审核</span>
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
    commFormList: function(resolve) {
      require(["@/components/profile/comm-form-list"], resolve);
    }
  },
  data() {
    return {
      currentStep: null,
      achieveData: this.$store.state.supprofile.yj_data || [],
      achieveFields: [
        {
          label: "城市",
          value: "cityname"
        },
        {
          label: "项目名称",
          value: "projectname"
        },
        {
          label: "合作单位名称",
          value: "partnername"
        },
        {
          label: "是否标杆企业",
          value: "ismodel"
        },
        {
          label: "项目经理",
          value: "manager"
        },
        {
          label: "合同金额(万)",
          value: "contractmoney"
        },
        {
          label: "合同规模",
          value: "contractsize"
        },
        {
          label: "开始日期",
          value: "begindate"
        },
        {
          label: "结束日期",
          value: "enddate"
        },
        {
          label: "合同附件",
          value: "contractannex"
        },
        {
          label: "其他说明",
          value: "othermemo"
        },
        {
          label: "操作",
          value: "actions"
        }
      ],
      achieveFormData: [
        {
          id: "city",
          type: 1,
          subtype: "text",
          required: true,
          field: "cityname",
          label: "城市"
        },
        {
          id: "proj-name",
          type: 1,
          subtype: "text",
          required: true,
          field: "projectname",
          label: "项目名称"
        },
        {
          id: "partner-company",
          type: 1,
          subtype: "text",
          required: true,
          field: "partnername",
          label: "合作单位名称"
        },
        {
          id: "is-good-company",
          type: 5,
          field: "ismodel",
          required: true,
          label: "是否标杆企业",
          special_desc: "地产前100强为标杆企业"
        },
        {
          id: "proj-manager",
          type: 1,
          subtype: "text",
          required: true,
          field: "manager",
          label: "项目经理"
        },
        {
          id: "contract-money",
          type: 1,
          subtype: "number",
          required: true,
          field: "contractmoney",
          label: "合同金额",
          append: "万"
        },
        {
          id: "contract-scale",
          type: 1,
          subtype: "text",
          field: "contractsize",
          required: true,
          label: "合同规模"
        },
        {
          id: "start-date",
          type: 1,
          subtype: "date",
          required: true,
          field: "begindate",
          label: "开始日期"
        },
        {
          id: "end-date",
          type: 1,
          subtype: "date",
          required: true,
          field: "enddate",
          label: "结束日期"
        },
        {
          id: "contract-file",
          type: 4,
          required: true,
          label: "合同附件",
          field: "contractannex",
          accept: ".zip,.rar",
          upload_desc:
            "上传附件为压缩包文件，格式为：zip,rar等。（压缩包需要包含：合同封面首页图片；合同结尾页图片；合同中间页图片【内容包括范围、金额、工期】）",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Achievement_Info",
          fieldname: "contractannex"
        },
        {
          id: "summary",
          type: 1,
          subtype: "text",
          required: false,
          field: "othermemo",
          label: "其他说明"
        }
      ],
      achieveYearData: {
        output: this.$store.state.supprofile.outputvalueyear,
        sale: this.$store.state.supprofile.turnoveryear
      },
      serviceTypeData: this.$store.state.supprofile.types || [],
      serviceTypeFields: [
        {
          label: "对口服务类别",
          value: "servertype"
        },
        {
          label: "是否主要类别",
          value: "ismain"
        },
        {
          label: "资质名称",
          value: "quaname"
        },
        {
          label: "资质级别",
          value: "qualevel"
        },
        {
          label: "资质审核到期日期",
          value: "quaexaminedate"
        },
        {
          label: "其他说明",
          value: "othermemo"
        },
        {
          label: "操作",
          value: "actions"
        }
      ],
      serviceTypeFormData: [
        {
          id: "service-type",
          type: 7,
          label: "对口服务类别",
          value: null,
          field: "servertype",
          required: true,
          options: []
        },
        {
          id: "is-main-type",
          label: "是否主要类别",
          field: "ismain",
          required: true,
          type: 5
        },
        {
          id: "zz-name",
          type: 1,
          subtype: "text",
          required: true,
          field: "quaname",
          label: "资质名称"
        },
        {
          id: "zz-level",
          type: 1,
          subtype: "text",
          field: "qualevel",
          label: "资质级别"
        },
        {
          id: "zz-approve-date",
          type: 1,
          subtype: "date",
          label: "资质审核到期日期",
          field: "quaexaminedate",
          required: true
        },
        {
          id: "memo",
          type: 1,
          subtype: "text",
          label: "其他说明",
          field: "othermemo",
          required: true
        }
      ],
      manData: this.$store.state.supprofile.man || [],
      manFormData: [
        {
          id: "contact-type",
          label: "联系人类型",
          type: 2,
          required: true,
          value: null,
          field: "contacttype",
          options: [
            {
              value: null,
              text: "选择联系人类型"
            }
          ]
          // changeFunc: this.changeContactType
        },
        {
          id: "contact-job",
          label: "联系人职位",
          type: 2,
          value: null,
          required: true,
          field: "contactposition",
          options: []
        },
        {
          id: "name",
          label: "联系人姓名",
          required: true,
          field: "contactname",
          type: 1,
          subtype: "text"
          // value: null
        },
        {
          id: "phone",
          label: "联系人电话",
          required: true,
          field: "contacttel",
          type: 1,
          subtype: "tel"
          // value: null
        },
        {
          id: "mobile",
          label: "联系人手机",
          required: true,
          type: 1,
          field: "contactphone",
          subtype: "tel"
          // value: null
        },
        {
          id: "email",
          label: "电子邮件",
          required: false,
          type: 1,
          field: "email",
          subtype: "email"
          // value: null
        },
        {
          id: "idcard",
          label: "身份证号码",
          required: false,
          field: "contactidno",
          type: 1,
          subtype: "text"
          // value: null
        }
      ],
      manFields: [
        {
          label: "联系人类型",
          value: "contacttype"
        },
        {
          label: "联系人职位",
          value: "contactposition"
        },
        {
          label: "联系人姓名",
          value: "contactname"
        },
        {
          label: "联系人电话",
          value: "contacttel"
        },
        {
          label: "联系人手机",
          value: "contactphone"
        },
        {
          label: "电子邮件",
          value: "email"
        },
        {
          label: "身份证号码",
          value: "contactidno"
        },
        {
          label: "联系人社保证明",
          value: "sscertificateannex"
        },
        {
          label: "附件委托",
          value: "authdelegationannex"
        },
        {
          label: "操作",
          value: "actions"
        }
      ],
      areaFormData: [
        {
          id: "service-area",
          type: 3,
          label: "服务区域",
          placeholder: "",
          required: true,
          field: "serverareaids",
          options: []
          //   required: true
        },
        {
          id: "main-service-area",
          type: 6,
          label: "主要服务区域",
          field: "mainareaid",
          options: [],
          required: true
        }
      ],
      otherInfoFormData: [
        {
          id: "child-company-name",
          type: 1,
          subtype: "text",
          label: "分公司信息",
          field: "branchinfo",
          placeholder: ""
          //   required: true
        },
        {
          id: "relate-company-name",
          type: 1,
          subtype: "text",
          label: "关联公司信息",
          field: "relateinfo",
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
          placeholder: "",
          field: "threeyfinancialreports",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_OtherAnnex_Info",
          fieldname: "threeyfinancialreports"
        },
        {
          id: "auth-license-file",
          type: 4,
          //   subtype: "file",
          label: "认证或荣誉证书(附件)",
          placeholder: "",
          field: "honorcertificate",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_OtherAnnex_Info",
          fieldname: "honorcertificate"
        },
        {
          id: "beian-file",
          type: 4,
          //   subtype: "file",
          label: "外地备案证(附件)",
          placeholder: "",
          field: "fieldcertificate",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_OtherAnnex_Info",
          fieldname: "fieldcertificate"
        }
      ],
      baseFormData: [
        {
          id: "company-name",
          type: 1,
          subtype: "text",
          label: "企业名称",
          placeholder: "",
          required: true,
          field: "comname",
          readonly: false
        },
        {
          id: "company-nature",
          type: 2,
          label: "企业性质",
          required: true,
          field: "comtype",
          options: [
            {
              value: "null",
              text: "请选择企业性质"
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
          placeholder: "",
          field: "comuscc",
          required: true,
          readonly: false
        },
        {
          id: "company-id-exp",
          type: 1,
          subtype: "date",
          label: "统一社会信用代码有效期",
          placeholder: "",
          field: "comusccinvaliddate",
          required: true
        },
        {
          id: "license-file",
          type: 4,
          //   subtype: "file",
          label: "营业执照附件",
          placeholder: "",
          field: "combi",
          required: true,
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "ComBI"
        },
        {
          id: "tax-type",
          type: 2,
          label: "纳税人状态",
          field: "taxpayerstate",
          options: [
            {
              value: "null",
              text: "请选择纳税人状态"
            }
          ],
          placeholder: "请选择纳税人状态",
          value: null
        },
        {
          id: "apply-cert-file",
          type: 4,
          label: "增值税一般纳税人申请认定表",
          placeholder: "",
          field: "addtaxapplytable",
          required: true,
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "addtaxapplytable"
        },
        {
          id: "found-date",
          type: 1,
          subtype: "date",
          label: "企业注册日期",
          placeholder: "",
          field: "comregdate",
          required: true
        },
        {
          id: "found-address",
          type: 1,
          subtype: "text",
          label: "企业注册地址",
          field: "comregaddr",
          placeholder: "",
          required: true
        },
        {
          id: "found-money",
          type: 1,
          subtype: "number",
          label: "注册资本",
          placeholder: "",
          field: "regmoney",
          required: true,
          append: "万"
        },
        {
          id: "law-man-name",
          type: 1,
          subtype: "text",
          label: "法定代表人",
          field: "corporateman",
          placeholder: "",
          required: true
        },
        {
          id: "law-man-idcard",
          type: 1,
          subtype: "text",
          label: "法定代表人身份证",
          field: "corporatemanidno",
          placeholder: ""
        },
        {
          id: "safe-product-license-file",
          type: 4,
          label: "安全生产许可证",
          field: "safeproductionl",
          placeholder: "",
          required: false,
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "safeproductionl"
        },
        {
          id: "safe-license-expire-date",
          type: 1,
          subtype: "date",
          label: "安全许可证到期日",
          placeholder: "",
          field: "safeproductionldate",
          required: false
        },
        {
          id: "iso-supports",
          type: 3,
          options: [],
          label: "体系认证",
          field: "sysauth",
          placeholder: ""
        },
        {
          id: "zliang-license-file",
          type: 4,
          // multiple: true,
          label: "质量保证体系认证文件（附件）",
          field: "quaauthannex",
          placeholder: "",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "quaauthannex"
        },
        {
          id: "mgr-license-file",
          type: 4,
          // multiple: false,
          label: "管理体系认证（ISO9001/14001/HSE等附件）",
          field: "manageauthannex",
          placeholder: "",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "manageauthannex"
        },
        {
          id: "bank-auth-file",
          type: 4,
          // multiple: true,
          label: "银行信用等级和授信额度（附件）",
          placeholder: "",
          field: "banklevelandcredit",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "banklevelandcredit"
        },
        {
          id: "address",
          type: 1,
          subtype: "text",
          label: "(总部)办公地址",
          placeholder: "",
          required: true,
          field: "hqaddr"
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
          needReset: false
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
  mounted() {
    this.loadBaseConfigData();

    this.loadManConfigs();

    this.loadServiceTypeConfigs();

    // if (this.$store.state.supinfo.supid && this.$store.state.supinfo.canedit) {
    // this.loadProfileData(1);
    // this.loadProfileData(2);
    // this.loadProfileData(4);
    // this.loadProfileData(5);
    // this.loadProfileData(7);
    this.populateData();
    // }
  },
  watch: {
    currentStep: function(newVal) {
      let query = this.$route.query;
      if (query && query.s) {
        this.$router.push({
          query: merge(this.$route.query, { s: newVal.step })
        });
      }
    }
    // $route: function(to) {
    //   console.log(to);
    // }
  },
  methods: {
    loadServiceTypeConfigs() {
      this.$post(
        {
          action: "P_SY_GetAreaOrType",
          p1: "2",
          p2: "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];

            // console.log(arr);

            arr.forEach(ele => {
              temp.push({
                value: ele.suptypeid,
                text: ele.suptypename,
                childcount: ele.subcount
              });
            });

            // console.log(arr);

            this.serviceTypeFormData[0].options = temp;
          }
        }
      );
    },
    controlValueChanged(val) {
      console.log(val);
      let control = val.control;
      if (control.id !== "contact-type") return;

      val = val.data;

      if (!val) return;

      val = val.split("-");
      if (val.length !== 2) return;
      val = val[1];

      if (val === "1") {
        if (this.manFormData.length === 7) {
          const fields = [
            {
              id: "shebao",
              label: "联系人社保证明",
              required: true,
              field: "sscertificateannex",
              type: 4,
              subtype: 1,
              domanid: this.$store.state.supinfo.accountid || "0",
              tablename: "H_Sup_Contact_Info",
              fieldname: "sscertificateannex"
            },
            {
              id: "entrust",
              label: "授权委托（附件）",
              required: true,
              field: "authdelegationannex",
              type: 4,
              subtype: 2, // 普通文件
              domanid: this.$store.state.supinfo.accountid || "0",
              tablename: "H_Sup_Contact_Info",
              fieldname: "authdelegationannex"
              //   subtype: "text"
            }
          ];
          this.manFormData = this.manFormData.concat(fields);
        }
      } else {
        if (this.manFormData.length === 9) {
          this.manFormData.splice(this.manFormData.length - 1, 1);
          this.manFormData.splice(this.manFormData.length - 1, 1);
        }
      }
    },
    loadManConfigs() {
      // 联系人类型
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "3",
          p2: "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [
              {
                value: null,
                text: "请选择联系人类型"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: `${ele.sy_name}-${ele.sy_value}`,
                text: ele.sy_name
              });
            });
            this.manFormData[0].options = temp;
          }
        }
      );

      // 联系人职位
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "4",
          p2: "0"
        },
        res => {
          if (res.code === "0") {
            let arr = res.data;
            let temp = [
              {
                value: null,
                text: "请选择联系人职位"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: `${ele.sy_name}-${ele.sy_value}`,
                text: ele.sy_name
              });
            });
            this.manFormData[1].options = temp;
          }
        }
      );
    },
    populateData() {
      // 填充主数据表单
      let object = this.$store.state.supprofile;

      this.baseFormData[0].readonly = !!this.$store.state.supid;
      this.baseFormData[2].readonly = !!this.$store.state.supid;

      this.baseFormData.forEach(control => {
        if (control.type === 3) {
          control.value =
            object[control.field] && object[control.field].split(",");
        } else if (control.type === 1 && control.subtype === "date") {
          control.value =
            object[control.field] && object[control.field].split(" ")[0];
        } else if (control.type === 4) {
          // 文件附件
          control.value = object[control.field] || "";

          const nameKey = control.field + "name";
          const urlKey = control.field + "url";
          if (object[urlKey] && object[nameKey]) {
            let fileUrl = object[urlKey];
            let fileName = object[nameKey];
            control._fileurl = fileUrl;
            control._filename = fileName;
            control._isimage =
              fileName.indexOf(".png") !== -1 ||
              fileName.indexOf(".gif") !== -1 ||
              fileName.indexOf(".jpg") !== -1 ||
              fileName.indexOf(".jpeg") !== -1 ||
              fileName.indexOf(".webp") !== -1;
          }
        } else {
          control.value =
            object[control.field + "str"] || object[control.field];
        }
      });
      // 填充其它信息
      this.otherInfoFormData.forEach(control => {
        control.value = object[control.field];
      });

      // console.log(this.areaFormData);

      // 填充业绩数据
      this.achieveYearData.output = object["outputvalueyear"];
      this.achieveYearData.sale = object["turnoveryear"];

      // 填充其它附件
      let files = this.$store.state.supprofile.otherfiles || [];
      if (files.length > 0) {
        let object = files[0];
        // console.log(object);
        this.otherFilesFormData.forEach(control => {
          control.value = object[control.field];

          if (control.type === 4) {
            // 文件附件
            const nameKey = control.field + "name";
            const urlKey = control.field + "url";
            // console.log(nameKey);
            if (object[urlKey] && object[nameKey]) {
              let fileUrl = object[urlKey];
              let fileName = object[nameKey];
              control._fileurl = fileUrl;
              control._filename = fileName;
              control._isimage =
                fileName.indexOf(".png") !== -1 ||
                fileName.indexOf(".gif") !== -1 ||
                fileName.indexOf(".jpg") !== -1 ||
                fileName.indexOf(".jpeg") !== -1 ||
                fileName.indexOf(".webp") !== -1;
            }
          }
        });
      }

      // console.log(this.otherFilesFormData);
    },
    loadProfileData(step) {
      this.$post(
        {
          action: "P_SUP_GetSupInfo",
          p1: this.$store.state.supinfo.accountid,
          p2: this.$store.state.token,
          p3: step
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            if (arr.length > 0) {
              let object = arr[0];
              // console.log(object);
              if (step == 1) {
                this.baseFormData.forEach(control => {
                  if (control.type === 3) {
                    control.value =
                      object[control.field] && object[control.field].split(",");
                  } else if (control.type === 1 && control.subtype === "date") {
                    control.value =
                      object[control.field] &&
                      object[control.field].split(" ")[0];
                  } else if (control.type === 4) {
                    // 文件附件
                    control.value = object[control.field] || "";

                    const nameKey = control.field + "name";
                    const urlKey = control.field + "url";
                    if (object[urlKey] && object[nameKey]) {
                      let fileUrl = object[urlKey];
                      let fileName = object[nameKey];
                      control._fileurl = fileUrl;
                      control._filename = fileName;
                      control._isimage =
                        fileName.indexOf(".png") !== -1 ||
                        fileName.indexOf(".gif") !== -1 ||
                        fileName.indexOf(".jpg") !== -1 ||
                        fileName.indexOf(".jpeg") !== -1 ||
                        fileName.indexOf(".webp") !== -1;
                    }
                  } else {
                    control.value =
                      object[control.field + "str"] || object[control.field];
                  }
                });

                // console.log(object);
                // console.log(this.baseFormData);

                this.otherInfoFormData.forEach(control => {
                  control.value = object[control.field];
                });

                this.areaFormData.forEach(control => {
                  if (control.type === 3) {
                    control.value =
                      object[control.field] && object[control.field].split(",");
                    const options = control.value || [];
                    const cities = this.areaFormData[0].options || [];

                    let temp = [];
                    options.forEach(v => {
                      for (let i = 0; i < cities.length; i++) {
                        if (v === cities[i].value) {
                          temp.push(cities[i]);
                          break;
                        }
                      }
                    });

                    this.areaFormData[1].options = temp;
                  } else {
                    control.value = object[control.field];
                  }
                });

                this.achieveYearData.output = object["outputvalueyear"];
                this.achieveYearData.sale = object["turnoveryear"];
              } else {
                // console.info(step, res);
                if (step == 2) {
                  this.manData = res.data;
                } else if (step == 4) {
                  this.serviceTypeData = res.data;
                } else if (step == 5) {
                  this.achieveData = res.data;
                } else if (step == 7) {
                  this.otherFilesFormData.forEach(control => {
                    control.value = obj[control.field];

                    if (control.type === 4) {
                      // 文件附件
                      const nameKey = control.field + "name";
                      const urlKey = control.field + "url";
                      if (object[urlKey] && object[nameKey]) {
                        let fileUrl = object[urlKey];
                        let fileName = object[nameKey];
                        control._fileurl = fileUrl;
                        control._filename = fileName;
                        control._isimage =
                          fileName.indexOf(".png") !== -1 ||
                          fileName.indexOf(".gif") !== -1 ||
                          fileName.indexOf(".jpg") !== -1 ||
                          fileName.indexOf(".jpeg") !== -1 ||
                          fileName.indexOf(".webp") !== -1;
                      }
                    }
                  });
                }
              }
            }
          }
        }
      );
    },
    populateAreaData() {
      let object = this.$store.state.supprofile;

      this.areaFormData.forEach(control => {
        if (control.type === 3) {
          // console.log(object);
          let options = [];
          if (object[control.field]) {
            options = object[control.field].split(",");
          }

          control.value = options;

          const cities = this.areaFormData[0].options || [];
          let temp = [];
          options.forEach(v => {
            for (let i = 0; i < cities.length; i++) {
              if (v == cities[i].value) {
                temp.push(cities[i]);
                break;
              }
            }
          });

          this.areaFormData[1].options = temp;
        } else {
          control.value = object[control.field];
        }
      });
    },
    loadBaseConfigData() {
      // 获取企业性质
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "2",
          p2: "0"
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            let temp = [
              {
                value: null,
                text: "请选择企业性质"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: ele.sy_value,
                text: ele.sy_name
              });
            });
            this.baseFormData[1].options = temp;
          }
        }
      );
      // 获取纳税人状态
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "5",
          p2: "0"
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            let temp = [
              {
                value: null,
                text: "请选择纳税人状态"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: ele.sy_value,
                text: ele.sy_name
              });
            });
            this.baseFormData[5].options = temp;
          }
        }
      );
      // 获取体系认证
      this.$post(
        {
          action: "P_SY_GetParamInfo",
          p1: "6",
          p2: "0"
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];
            arr.forEach(ele => {
              temp.push({
                value: ele.sy_value,
                text: ele.sy_name
              });
            });
            this.baseFormData[14].options = temp;
          }
        }
      );
      // 获取服务区域

      this.$post(
        {
          action: "P_SY_GetAreaOrType",
          p1: "1",
          p2: "0"
        },
        res => {
          // console.log(res);
          if (res.code === "0") {
            let arr = res.data;
            let temp = [];
            arr.forEach(ele => {
              temp.push({
                value: ele.area_id,
                text: ele.area_name
              });
            });
            this.areaFormData[0].options = temp;

            this.populateAreaData();
          }
        }
      );
    },
    selectStep(step) {
      this.currentStep = step;
    },
    areaChange(ev) {
      // console.log(ev);
      const control = ev.control;
      const data = ev.data;

      const areas = this.areaFormData[0].options;
      control.value = data;

      let arr = [];
      data.forEach(id => {
        for (let index = 0; index < areas.length; index++) {
          const element = areas[index];
          if (element.value === id) {
            arr.push(JSON.parse(JSON.stringify(element)));
            break;
          }
        }
      });

      const area = this.areaFormData[1];
      area.options = arr;

      let index = data.indexOf(area.value);
      if (index === -1) {
        area.value = null;
      }
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
    _fillData(formData, params) {
      // console.log(formData);

      formData.forEach(control => {
        let val = control.value;
        if (control.type === 5) {
          val = val === true ? "1" : "0";
        } else if (control.type === 3) {
          val = val || [];
          val = val.join(",");
        } else {
          val = val || "";
        }
        // console.log(control.field);
        params[control.field] = val;
      });
    },
    commit() {
      let params = { action: "updatesupinfo" };
      console.log(this.baseFormData);
      // 填充基础数据
      this._fillData(this.baseFormData, params);

      // console.log(this.achieveYearData);

      params["outputvalueyear"] = this.achieveYearData.output || "0";
      params["turnoveryear"] = this.achieveYearData.sale || "0";

      // 填充其它信息
      this._fillData(this.otherInfoFormData, params);

      // 填充区域信息
      this._fillData(this.areaFormData, params);

      params["_loginuid"] = this.$store.state.supinfo.accountid;

      params["token"] = this.$store.state.token;

      // 填充联系人信息
      params["man"] =
        (this.manData.length === 0
          ? this.$store.state.supprofile.man
          : this.manData) || [];

      // 填充服务类别
      params["types"] =
        this.serviceTypeData.length === 0
          ? this.$store.state.supprofile.types
          : this.serviceTypeData;

      // 填充公司业绩
      params["achievements"] =
        this.achieveData.length === 0
          ? this.$store.state.supprofile.yj_data
          : this.achieveData;

      // 填充其它附件信息
      let fileObj = {};
      this.otherFilesFormData.forEach(control => {
        if (control.value) {
          fileObj[control.field] = control.value;
        }
      });

      params["otherfiles"] = [fileObj];

      console.log(params);

      this.$post(params, res => {
        // console.log(res);
        if (res.code === "0") {
          alert("提交成功");
          this.$router.replace({ path: "/admin/company" });
        } else {
          console.log(res.codemsg);

          alert(res.codemsg);
        }
      });
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

.achieve-wrap {
  .input-table {
    padding: 0 15px;
  }
  .table {
    margin: 0;
    padding: 0;

    td {
      border-top: 0;
      vertical-align: middle;
    }

    .label {
      width: 80px;
      &:first-child {
        padding-left: 0;
        padding-right: 0;
      }

      label {
        vertical-align: middle;
        line-height: 14px;
        /* padding: 0; */
        margin: 0;
      }
      // .required {
      //   color: $theme-color;
      //   font-size: 12px;
      // }
    }

    .input-control {
      width: calc(100% - 160px) / 2;
      padding-left: 0;
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
</style>
