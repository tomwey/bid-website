<template>
  <div class="profile" v-loading="commiting">
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
          @editform="editManForm"
          :form-data="manFormData"
        />

        <comm-form-list
          v-if="currentStep.step === 4"
          model="service_type"
          name="服务类别"
          :items="serviceTypeData"
          @controlvaluechanged="serviceTypeChanged"
          :fields="serviceTypeFields"
          @editform="editServiceForm"
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
            @editform="editAchieveForm"
            :form-data="achieveFormData"
          />
        </div>
      </div>
      <div class="buttons">
        <span class="custom-btn" @click="prevClick" v-if="currentStep.step > 1">上一步</span>
        <span class="custom-btn outline" @click="resetClick" v-if="currentStep.needReset">重置</span>
        <span class="custom-btn" @click="saveDraft">保存</span>
        <span class="custom-btn" @click="nextClick" v-if="currentStep.step < steps.length">下一步</span>
        <span
          class="custom-btn"
          :class="{disabled:commiting===true}"
          @click="commit"
          v-if="currentStep.step === steps.length"
        >{{commitBtnText}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import merge from "webpack-merge";
import tableFields from "@/utils/table-fields";

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
      commiting: false,
      achieveFields: [
        {
          label: "操作",
          value: "actions",
          width: 80
        }
      ].concat(tableFields.achieve),
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
          id: "service-type",
          type: 7,
          label: "服务类别",
          value: null,
          field: "suptype",
          required: true,
          options: []
        },
        {
          id: "server-content",
          type: 1,
          subtype: "text",
          required: false,
          field: "servercontent",
          label: "服务内容"
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
          label: "合同体量"
        },
        {
          id: "start-date",
          type: 12,
          // subtype: "date",
          required: true,
          field: "begindate",
          label: "开始日期",
          value: null
        },
        {
          id: "end-date",
          type: 12,
          // subtype: "date",
          required: true,
          field: "enddate",
          label: "结束日期",
          value: null
        },
        {
          id: "contract-file",
          type: 4,
          required: true,
          label: "合同附件",
          field: "contractannex",
          accept: ".zip,.rar",
          upload_desc:
            "上传附件为压缩包文件，格式为：zip,rar等。（1个合同上传不超过5页，压缩包需要包含：合同封面首页、合同结尾页、合同实质内容页面（合同范围、内容、工期、项目团队）",
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
          label: "操作",
          value: "actions",
          width: 80
        }
      ].concat(tableFields.serviceType),
      serviceTypeFormData: [
        {
          id: "service-type",
          type: 7,
          label: "对口服务类别",
          value: null,
          field: "servertype",
          required: true,
          options: [],
          assoc_control_id: "zz-name"
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
          type: 2,
          // subtype: "text",
          options: [
            {
              text: "无",
              value: null
            }
          ],
          value: null,
          required: false,
          field: "quaid",
          label: "资质名称"
        },
        // {
        //   id: "zz-level",
        //   type: 1,
        //   subtype: "text",
        //   field: "qualevel",
        //   label: "资质级别"
        // },
        {
          id: "zz-approve-date",
          type: 12,
          // subtype: "date",
          label: "资质审核到期日期",
          field: "quaexaminedate",
          required: true,
          value: null
        },
        {
          id: "memo",
          type: 1,
          subtype: "text",
          label: "其他说明",
          field: "othermemo",
          required: false
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
          subtype: "tel",
          pattern: /^1[3456789]\d{9}$/
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
          required: true,
          field: "contactidno",
          type: 1,
          subtype: "text",
          pattern: /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
          // value: null
        }
      ],
      manFields: [
        {
          label: "操作",
          value: "actions",
          width: 80
        }
      ].concat(tableFields.man),
      areaFormData: [
        {
          id: "service-area",
          type: 3,
          label: "服务城市",
          placeholder: "",
          required: true,
          field: "serverareaids",
          options: []
          //   required: true
        },
        {
          id: "main-service-area",
          type: 6,
          label: "主要服务城市",
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
          label: "分公司信息（含地址、电话）",
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
          type: 12,
          // subtype: "date",
          label: "统一社会信用代码有效期",
          placeholder: "",
          field: "comusccinvaliddate",
          required: true,
          value: null
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
          id: "company-id-exp",
          type: 12,
          label: "企业注册日期",
          placeholder: "",
          field: "comregdate",
          required: true,
          value: null
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
          label: "法定代表人身份证号码",
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
          type: 12,
          label: "安全许可证到期日",
          placeholder: "",
          field: "safeproductionldate",
          required: false,
          value: null
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
          name: "服务城市",
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
    // console.log(456);
    this.loadBaseConfigData();

    this.loadManConfigs();

    this.loadServiceTypeConfigs();

    this.populateData();
    // console.log(this.$store.state.supprofile);
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
  computed: {
    commitBtnText() {
      return this.commiting ? "正在提交..." : "提交审核";
    }
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
            this.achieveFormData[4].options = temp;
          }
        }
      );
    },
    serviceTypeChanged(val) {
      // console.log(val);
      // this.manFormData.length ==
      const control = val.control;
      const value = val.data;
      let idVal = (value || {}).value;
      if (idVal) {
        let arr = idVal.split("-");
        if (arr.length > 1) {
          idVal = arr[1];
        }
      }

      if (control.field == "servertype") {
        this.$post(
          {
            action: "P_SY_GetAreaOrType",
            p1: "5",
            p2: idVal || ""
          },
          res => {
            if (res.code === "0") {
              let arr = res.data;
              let temp = [{ text: "无", value: null }];

              // console.log(arr);

              arr.forEach(ele => {
                if (!!ele.supqualistid && !!ele.supqualistname) {
                  temp.push({
                    value: `${ele.supqualistname}-${ele.supqualistid}`,
                    text: ele.supqualistname
                  });
                }
              });

              for (let i = 0; i < this.serviceTypeFormData.length; i++) {
                const con = this.serviceTypeFormData[i];
                if (con.id == control.assoc_control_id) {
                  con.options = temp;
                  break;
                }
              }
            }
          }
        );
      } else if (control.field == "quaid") {
        // 资质名称
        // console.log(value);
        let sVals = (value || "").split("-");
        let id_str = "";
        if (sVals.length === 2) {
          id_str = sVals[1];
        }
        this.$post(
          {
            action: "P_SY_GetAreaOrType",
            p1: "4",
            p2: id_str
          },
          res => {
            if (res.code === "0") {
              let arr = res.data;

              if (arr.length === 0) {
                // 需要删掉添加的资质级别
                if (this.serviceTypeFormData.length === 6) {
                  this.serviceTypeFormData.splice(3, 1);
                }
              } else {
                let srcData = val.srcData || {};

                let currVal = null;
                if (srcData.qualevelidname && srcData.qualevelid) {
                  currVal = `${srcData.qualevelidname}-${srcData.qualevelid}`;
                }

                // 需要新增一个资质级别的字段
                if (this.serviceTypeFormData.length === 5) {
                  let temp = [{ text: "请选择资质级别", value: null }];
                  arr.forEach(ele => {
                    temp.push({
                      value: `${ele.supquagradename}-${ele.supquagradeid}`,
                      text: ele.supquagradename
                    });
                  });
                  this.serviceTypeFormData.splice(3, 0, {
                    id: "zz-level",
                    type: 2,
                    // subtype: "text",
                    options: temp,
                    value: currVal,
                    required: true,
                    field: "qualevelid",
                    label: "资质级别"
                  });
                }
              }
            }
          }
        );
      }
    },
    editManForm(data) {
      // console.log(data);
      data = data || {};

      if (data["contacttype"] == "1" || data["contacttype"] == "第一联系人") {
        this.controlValueChanged({
          control: this.manFormData[0],
          data: `${data["contacttype"]}-${data["contacttype"]}`
        });
      }

      this.manFormData.forEach(control => {
        if (control.type === 2) {
          // console.log(data);
          if (data[control.field]) {
            control.value = `${data[control.field + "name"]}-${
              data[control.field]
            }`;
          } else {
            control.value = null;
          }
          if (control.field == "quaid" && data["quaid"] == "0") {
            control.value = null;
          }
        } else if (control.type === 4) {
          if (control.field) {
            // 文件附件
            const nameKey = control.field + "name";
            const urlKey = control.field + "url";
            if (data[control.field + "_files"]) {
              control[control.field + "_files"] =
                data[control.field + "_files"];
              control.value = data[control.field] || null;
            } else if (data[urlKey] && data[nameKey]) {
              let fileUrl = data[urlKey];
              let fileName = data[nameKey];
              let file = {
                _fileurl: fileUrl,
                _filename: fileName,
                _isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              };
              control[control.field + "_files"] = [file];
              control.value = data[control.field] || null;
              // console.log(control);
            }
          }
        } else if (control.type === 7) {
          // 树形控件
          control.value = {
            value: data[control.field],
            text: data[control.field + "name"],
            childcount: 0
          };
        } else {
          control.value = data[control.field];
        }
      });
    },
    editServiceForm(data) {
      // console.log(data);
      data = data || {};

      this.serviceTypeFormData.forEach(control => {
        if (control.type === 2) {
          // console.log(data);
          if (data[control.field]) {
            control.value = `${data[control.field + "name"]}-${
              data[control.field]
            }`;
          } else {
            control.value = null;
          }
          if (control.field == "quaid" && data["quaid"] == "0") {
            control.value = null;
          }
        } else if (control.type === 4) {
          if (control.field) {
            // 文件附件
            const nameKey = control.field + "name";
            const urlKey = control.field + "url";
            if (data[control.field + "_files"]) {
              control[control.field + "_files"] =
                data[control.field + "_files"];
              control.value = data[control.field] || null;
            } else if (data[urlKey] && data[nameKey]) {
              let fileUrl = data[urlKey];
              let fileName = data[nameKey];
              let file = {
                _fileurl: fileUrl,
                _filename: fileName,
                _isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              };
              control[control.field + "_files"] = [file];
              control.value = data[control.field] || null;
              // console.log(control);
            }
          }
        } else if (control.type === 7) {
          // 树形控件
          control.value = {
            value: data[control.field] || data[control.field + "id"],
            text: data[control.field + "name"],
            childcount: 0
          };
        } else {
          control.value = data[control.field];
        }
      });

      let typeControl = this.serviceTypeFormData[0];
      this.serviceTypeChanged({
        control: typeControl,
        data: { text: data["servertypename"], value: data["servertypeid"] },
        srcData: Object.assign({}, data)
      });

      let quaControl = this.serviceTypeFormData[2];
      this.serviceTypeChanged({
        control: quaControl,
        data: `${data["quaidname"]}-${data["quaid"]}`,
        srcData: Object.assign({}, data)
      });
    },
    editAchieveForm(data) {
      // console.log(data);

      data = data || {};

      this.achieveFormData.forEach(control => {
        if (control.type === 2) {
          // console.log(data);
          if (data[control.field]) {
            control.value = `${data[control.field + "name"]}-${
              data[control.field]
            }`;
          } else {
            control.value = null;
          }
          if (control.field == "quaid" && data["quaid"] == "0") {
            control.value = null;
          }
        } else if (control.type === 4) {
          if (control.field) {
            // 文件附件
            const nameKey = control.field + "name";
            const urlKey = control.field + "url";
            if (data[control.field + "_files"]) {
              control[control.field + "_files"] =
                data[control.field + "_files"];
              control.value = data[control.field] || null;
            } else if (data[urlKey] && data[nameKey]) {
              let fileUrl = data[urlKey];
              let fileName = data[nameKey];
              let file = {
                _fileurl: fileUrl,
                _filename: fileName,
                _isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              };
              control[control.field + "_files"] = [file];
              control.value = data[control.field] || null;
              // console.log(control);
            }
          }
        } else if (control.type === 7) {
          // 树形控件
          control.value = {
            value: data[control.field],
            text: data[control.field + "name"],
            childcount: 0
          };
        } else {
          control.value = data[control.field];
        }
      });
    },
    controlValueChanged(val) {
      // console.log(val);
      if (!val) {
        return;
      }

      let control = val.control;
      if (control.id !== "contact-type") return;

      val = val.data;

      if (!val) {
        return;
      }

      val = val.split("-");
      if (val.length !== 2) return;
      val = val[1];

      if (val === "1" || val === "第一联系人") {
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
              fieldname: "authdelegationannex",
              accept: "*",
              upload_desc: "请下载授权委托书模板，填写并盖公章后扫描上传",
              tpl_file: {
                name: "授权委托书模板",
                url:
                  "http://erp20-app.heneng.cn:16681/file/erp20-annex.heneng.cn/H_WF_INST_M/2019-01-08/1246140/合能集团采购平台第一联系人授权函(1).docx"
              }
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

      // console.log(this.$store.state.supinfo);
      this.baseFormData[0].readonly = this.baseFormData[2].readonly =
        object.comname && object.comname.length > 0;

      this.baseFormData.forEach(control => {
        if (control.field == "comuscc" || control.field == "comname") {
          control.readonly = object["canmodify"] === "false";
          // console.log(object);
          // console.log(11111);
        }

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

            let file = {
              _fileurl: fileUrl,
              _filename: fileName,
              _isimage:
                fileName.indexOf(".png") !== -1 ||
                fileName.indexOf(".gif") !== -1 ||
                fileName.indexOf(".jpg") !== -1 ||
                fileName.indexOf(".jpeg") !== -1 ||
                fileName.indexOf(".webp") !== -1
            };
            control[control.field + "_files"] = [file];
            // control._fileurl = fileUrl;
            // control._filename = fileName;
            // control._isimage =
            //   fileName.indexOf(".png") !== -1 ||
            //   fileName.indexOf(".gif") !== -1 ||
            //   fileName.indexOf(".jpg") !== -1 ||
            //   fileName.indexOf(".jpeg") !== -1 ||
            //   fileName.indexOf(".webp") !== -1;
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

              let file = {
                _fileurl: fileUrl,
                _filename: fileName,
                _isimage:
                  fileName.indexOf(".png") !== -1 ||
                  fileName.indexOf(".gif") !== -1 ||
                  fileName.indexOf(".jpg") !== -1 ||
                  fileName.indexOf(".jpeg") !== -1 ||
                  fileName.indexOf(".webp") !== -1
              };
              control[control.field + "_files"] = [file];
            }
          }
        });
      }

      // console.log(this.otherFilesFormData);
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
          p1: "3",
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
    saveDraft() {
      let params = { action: "savesupdraft" };

      // 填充基础数据
      this._fillData(this.baseFormData, params);

      params["outputvalueyear"] = this.achieveYearData.output || "0";
      params["turnoveryear"] = this.achieveYearData.sale || "0";

      // 填充其它信息
      this._fillData(this.otherInfoFormData, params);

      // 填充区域信息
      this._fillData(this.areaFormData, params);

      params["_loginuid"] = this.$store.state.supinfo.accountid;

      params["token"] = this.$store.state.token;

      // 填充联系人信息
      let manData =
        this.manData.length === 0
          ? this.$store.state.supprofile.man
          : this.manData;
      let temp = [];
      manData.forEach(object => {
        let obj = {};
        for (const key in object) {
          if (
            object.hasOwnProperty(key) &&
            key.indexOf("_files") === -1 &&
            key.indexOf("_isfile") === -1
          ) {
            const element = object[key];
            if (
              key == "contacttype" &&
              object[key] == "普通联系人" &&
              (key.indexOf("authdelegationannex") !== -1 ||
                key.indexOf("sscertificateannex") !== -1)
            ) {
              continue;
            }
            obj[key] = element || "";
          }
        }
        temp.push(obj);
      });
      params["man"] = temp;

      // 填充服务类别
      let servTypeData =
        this.serviceTypeData.length === 0
          ? this.$store.state.supprofile.types
          : this.serviceTypeData;
      let temp2 = [];
      servTypeData.forEach(object => {
        let obj = {};
        for (const key in object) {
          if (
            object.hasOwnProperty(key) &&
            key.indexOf("_files") === -1 &&
            key.indexOf("_isfile") === -1
          ) {
            const element = object[key];
            obj[key] = element || "";
          }
        }
        temp2.push(obj);
      });

      params["types"] = temp2;

      let achieveData =
        this.achieveData.length === 0
          ? this.$store.state.supprofile.yj_data
          : this.achieveData;
      let temp3 = [];

      achieveData.forEach(object => {
        let obj = {};
        for (const key in object) {
          if (
            object.hasOwnProperty(key) &&
            key.indexOf("_files") === -1 &&
            key.indexOf("_isfile") === -1
          ) {
            const element = object[key];
            obj[key] = element || "";
          }
        }
        temp3.push(obj);
      });

      params["achievements"] = temp3;

      // 填充其它附件信息
      let fileObj = {};
      this.otherFilesFormData.forEach(control => {
        if (control.value) {
          fileObj[control.field] = control.value;
        }
      });

      params["otherfiles"] = [fileObj];

      if (this.commiting) return;
      this.commiting = true;

      this.$post(params, res => {
        // console.log(res);
        this.commiting = false;

        if (res.code === "0") {
          // alert("提交成功");
          this.$message({
            message: "已保存草稿",
            type: "success"
          });
          // this.$router.replace({ path: "/admin/company" });
        } else {
          this.$message({
            message: res.codemsg,
            type: "error"
          });
        }
      });
    },
    commit() {
      let params = { action: "updatesupinfo" };

      for (let i = 0; i < this.baseFormData.length; i++) {
        const control = this.baseFormData[i];

        if (control.subtype === "date") {
          if (control.value) {
            let val = control.value
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "")
              .replace("/", "-");
            let reg = new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/);
            if (!reg.test(val)) {
              // alert(control.label + "不正确");
              this.$message({
                message: control.label + "不正确",
                type: "error"
              });
              return;
            }
          }
        }
      }

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
      // params["man"] =
      //   (this.manData.length === 0
      //     ? this.$store.state.supprofile.man
      //     : this.manData) || [];
      let manData =
        this.manData.length === 0
          ? this.$store.state.supprofile.man
          : this.manData;
      let temp = [];
      manData.forEach(object => {
        let obj = {};
        for (const key in object) {
          if (
            object.hasOwnProperty(key) &&
            key.indexOf("_files") === -1 &&
            key.indexOf("_isfile") === -1
          ) {
            const element = object[key];
            if (
              key == "contacttype" &&
              object[key] == "普通联系人" &&
              (key.indexOf("authdelegationannex") !== -1 ||
                key.indexOf("sscertificateannex") !== -1)
            ) {
              continue;
            }
            obj[key] = element || "";
          }
        }
        temp.push(obj);
      });
      params["man"] = temp;

      // 填充服务类别
      // params["types"] =
      //   this.serviceTypeData.length === 0
      //     ? this.$store.state.supprofile.types
      //     : this.serviceTypeData;
      let servTypeData =
        this.serviceTypeData.length === 0
          ? this.$store.state.supprofile.types
          : this.serviceTypeData;
      // console.log(servTypeData);
      let temp2 = [];
      servTypeData.forEach(object => {
        let obj = {};
        for (const key in object) {
          if (
            object.hasOwnProperty(key) &&
            key.indexOf("_files") === -1 &&
            key.indexOf("_isfile") === -1
          ) {
            const element = object[key];
            obj[key] = element || "";
          }
        }
        temp2.push(obj);
      });

      params["types"] = temp2;

      // 填充公司业绩
      // params["achievements"] =
      //   this.achieveData.length === 0
      //     ? this.$store.state.supprofile.yj_data
      //     : this.achieveData;
      let achieveData =
        this.achieveData.length === 0
          ? this.$store.state.supprofile.yj_data
          : this.achieveData;
      let temp3 = [];

      achieveData.forEach(object => {
        let obj = {};
        for (const key in object) {
          if (
            object.hasOwnProperty(key) &&
            key.indexOf("_files") === -1 &&
            key.indexOf("_isfile") === -1
          ) {
            const element = object[key];
            obj[key] = element || "";
          }
        }
        temp3.push(obj);
      });

      if (temp3.length < 2) {
        // alert("至少需要录入2条公司业绩");
        this.$message({
          message: "至少需要录入2条公司业绩",
          type: "error"
        });
        return;
      }

      // console.log(temp3);

      params["achievements"] = temp3;

      // 填充其它附件信息
      let fileObj = {};
      this.otherFilesFormData.forEach(control => {
        if (control.value) {
          fileObj[control.field] = control.value;
        }
      });

      params["otherfiles"] = [fileObj];

      // console.log(params);

      if (this.commiting) return;
      this.commiting = true;

      this.$post(params, res => {
        // console.log(res);
        this.commiting = false;

        if (res.code === "0") {
          // alert("提交成功");
          this.$message({
            message: "提交成功！",
            type: "success"
          });
          this.$router.replace({ path: "/admin/company" });
        } else {
          // console.log(res.codemsg);

          // alert(res.codemsg);
          this.$message({
            message: res.codemsg,
            type: "error"
          });
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

      &.disabled {
        opacity: 0.4;
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
