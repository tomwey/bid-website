<template>
  <div class="bid-detail">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/applying-bids' }">我的报名</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="maincontent">
      <div class="step-bar-wrap">
        <el-steps :active="active" align-center finish-status="success">
          <el-step
            v-for="item in steps"
            :title="item.title"
            :description="item.desc"
            :key="item.step"
            @click.native="selectStep(item.step)"
          ></el-step>
        </el-steps>
      </div>
      <div class="step-content">
        <div v-if="step === 1" class="download-files">
          <table class="table">
            <tr v-for="(item,index) in downloadFiles" :key="index">
              <td class="label">{{item.label}}</td>
              <td class="value">
                <div class="files">
                  <div class="file" v-for="(file,index2) in item.files" :key="index2">
                    <a :href="file.url" class="file-link">{{file.name}}</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="step === 2" class="faq-list">
          <div class="stat-newbar">
            <el-row>
              <el-col :span="16">
                <span class="stat">共10条</span>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="primary" @click="faqDialogFormVisible = true">新增质疑</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list">
            <el-table :data="faqData" stripe style="width: 100%">
              <el-table-column prop="title" label="提疑内容">
                <template slot-scope="scope">
                  <span class="name" @click="selectItem(scope.row)">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="答疑附件" width="180">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >答疑附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="提疑时间" width="180"></el-table-column>
              <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
            </el-table>
            <div class="page-container">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="50"
                :page-size="20"
                :current-page="1"
              ></el-pagination>
            </div>
          </div>
          <el-dialog
            title="新增质疑"
            :visible.sync="faqDialogFormVisible"
            :append-to-body="true"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
          >
            <form-fields
              form-ref="form"
              ref="faqForm"
              :controls="faqFormControls"
              :form-model="faqFormModel"
            ></form-fields>
            <div slot="footer" class="dialog-footer">
              <el-button @click="faqDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="faqDialogFormVisible = false">提 交</el-button>
            </div>
          </el-dialog>
        </div>
        <div v-if="step === 3" class="bid-money">
          <form-fields
            form-ref="form"
            ref="bidMoneyForm"
            :controls="bidMoneyFormControls"
            :form-model="bidMoneyFormModel"
          ></form-fields>
          <div style="text-align:center">
            <!-- <el-button @click="faqDialogFormVisible = false">取 消</el-button> -->
            <el-button type="primary">保 存</el-button>
          </div>
        </div>
        <div v-if="step === 4" class="bid-func">
          <div class="stat-newbar">
            <el-row>
              <el-col :span="16">
                <span class="stat">共10条</span>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="primary" @click="faqDialogFormVisible = true">新增技术回标</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list">
            <el-table key="bidFuncTable" :data="bidFuncData" stripe style="width: 100%">
              <!-- <el-table-column prop="title" label="提疑内容">
                  <template slot-scope="scope">
                    <span class="name" @click="selectItem(scope.row)">{{scope.row.title}}</span>
                  </template>
              </el-table-column>-->
              <el-table-column label="技术附件">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >技术附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="投标时间" width="180"></el-table-column>
              <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
            </el-table>
            <div class="page-container">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="50"
                :page-size="20"
                :current-page="1"
              ></el-pagination>
            </div>
          </div>
          <el-dialog
            title="新增技术回标"
            :visible.sync="faqDialogFormVisible"
            :append-to-body="true"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
          >
            <form-fields
              form-ref="form"
              ref="bidFuncForm"
              :controls="bidFuncFormControls"
              :form-model="bidFuncFormModel"
            ></form-fields>
            <div slot="footer" class="dialog-footer">
              <el-button @click="faqDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="faqDialogFormVisible = false">提 交</el-button>
            </div>
          </el-dialog>
        </div>
        <div v-if="step === 5" class="bid-price">
          <div class="stat-newbar">
            <el-row>
              <el-col :span="16">
                <span class="stat">共10条</span>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="primary" @click="faqDialogFormVisible = true">新增商务回标</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list">
            <el-table key="bidPriceTable" :data="bidPriceData" stripe style="width: 100%">
              <!-- <el-table-column prop="title" label="提疑内容">
                  <template slot-scope="scope">
                    <span class="name" @click="selectItem(scope.row)">{{scope.row.title}}</span>
                  </template>
              </el-table-column>-->
              <el-table-column label="回标报价总金额（含税总价，单位元）" prop="money" width="280"></el-table-column>
              <el-table-column label="税率(%)" prop="rate" width="120"></el-table-column>
              <el-table-column label="商务标附件">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="投标时间" width="180"></el-table-column>
              <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
            </el-table>
            <div class="page-container">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="50"
                :page-size="20"
                :current-page="1"
              ></el-pagination>
            </div>
          </div>
          <el-dialog
            title="新增商务回标"
            :visible.sync="faqDialogFormVisible"
            :append-to-body="true"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
          >
            <form-fields
              form-ref="form"
              ref="bidFuncForm"
              :controls="bidPriceFormControls"
              :form-model="bidPriceFormModel"
            ></form-fields>
            <div slot="footer" class="dialog-footer">
              <el-button @click="faqDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="faqDialogFormVisible = false">提 交</el-button>
            </div>
          </el-dialog>
        </div>
        <div v-if="step === 6" class="bid-discuss">
          <div class="stat-newbar">
            <el-row>
              <el-col :span="16">
                <span class="stat">共10条</span>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="primary" @click="faqDialogFormVisible = true">新增议标</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list">
            <el-table key="bidPrice2Table" :data="bidPrice2Data" stripe style="width: 100%">
              <el-table-column label="议标报价总金额（含税总价，单位元）" prop="money" width="280"></el-table-column>
              <el-table-column label="税率(%)" prop="rate" width="120"></el-table-column>
              <el-table-column label="议标商务标附件">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >附件</a>
                </template>
              </el-table-column>
              <el-table-column label="其它标书附件">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="议标时间" width="180"></el-table-column>
              <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
            </el-table>
            <div class="page-container">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="50"
                :page-size="20"
                :current-page="1"
              ></el-pagination>
            </div>
          </div>
          <el-dialog
            title="新增议标"
            :visible.sync="faqDialogFormVisible"
            :append-to-body="true"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
          >
            <form-fields
              form-ref="form"
              ref="bidFuncForm"
              :controls="bidPrice2FormControls"
              :form-model="bidPrice2FormModel"
            ></form-fields>
            <div slot="footer" class="dialog-footer">
              <el-button @click="faqDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="faqDialogFormVisible = false">提 交</el-button>
            </div>
          </el-dialog>
        </div>
        <div
          v-if="step === 7"
          class="bid-result"
          style="text-align: center;padding-top: 60px;"
        >此处直接预览中标附件，不再做设计</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bid-detail",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      active: 2,
      step: 1,
      steps: [
        {
          title: "下载招标文件",
          desc: "标书文件下载",
          step: 1
        },
        {
          title: "答疑",
          desc: "2019-05-05截止",
          step: 2
        },
        {
          title: "投标保证金缴纳",
          desc: "2019-06-05截止",
          step: 3
        },
        {
          title: "技术标",
          desc: "2019-08-05截止",
          step: 4
        },
        {
          title: "商务标",
          desc: "2019-012-05截止",
          step: 5
        },
        {
          title: "议标",
          desc: "反馈议标结果",
          step: 6
        },
        {
          title: "定标",
          desc: "公示中标结果",
          step: 7
        }
      ],
      faqData: [
        {
          title: "这是疑问，这是疑问，这是问题",
          time: "2019-01-01 12:32:39"
        },
        {
          title: "这是疑问，这是疑问，这是问题",
          time: "2019-01-01 12:32:39"
        },
        {
          title: "这是疑问，这是疑问，这是问题",
          time: "2019-01-01 12:32:39"
        },
        {
          title: "这是疑问，这是疑问，这是问题",
          time: "2019-01-01 12:32:39"
        },
        {
          title: "这是疑问，这是疑问，这是问题",
          time: "2019-01-01 12:32:39"
        }
      ],
      downloadFiles: [
        {
          label: "招标文件正文",
          files: [
            {
              name: "附件一",
              url: "#"
            }
          ]
        },
        {
          label: "合同模板及附件",
          files: [
            {
              name: "模板一",
              url: "#"
            },
            {
              name: "附件一",
              url: "#"
            }
          ]
        },
        {
          label: "招标图纸",
          files: [
            {
              name: "文件一",
              url: "#"
            },
            {
              name: "文件2",
              url: "#"
            }
          ]
        },
        {
          label: "招标清单",
          files: [
            {
              name: "文件一",
              url: "#"
            },
            {
              name: "文件2",
              url: "#"
            }
          ]
        },
        {
          label: "技术要求",
          files: [
            {
              name: "文件一",
              url: "#"
            },
            {
              name: "文件2",
              url: "#"
            }
          ]
        },
        {
          label: "施工及材料界面",
          files: [
            {
              name: "文件一",
              url: "#"
            },
            {
              name: "文件2",
              url: "#"
            }
          ]
        },
        {
          label: "其他文件",
          files: [
            {
              name: "文件一",
              url: "#"
            },
            {
              name: "文件2",
              url: "#"
            }
          ]
        }
      ],
      faqDialogFormVisible: false,
      faqFormControls: [
        {
          id: "faq-content",
          type: 1,
          subtype: "textarea",
          label: "疑问内容",
          field: "content",
          // unit: "万",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "faq-file",
          type: 8,
          //   subtype: "file",
          label: "答疑附件",
          field: "faqannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".pdf",
          fileSize: 5
        }
      ],
      faqFormModel: {},
      bidMoneyFormModel: {},
      bidMoneyFormControls: [
        {
          id: "money-content",
          type: 1,
          subtype: "textarea",
          label: "备注说明",
          field: "content",
          // unit: "万",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "money-file",
          type: 8,
          //   subtype: "file",
          label: "缴纳附件",
          field: "moneyannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".pdf",
          fileSize: 5
        }
      ],
      bidFuncData: [
        {
          time: "2019-01-01 12:30:03"
        },
        {
          time: "2019-01-01 12:30:03"
        },
        {
          time: "2019-01-01 12:30:03"
        },
        {
          time: "2019-01-01 12:30:03"
        },
        {
          time: "2019-01-01 12:30:03"
        },
        {
          time: "2019-01-01 12:30:03"
        }
      ],
      bidFuncFormControls: [
        {
          id: "faq-content",
          type: 1,
          subtype: "textarea",
          label: "投标说明",
          field: "content",
          // unit: "万",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "faq-file",
          type: 8,
          //   subtype: "file",
          label: "技术标附件",
          field: "faqannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".pdf",
          fileSize: 5
        }
      ],
      bidFuncFormModel: {},
      bidPriceData: [
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        }
      ],
      bidPriceFormControls: [
        {
          id: "price-money",
          type: 1,
          subtype: "number",
          label: "回标总金额",
          field: "money",
          unit: "元",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-rate",
          type: 1,
          subtype: "number",
          label: "税率",
          field: "rate",
          unit: "%",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-file",
          type: 8,
          //   subtype: "file",
          label: "商务标附件",
          field: "faqannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".pdf",
          fileSize: 5
        }
      ],
      bidPriceFormModel: {},
      bidPrice2Data: [
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        }
      ],
      bidPrice2FormControls: [
        {
          id: "price-money",
          type: 1,
          subtype: "number",
          label: "回标总金额",
          field: "money",
          unit: "元",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-rate",
          type: 1,
          subtype: "number",
          label: "税率",
          field: "rate",
          unit: "%",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-file",
          type: 8,
          //   subtype: "file",
          label: "商务标附件",
          field: "faqannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".pdf",
          fileSize: 5
        },
        {
          id: "price-file2",
          type: 8,
          //   subtype: "file",
          label: "其它标书附件",
          field: "faqannex2",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex",
          // upload_tips: "只能上传图片格式，大小不超过5MB",
          accept: ".pdf",
          fileSize: 5
        }
      ],
      bidPrice2FormModel: {}
    };
  },
  methods: {
    selectStep(step) {
      // console.log(123);
      // console.log(step);
      this.step = step;
    }
  }
};
</script>
<style lang="scss" scoped>
.bid-detail {
  .breadcrumb-wrapper {
    background: #fff;
    padding: 15px;
    margin-bottom: 15px;
    // border-bottom: 1px solid #f2f2f2;
  }

  .maincontent {
    background: #fff;
    min-height: 668px;
    width: 100%;
  }

  .step-bar-wrap {
    padding: 30px 20px;
  }

  .download-files {
    padding: 0 30px 30px;
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
        text-decoration: underline;
      }
      // }
    }
  }
}

.page-container {
  text-align: center;
  padding: 30px;
  background: #fff;
}

.stat-newbar {
  padding: 15px;
  border-bottom: 1px solid #f2f2f2;
  .stat {
    display: inline-block;
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
  }
}
.list {
  padding: 0 10px;
}
.bid-money {
  padding: 30px 0;
  padding-right: 60px;
}
</style>


