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
          <form-fields
            form-ref="baseForm"
            v-if="currentStep.step === 1"
            :controls="baseFormControls"
            :form-model="baseFormModel"
          ></form-fields>

          <form-fields
            form-ref="otherInfoForm"
            v-if="currentStep.step === 6"
            :controls="otherInfoFormControls"
            :form-model="otherInfoFormModel"
          ></form-fields>

          <form-fields
            form-ref="otherFilesForm"
            v-if="currentStep.step === 7"
            :controls="otherFilesFormControls"
            :form-model="otherFilesFormModel"
          ></form-fields>

          <form-fields
            v-if="currentStep.step === 3"
            form-ref="step3Form"
            :controls="areaFormControls"
            :form-model="areaFormModel"
          ></form-fields>
        </div>

        <comm-form-list
          :key="'list-' + currentStep.step"
          v-if="currentStep.step === 2"
          model="man"
          name="联系方式"
          :items="manData"
          ref="manList"
          :fields="manFields"
          @openform="openManForm"
          :form-data="manFormData"
          :form-model="manFormModel"
        />

        <comm-form-list
          :key="'list-' + currentStep.step"
          v-if="currentStep.step === 4"
          model="service_type"
          name="服务类别"
          :items="serviceTypeData"
          :fields="serviceTypeFields"
          @openform="openServiceForm"
          :form-data="serviceTypeFormData"
          :form-model="serviceTypeFormModel"
        />

        <div class="achieve-wrap" v-if="currentStep.step === 5">
          <div class="input-table">
            <!-- <el-form ref="yjForm"> -->
            <table class="table">
              <tr>
                <td class="label">
                  <label for="year-output">年产值额</label>
                </td>
                <td class="input-control">
                  <!-- <el-form-item label="输入年产值额" prop="output"> -->
                  <el-input
                    type="number"
                    v-model.number="achieveYearData.output"
                    placeholder="输入年产值额"
                  >
                    <template slot="append">万</template>
                  </el-input>
                  <!-- </el-form-item> -->
                </td>
                <td class="label">
                  <label for="year-sale">年营业额</label>
                </td>
                <td class="input-control">
                  <!-- <el-form-item label="输入年营业额" prop="sale"> -->
                  <el-input
                    type="number"
                    v-model.number="achieveYearData.sale"
                    placeholder="输入年营业额"
                  >
                    <template slot="append">万</template>
                  </el-input>
                  <!-- </el-form-item> -->
                </td>
              </tr>
            </table>
            <!-- </el-form> -->
          </div>

          <comm-form-list
            model="yj_data"
            name="公司业绩"
            :key="'list-' + currentStep.step"
            :items="achieveData"
            :fields="achieveFields"
            :form-data="achieveFormData"
            :form-model="achieveFormModel"
            @openform="openAcheveForm"
          />
        </div>
      </div>
      <div class="buttons">
        <el-button @click="prevClick" v-if="currentStep.step > 1" plain type="primary">上一步</el-button>
        <el-button @click="resetClick" v-if="currentStep.needReset" plain type="primary">重置</el-button>
        <el-button @click="saveDraft" type="primary">保存</el-button>
        <el-button
          @click="nextClick"
          v-if="currentStep.step < steps.length"
          plain
          type="primary"
        >下一步</el-button>
        <el-button type="primary" @click="commit" v-if="currentStep.step === steps.length">提交审核</el-button>
      </div>
    </div>
    <!-- <bid-upload></bid-upload> -->
    <el-dialog title="标杆企业名单" :visible.sync="top100ImgVisible" style="text-align:center;">
      <img :src="require('@/assets/images/top-100.jpg')" style="max-height: 100%;" />
    </el-dialog>
  </div>
</template>
<script>
import merge from "webpack-merge";
import tableFields from "@/utils/table-fields";
import { MobileCheck, IDCardCheck } from "@/components/profile/validators";

export default {
  name: "profile",
  components: {
    formFields: resolve => {
      require(["@/components/profile/form-fields"], resolve);
    },
    commFormList: function(resolve) {
      require(["@/components/profile/comm-form-list2"], resolve);
    },
    bidUpload: resolve => {
      require(["@/components/bid-upload"], resolve);
    }
  },
  data() {
    return {
      currentStep: null,
      top100ImgVisible: false,
      achieveData: this.$store.state.supprofile.yj_data || [],
      commiting: false,
      achieveFields: [
        {
          label: "操作",
          value: "actions",
          width: 80
        }
      ].concat(tableFields.achieve),
      achieveFormModel: {},
      achieveFormData: [
        {
          id: "city",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "cityname",
          label: "城市",
          rules: [{ required: true, message: "城市不能为空", trigger: "blur" }]
        },
        {
          id: "proj-name",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "projectname",
          label: "项目名称",
          rules: [
            { required: true, message: "项目名称不能为空", trigger: "blur" }
          ]
        },
        {
          id: "partner-company",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "partnername",
          label: "合作单位名称",
          rules: [
            { required: true, message: "合作单位名称不能为空", trigger: "blur" }
          ]
        },
        {
          id: "is-good-company",
          type: 5,
          field: "ismodel",
          // required: true,
          label: "是否标杆企业",
          special_desc: "标杆企业名单",
          clickCallback: () => {
            // console.log(123);
            this.top100ImgVisible = true;
          }
          // rules: [
          //   { required: true, message: "合作单位名称不能为空", trigger: "blur" }
          // ]
        },
        {
          id: "service-type",
          type: 9,
          label: "服务类别",
          // value: null,
          field: "suptype",
          // required: true,
          options: [],
          rules: [
            { required: true, message: "服务类别不能为空", trigger: "blur" }
          ]
        },
        {
          id: "server-content",
          type: 1,
          // subtype: "text",
          // required: false,
          field: "servercontent",
          label: "服务内容"
        },
        {
          id: "proj-manager",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "manager",
          label: "项目经理",
          rules: [
            { required: true, message: "项目经理不能为空", trigger: "blur" }
          ]
        },
        {
          id: "contract-money",
          type: 1,
          subtype: "number",
          // required: true,
          field: "contractmoney",
          label: "合同金额",
          unit: "万",
          rules: [
            { required: true, message: "合同金额不能为空", trigger: "blur" }
          ]
        },
        {
          id: "contract-scale",
          type: 1,
          // subtype: "text",
          field: "contractsize",
          // required: true,
          label: "合同体量",
          rules: [
            { required: true, message: "合同体量不能为空", trigger: "blur" }
          ]
        },
        {
          id: "start-date",
          type: 7,
          // subtype: "date",
          // required: true,
          field: "begindate",
          label: "开始日期",
          // value: null,
          rules: [
            { required: true, message: "开始日期不能为空", trigger: "change" }
          ]
        },
        {
          id: "end-date",
          type: 7,
          // subtype: "date",
          // required: true,
          field: "enddate",
          label: "结束日期",
          // value: null
          rules: [
            { required: true, message: "结束日期不能为空", trigger: "change" }
          ]
        },
        {
          id: "contract-file",
          type: 8,
          // required: true,
          label: "合同附件",
          field: "contractannex",
          accept: ".zip,.rar",
          upload_tips:
            "上传附件为压缩包文件，格式为：zip,rar等。（1个合同上传不超过5页，压缩包需要包含：合同封面首页、合同结尾页、合同实质内容页面（合同范围、内容、工期、项目团队）",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Achievement_Info",
          fieldname: "contractannex",
          rules: [
            { required: true, message: "合同附件不能为空", trigger: "change" }
          ]
        },
        {
          id: "summary",
          type: 1,
          // subtype: "text",
          // required: false,
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
      serviceTypeFormModel: {
        servertype: null
      },
      originalServiceTypeControls: [
        {
          id: "service-type",
          type: 9,
          label: "对口服务类别",
          // value: null,
          field: "servertype",
          // required: true,
          options: [],
          assoc_control_id: "zz-name",
          special_text: `<a target="_blank" style="color: #e46623!important; text-decoration:underline" href="http://erp20-mobiledoc.heneng.cn:16660/view/url?url=http%3A%2F%2Ferp20-app.heneng.cn%3A16681%2Ffile%2Ferp20-annex.heneng.cn%2FH_WF_INST_M%2F2019-04-03%2F1645596%2F1645596.xlsx">供应商入库标准</a>`,
          rules: [
            { required: true, message: "对口服务类别", trigger: "change" }
          ],
          changeFunc: val => {
            // 重置选中的资质名称
            this.$set(this.serviceTypeFormModel, "quaid", null);

            // 重置选中的资质级别
            this.$set(this.serviceTypeFormModel, "qualevelid", null);

            // 重置上传的图片
            this.$set(this.serviceTypeFormModel, "quaannexid", null);

            // 移除多余控件
            let temp = [];
            for (let i = 0; i < this.originalServiceTypeControls.length; i++) {
              let control = this.originalServiceTypeControls[i];
              if (
                control.field != "qualevelid" &&
                control.field != "quaannexid"
              ) {
                temp.push(control);
              }
            }
            this.serviceTypeFormData = Object.assign([], temp);

            val = val || {};
            this.$post(
              {
                action: "P_SY_GetAreaOrType",
                p1: "5",
                p2: val.value || ""
              },
              res => {
                if (res.code === "0") {
                  let arr = res.data;
                  let temp = [{ label: "无", value: null }];

                  arr.forEach(ele => {
                    if (!!ele.supqualistid && !!ele.supqualistname) {
                      temp.push({
                        value: `${ele.supqualistname}-${ele.supqualistid}`,
                        label: ele.supqualistname
                      });
                    }
                  });

                  // console.log(temp);

                  this.serviceTypeFormData[2].options = temp;
                }
              }
            );
          }
        },
        {
          id: "is-main-type",
          label: "是否主要类别",
          field: "ismain",
          // required: true,
          type: 5,
          rules: [{ required: true, message: "是否主要类别", trigger: "blur" }]
        },
        {
          id: "zz-name",
          type: 2,
          // subtype: "text",
          options: [
            {
              label: "无",
              value: null
            }
          ],
          // value: null,
          // required: false,
          field: "quaid",
          label: "资质名称",
          changeFunc: value => {
            if (!value) {
              // 重置选中的资质级别
              this.$set(this.serviceTypeFormModel, "qualevelid", null);

              // 重置上传的图片
              this.$set(this.serviceTypeFormModel, "quaannexid", null);
            }

            let temp = [];
            for (let i = 0; i < this.originalServiceTypeControls.length; i++) {
              let control = this.originalServiceTypeControls[i];

              if (!value) {
                if (
                  control.field != "qualevelid" &&
                  control.field != "quaannexid"
                ) {
                  temp.push(control);
                }
              } else {
                // if (control.field != "quaannexid") {
                temp.push(control);
                // }
              }
            }

            this.serviceTypeFormData = Object.assign([], temp);

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

                  let temp = [{ label: "请选择资质级别", value: null }];
                  arr.forEach(ele => {
                    temp.push({
                      value: `${ele.supquagradename}-${ele.supquagradeid}`,
                      label: ele.supquagradename
                    });
                  });
                  this.serviceTypeFormData[3].options = temp;
                }
              }
            );
          }
        },
        {
          id: "zz-level",
          type: 2,
          // subtype: "text",
          options: [
            {
              label: "无",
              value: null
            }
          ],
          // value: null,
          // required: true,
          rules: [
            { required: true, message: "资质级别不能为空", trigger: "change" }
          ],
          field: "qualevelid",
          label: "资质级别",
          changeFunc: value => {
            // console.log(value);
          }
        },
        {
          id: "zz-cert-file",
          type: 8,
          // required: true,
          label: "资质证书扫描件",
          field: "quaannexid",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "quaannexid",
          rules: [
            {
              required: true,
              message: "资质证书扫描件不能为空",
              trigger: "change"
            }
          ]
        },
        {
          id: "zz-approve-date",
          type: 7,
          // subtype: "date",
          label: "资质审核到期日期",
          field: "quaexaminedate",
          // required: true,
          // value: null
          rules: [
            { required: true, message: "资质审核到期日期", trigger: "change" }
          ]
        },
        {
          id: "memo",
          type: 1,
          // subtype: "text",
          label: "其他说明",
          field: "othermemo"
          // required: false
        }
      ],
      serviceTypeFormData: [],
      manData: this.$store.state.supprofile.man || [],
      manFormModel: {},
      manFormData: [
        {
          id: "contact-type",
          label: "联系人类型",
          type: 2,
          // required: true,
          // value: null,
          field: "contacttype",
          options: [
            {
              value: null,
              label: "选择联系人类型"
            }
          ],
          rules: [
            { required: true, message: "联系人类型不能为空", trigger: "change" }
          ],
          changeFunc: value => {
            if (value && value.indexOf("第一联系人") !== -1) {
              if (this.manFormData.length === 7) {
                const fields = [
                  {
                    id: "shebao",
                    label: "联系人社保证明",
                    // required: true,
                    field: "sscertificateannex",
                    type: 8,
                    // subtype: 1,
                    domanid: this.$store.state.supinfo.accountid || "0",
                    tablename: "H_Sup_Contact_Info",
                    fieldname: "sscertificateannex",
                    accept: ".jpg,.png,.gif,.jpeg,.pdf,.rar,.zip",
                    rules: [
                      {
                        required: true,
                        message: "联系人社保证明不能为空",
                        trigger: "blur"
                      }
                    ]
                  },
                  {
                    id: "entrust",
                    label: "授权委托（附件）",
                    // required: true,
                    field: "authdelegationannex",
                    type: 8,
                    // subtype: 2, // 普通文件
                    domanid: this.$store.state.supinfo.accountid || "0",
                    tablename: "H_Sup_Contact_Info",
                    fieldname: "authdelegationannex",
                    accept: ".docx,.doc,.pdf,.jpg,.png,.jpeg,.gif",
                    upload_tips: "请下载授权委托书模板，填写并盖公章后扫描上传",
                    tpl_files: [
                      {
                        name: "授权委托书模板",
                        url:
                          "http://erp20-app.heneng.cn:16681/file/erp20-annex.heneng.cn/H_WF_INST_M/2019-01-08/1246140/合能集团采购平台第一联系人授权函(1).docx"
                      }
                    ],
                    rules: [
                      {
                        required: true,
                        message: "授权委托（附件）不能为空",
                        trigger: "blur"
                      }
                    ]
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

            // this.$refs["manList"].reset();
          }
          // changeFunc: this.changeContactType
        },
        {
          id: "contact-job",
          label: "联系人职位",
          type: 2,
          // value: null,
          // required: true,
          field: "contactposition",
          options: [],
          rules: [
            { required: true, message: "联系人职位不能为空", trigger: "change" }
          ]
        },
        {
          id: "name",
          label: "联系人姓名",
          // required: true,
          field: "contactname",
          type: 1,
          rules: [
            { required: true, message: "联系人姓名不能为空", trigger: "blur" }
          ]
          // subtype: "text"
          // value: null
        },
        {
          id: "phone",
          label: "联系人电话",
          // required: true,
          field: "contacttel",
          type: 1,
          rules: [
            { required: true, message: "联系人电话不能为空", trigger: "blur" }
          ]
          // subtype: "tel"
          // value: null
        },
        {
          id: "mobile",
          label: "联系人手机",
          // required: true,
          type: 1,
          field: "contactphone",
          // subtype: "tel",
          // pattern: /^1[3456789]\d{9}$/,
          rules: [
            { required: true, message: "联系人手机不能为空", trigger: "blur" },
            { validator: MobileCheck, trigger: "change" }
          ]
          // value: null
        },
        {
          id: "email",
          label: "电子邮件",
          // required: false,
          type: 1,
          field: "email",
          subtype: "email"
          // value: null
        },
        {
          id: "idcard",
          label: "身份证号码",
          // required: true,
          field: "contactidno",
          type: 1,
          rules: [
            { required: true, message: "身份证号码不能为空", trigger: "blur" },
            { validator: IDCardCheck, trigger: "change" }
          ]
          // subtype: "text",
          // pattern: /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
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
      otherInfoFormModel: {},
      otherInfoFormControls: [
        {
          id: "child-company-name",
          type: 1,
          // subtype: "text",
          label: "分公司信息（含地址、电话）",
          field: "branchinfo",
          placeholder: ""
          //   required: true
        },
        {
          id: "relate-company-name",
          type: 1,
          // subtype: "text",
          label: "关联公司信息",
          field: "relateinfo",
          placeholder: ""
          //   required: true
        }
      ],
      otheerInfoFormModel: { branchinfo: "", relateinfo: "" },
      otherFilesFormModel: {},
      otherFilesFormControls: [
        {
          id: "finance-approve-file",
          type: 8,
          //   subtype: "file",
          label: "近三年财务审计报告(附件)",
          placeholder: "",
          field: "threeyfinancialreports",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_OtherAnnex_Info",
          fieldname: "threeyfinancialreports",
          accept: ".jpg,.png,.gif,.jpeg,.pdf,.rar,.zip"
        },
        {
          id: "auth-license-file",
          type: 8,
          //   subtype: "file",
          label: "认证或荣誉证书(附件)",
          placeholder: "",
          field: "honorcertificate",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_OtherAnnex_Info",
          fieldname: "honorcertificate",
          accept: ".jpg,.png,.gif,.jpeg,.pdf,.rar,.zip"
        },
        {
          id: "beian-file",
          type: 8,
          //   subtype: "file",
          label: "外地备案证(附件)",
          placeholder: "",
          field: "fieldcertificate",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_OtherAnnex_Info",
          fieldname: "fieldcertificate",
          accept: ".jpg,.png,.gif,.jpeg,.pdf,.rar,.zip"
        }
      ],
      areaFormControls: [
        {
          id: "service-area",
          type: 4,
          label: "服务城市",
          field: "serverareaids",
          options: [],
          changeFunc: values => {
            // console.log(values);
            let arr = this.areaFormControls[0].options || [];
            // arr.forEach(ele => {
            //   if
            // })
            let temp = [];
            values.forEach(val => {
              for (let i = 0; i < arr.length; i++) {
                if (val === arr[i].value) {
                  temp.push(arr[i]);
                }
              }
            });
            this.areaFormControls[1].options = temp;
          },
          rules: [
            { required: true, message: "服务城市不能为空", trigger: "change" }
          ]
        },
        {
          id: "main-service-area",
          type: 3,
          label: "主要服务城市",
          field: "mainareaid",
          options: [],
          rules: [
            {
              required: true,
              message: "主要服务城市不能为空",
              trigger: "change"
            }
          ]
        }
      ],
      areaFormModel: { serverareaids: [] },
      baseFormControls: [
        {
          id: "comp-name",
          type: 1,
          label: "企业名称",
          field: "comname",
          rules: [
            { required: true, message: "企业名称不能为空", trigger: "blur" }
          ]
        },
        {
          id: "company-nature",
          type: 2,
          label: "企业性质",
          field: "comtype",
          options: [],
          placeholder: "请选择企业性质",
          rules: [
            { required: true, message: "企业性质不能为空", trigger: "change" }
          ]
        },
        {
          id: "company-id",
          type: 1,
          label: "统一社会信用代码",
          field: "comuscc",
          rules: [
            {
              required: true,
              message: "统一社会信用代码不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          id: "company-id-exp",
          type: 7,
          // subtype: "date",
          label: "统一社会信用代码有效期",
          field: "comusccinvaliddate",
          rules: [
            {
              required: true,
              message: "统一社会信用代码有效期不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          id: "license-file",
          type: 8,
          //   subtype: "file",
          label: "营业执照附件",
          field: "combi",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "ComBI",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".jpg,.jpeg,.png,.gif",
          fileSize: 5,
          rules: [
            {
              required: true,
              message: "营业执照附件不能为空",
              trigger: "change"
            }
          ]
        },
        {
          id: "tax-type",
          type: 2,
          label: "纳税人状态",
          field: "taxpayerstate",
          options: [
            {
              value: "null",
              label: "请选择纳税人状态"
            }
          ],
          rules: [
            {
              required: true,
              message: "纳税人状态不能为空",
              trigger: "change"
            }
          ],
          placeholder: "请选择纳税人状态"
        },
        {
          id: "apply-cert-file",
          type: 8,
          label: "增值税一般纳税人申请认定表",
          field: "addtaxapplytable",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "addtaxapplytable",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".jpg,.jpeg,.png,.gif",
          fileSize: 5,
          rules: [
            {
              required: true,
              message: "增值税一般纳税人申请认定表不能为空",
              trigger: "change"
            }
          ]
        },
        {
          id: "company-reg-date",
          type: 7,
          label: "企业注册日期",
          placeholder: "",
          field: "comregdate",
          rules: [
            { required: true, message: "企业注册日期不能为空", trigger: "blur" }
          ]
        },
        {
          id: "found-address",
          type: 1,
          label: "企业注册地址",
          field: "comregaddr",
          rules: [
            { required: true, message: "企业注册地址不能为空", trigger: "blur" }
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
            { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "law-man-name",
          type: 1,
          label: "法定代表人",
          field: "corporateman",
          rules: [
            { required: true, message: "法定代表人不能为空", trigger: "blur" }
          ]
        },
        {
          id: "law-man-idcard",
          type: 1,
          label: "法定代表人身份证号码",
          field: "corporatemanidno",
          rules: [
            {
              validator: IDCardCheck,
              trigger: "change"
            }
          ]
        },
        {
          id: "safe-product-license-file",
          type: 8,
          label: "安全生产许可证",
          field: "safeproductionl",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "safeproductionl",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".jpg,.jpeg,.png,.gif",
          fileSize: 5
        },
        {
          id: "safe-license-expire-date",
          type: 7,
          label: "安全许可证到期日",
          field: "safeproductionldate"
        },
        {
          id: "iso-supports",
          type: 4,
          options: [],
          label: "体系认证",
          field: "sysauth"
        },
        {
          id: "zliang-license-file",
          type: 8,
          // multiple: true,
          label: "质量保证体系认证文件（附件）",
          field: "quaauthannex",
          placeholder: "",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "quaauthannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".jpg,.jpeg,.png,.gif",
          fileSize: 5
        },
        {
          id: "mgr-license-file",
          type: 8,
          // multiple: false,
          label: "管理体系认证（ISO9001/14001/HSE等附件）",
          field: "manageauthannex",
          placeholder: "",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "manageauthannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".jpg,.jpeg,.png,.gif",
          fileSize: 5
        },
        {
          id: "bank-auth-file",
          type: 8,
          // multiple: true,
          label: "银行信用等级和授信额度（附件）",
          field: "banklevelandcredit",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "banklevelandcredit",
          // upload_tips: "附件格式，大小不超过5MB",
          accept: ".jpg,.jpeg,.png,.gif",
          fileSize: 5
        },
        {
          id: "address",
          type: 1,
          label: "(总部)办公地址",
          field: "hqaddr",
          rules: [
            {
              required: true,
              message: "(总部)办公地址不能为空",
              trigger: "blur"
            }
          ]
        }
      ],
      baseFormModel: {},
      baseFormRules: {
        comname: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ]
      },
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

    this.originalServiceTypeControls.forEach(control => {
      if (control.field != "qualevelid" && control.field != "quaannexid") {
        this.serviceTypeFormData.push(control);
      }
    });

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
    openManForm(value) {
      // console.log(value);
      value = value || {};
      const data = value.data || {};
      // console.log(data);
      // if (data[''])
      this.manFormData[0].changeFunc(data["contacttype"]);
      // this.manFormData.forEach(control => {});

      this.populateFormData(this.manFormData, this.manFormModel, data);
    },
    openAcheveForm(value) {
      value = value || {};
      const data = value.data || {};
      this.populateFormData(this.achieveFormData, this.achieveFormModel, data);
    },
    openServiceForm(value) {
      // console.log(value);
      value = value || {};
      const data = value.data || {};
      // console.log(data);

      let servetypeVal = {
        value: data["servertypeid"],
        text: data["servertypename"]
      };
      this.serviceTypeFormData[0].changeFunc(servetypeVal);

      let quaid = "";
      if (data["quaidname"] && data["quaid"]) {
        quaid = `${data["quaidname"]}-${data["quaid"]}`;
      }
      this.serviceTypeFormData[2].changeFunc(quaid);

      let qualevelid = "";
      if (data["qualevelidname"] && data["qualevelid"]) {
        quaid = `${data["qualevelidname"]}-${data["qualevelid"]}`;
      }
      // console.log(this.serviceTypeFormData);
      if (qualevelid) {
        this.serviceTypeFormData[3].changeFunc(qualevelid);
      }

      // console.log(this.serviceTypeFormData);

      this.populateFormData(
        this.serviceTypeFormData,
        this.serviceTypeFormModel,
        data
      );
      // this.serviceTypeFormData[2].changeFunc(data)
    },
    populateFormData(controls, model, data) {
      if (!data) {
        controls.forEach(control => {
          this.$set(model, control.field, null);
        });
        return;
      }
      let obj = {};
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        if (control.type === 5) {
          if (
            data[control.field] == "true" ||
            data[control.field] == "是" ||
            data[control.field] == "1"
          ) {
            obj[control.field] = true;
          } else {
            obj[control.field] = false;
          }
        } else if (control.type === 8) {
          // 附件
          obj[control.field + "url"] = data[control.field + "url"];
          obj[control.field] = data[control.field];
        } else if (control.type === 9) {
          obj[control.field + "name"] = data[control.field + "name"];
          obj[control.field] =
            (data[control.field + "id"] || data[control.field]) == "0"
              ? ""
              : data[control.field + "id"] || data[control.field];
        } else {
          obj[control.field] = data[control.field];
        }

        // 特殊处理
        if (control.field == "quaid" || control.field == "qualevelid") {
          if (!data[control.field] || data[control.field] == "0") {
            obj[control.field] = null;
          } else {
            obj[control.field] = `${data[control.field + "name"]}-${
              data[control.field]
            }`;
          }
        }
      }

      // model = Object.assign({}, obj);

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          this.$set(model, key, element);
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
              // {
              //   value: null,
              //   label: "请选择联系人类型"
              // }
            ];
            arr.forEach(ele => {
              temp.push({
                value: `${ele.sy_value}`,
                label: ele.sy_name
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
              // {
              //   value: null,
              //   label: "请选择联系人职位"
              // }
            ];
            arr.forEach(ele => {
              temp.push({
                value: `${ele.sy_value}`,
                label: ele.sy_name
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

      console.log(object);

      this.baseFormControls.forEach(control => {
        if (control.field == "safeproductionl" && object[control.field] == "") {
          // this.baseFormModel[control.field] = "";
          this.$set(this.baseFormModel, control.field, null);
        } else {
          this.$set(this.baseFormModel, control.field, object[control.field]);
          // this.baseFormModel[control.field] = object[control.field];
        }
        if (control.field == "comname" || control.field == "comuscc") {
          control.disabled = true;
        }

        if (control.type == 4) {
          this.$set(
            this.baseFormModel,
            control.field,
            (object[control.field] || "").split(",")
          );
        }
      });

      this.otherInfoFormControls.forEach(control => {
        // this.otherInfoFormModel[control.field] = object[control.field];
        this.$set(
          this.otherInfoFormModel,
          control.field,
          object[control.field]
        );
      });

      // console.log(this.areaFormData);

      // 填充业绩数据
      this.achieveYearData.output = object["outputvalueyear"];
      this.achieveYearData.sale = object["turnoveryear"];

      // 填充其它附件
      let files = this.$store.state.supprofile.otherfiles || [];
      if (files.length > 0) {
        let object = files[0];
        this.otherFilesFormControls.forEach(control => {
          this.$set(
            this.otherFilesFormModel,
            control.field,
            object[control.field]
          );
        });
      }
    },

    populateAreaData() {
      let object = this.$store.state.supprofile;

      this.areaFormControls.forEach(control => {
        if (control.type === 4) {
          // console.log(object);
          let options = [];
          if (object[control.field]) {
            options = object[control.field].split(",");
          }

          this.areaFormModel[control.field] = options;

          const cities = this.areaFormControls[0].options || [];
          let temp = [];
          options.forEach(v => {
            for (let i = 0; i < cities.length; i++) {
              if (v == cities[i].value) {
                temp.push(cities[i]);
                break;
              }
            }
          });

          this.areaFormControls[1].options = temp;
        } else {
          // control.value = object[control.field];
          this.areaFormModel[control.field] = object[control.field];
        }
      });
    },
    loadBaseConfigData() {
      this.baseFormControls.forEach(control => {
        // this.baseFormModel[control.field] = null;
        if (control.type === 4) {
          this.$set(this.baseFormModel, control.field, []);
        } else {
          this.$set(this.baseFormModel, control.field, null);
        }
      });

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
                label: "请选择企业性质"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: ele.sy_value,
                label: ele.sy_name
              });
            });
            // this.baseFormModel["comtype"] = null;
            this.baseFormControls[1].options = temp;
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
                label: "请选择纳税人状态"
              }
            ];
            arr.forEach(ele => {
              temp.push({
                value: ele.sy_value,
                label: ele.sy_name
              });
            });
            this.baseFormControls[5].options = temp;
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
                label: ele.sy_name
              });
            });
            this.baseFormControls[14].options = temp;
          }
        }
      );
      // 获取服务区域

      this.areaFormControls.forEach(control => {
        // this.baseFormModel[control.field] = null;
        if (control.type === 4) {
          this.$set(this.areaFormModel, control.field, []);
        } else {
          this.$set(this.areaFormModel, control.field, null);
        }
      });

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
                label: ele.area_name
              });
            });
            // this.areaFormModel[this.areaFormControls[0].field] = null;
            this.areaFormControls[0].options = temp;

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
    },
    _fillData(formControls, formModel, params) {
      // console.log(formData);

      formControls.forEach(control => {
        let val = formModel[control.field];
        if (control.type === 5) {
          val = val === true ? "1" : "0";
        } else if (control.type === 4) {
          val = val || [];
          val = val.join(",");
        } else {
          val = val || "";
        }

        if (control.subtype && control.subtype == "number") {
          val = (val || "").toString();
        }

        // if (control.field == "suptype") {
        //   params[control.field + "id"] = val;
        // } else {
        params[control.field] = val;
        // }
        // console.log(control.field);
      });
    },
    saveDraft() {
      let params = { action: "savesupdraft" };

      // 填充基础数据
      this._fillData(this.baseFormControls, this.baseFormModel, params);

      params["outputvalueyear"] = (
        this.achieveYearData.output || "0"
      ).toString();
      params["turnoveryear"] = (this.achieveYearData.sale || "0").toString();

      // 填充其它信息
      this._fillData(
        this.otherInfoFormControls,
        this.otherInfoFormModel,
        params
      );

      // 填充区域信息
      this._fillData(this.areaFormControls, this.areaFormModel, params);

      params["_loginuid"] = this.$store.state.supinfo.accountid;

      params["token"] = this.$store.state.token;

      // 填充联系人信息
      let manData =
        (this.manData.length === 0
          ? this.$store.state.supprofile.man
          : this.manData) || [];
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
        (this.serviceTypeData.length === 0
          ? this.$store.state.supprofile.types
          : this.serviceTypeData) || [];
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
        (this.achieveData.length === 0
          ? this.$store.state.supprofile.yj_data
          : this.achieveData) || [];
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
            if (key == "suptype") {
              obj["suptypeid"] = element || "";
            } else {
              obj[key] = element || "";
            }
          }
        }
        temp3.push(obj);
      });

      params["achievements"] = temp3;

      // 填充其它附件信息
      let fileObj = {};
      this.otherFilesFormControls.forEach(control => {
        if (this.otherFilesFormModel[control.field]) {
          fileObj[control.field] = this.otherFilesFormModel[control.field];
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

      // console.log(this.$refs);

      for (let i = 0; i < this.baseFormControls.length; i++) {
        let control = this.baseFormControls[i];
        let requiredCount = 0;
        if (control.rules && control.rules.length > 0) {
          control.rules.forEach(rule => {
            if (rule.required) {
              requiredCount++;
            }
          });
        }
        if (requiredCount > 0 && !this.baseFormModel[control.field]) {
          this.$message({
            message: control.label + "不能为空",
            type: "error"
          });
          return;
        }
      }

      // 填充基础数据
      this._fillData(this.baseFormControls, this.baseFormModel, params);

      // // console.log(this.achieveYearData);

      params["outputvalueyear"] = (
        this.achieveYearData.output || "0"
      ).toString();
      params["turnoveryear"] = (this.achieveYearData.sale || "0").toString();

      // 填充其它信息
      this._fillData(
        this.otherInfoFormControls,
        this.otherInfoFormModel,
        params
      );

      // 填充区域信息
      this._fillData(this.areaFormControls, this.areaFormModel, params);

      params["_loginuid"] = this.$store.state.supinfo.accountid;

      params["token"] = this.$store.state.token;

      // 填充联系人信息
      // params["man"] =
      //   (this.manData.length === 0
      //     ? this.$store.state.supprofile.man
      //     : this.manData) || [];
      let manData =
        (this.manData.length === 0
          ? this.$store.state.supprofile.man
          : this.manData) || [];
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
        (this.serviceTypeData.length === 0
          ? this.$store.state.supprofile.types
          : this.serviceTypeData) || [];
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
        (this.achieveData.length === 0
          ? this.$store.state.supprofile.yj_data
          : this.achieveData) || [];
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
      this.otherFilesFormControls.forEach(control => {
        if (this.otherFilesFormModel[control.field]) {
          fileObj[control.field] = this.otherFilesFormModel[control.field];
        }
      });

      params["otherfiles"] = [fileObj];

      console.log(params);

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
