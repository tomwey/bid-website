<template>
  <div class="bid-detail">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/applying-bids' }">招标事项列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="maincontent">
      <div class="bid-info">
        <h2 class="title">合能地产成都公司68亩沉降观测合同招标公告</h2>
        <div class="summary">
          <span class="date">发布日期: 2019-01-01</span>&emsp;
          <span class="company">招标单位: 成都兴露合能地产开发有限公司</span>&emsp;
          <span class="view-count">浏览次数: 135</span>
        </div>
        <div class="apply-wrapper">
          <p class="end-date-tip">
            距离截止日期还剩
            <span class="countdown">15天12小时32分20秒</span>
          </p>
        </div>
      </div>
      <div class="step-bar-wrap">
        <el-steps :active="active" align-center finish-status="success">
          <el-step
            v-for="item in steps"
            :title="item.title"
            :description="item.desc"
            :key="item.step"
            :class="{selected:step === item.step}"
            @click.native="selectStep(item.step)"
          ></el-step>
        </el-steps>
      </div>
      <div class="step-content">
        <div v-if="step === 1" class="download-files">
          <el-tabs key="filesTab">
            <el-tab-pane label="标书附件">
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
            </el-tab-pane>
            <el-tab-pane label="补充材料附件">
              <el-table :data="attachmentData" key="faqTable135" stripe style="width: 100%">
                <el-table-column prop="title" label="上传描述"></el-table-column>
                <el-table-column label="附件">
                  <template slot-scope="scope">
                    <a
                      style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                      :href="scope.row.url"
                      target="_blank"
                    >附件1</a>
                    <br>
                    <a
                      style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                      :href="scope.row.url"
                      target="_blank"
                    >附件2</a>
                  </template>
                </el-table-column>
                <el-table-column prop="time" label="上传时间" width="180"></el-table-column>
                <!-- <el-table-column prop="owner" label="提疑单位" width="120"></el-table-column> -->
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="step === 2" class="faq-list">
          <el-tabs key="faqTab">
            <el-tab-pane label="提问">
              <div class="stat-newbar">
                <el-row>
                  <el-col :span="16">
                    <span class="stat">共10条</span>
                  </el-col>
                  <el-col :span="8" style="text-align:right;">
                    <el-button type="primary" @click="faqDialogFormVisible = true">新增提疑</el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="list">
                <el-table :data="faqData" key="faqTable1" stripe style="width: 100%">
                  <el-table-column prop="title" label="提问内容">
                    <template slot-scope="scope">
                      <span class="name" @click="selectItem(scope.row)">{{scope.row.title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="提问附件" width="120">
                    <template slot-scope="scope">
                      <a
                        style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                        :href="scope.row.url"
                        target="_blank"
                      >附件</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="time" label="提问时间" width="180"></el-table-column>
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
            </el-tab-pane>
            <el-tab-pane label="回复">
              <div class="stat-newbar">
                <el-row>
                  <el-col :span="16">
                    <span class="stat">共10条</span>
                  </el-col>
                </el-row>
              </div>
              <div class="list">
                <el-table :data="faqData2" key="faqTable2" stripe style="width: 100%">
                  <el-table-column prop="title" label="提问内容"></el-table-column>
                  <el-table-column label="答疑附件" width="120">
                    <template slot-scope="scope">
                      <a
                        style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                        :href="scope.row.url"
                        target="_blank"
                      >附件</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="time" label="回复时间" width="180"></el-table-column>
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
            </el-tab-pane>
          </el-tabs>

          <el-dialog
            title="新增提疑"
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
          <div class="stat-newbar">
            <el-row>
              <el-col :span="16">
                <span class="stat">共10条</span>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="primary" @click="faqDialogFormVisible = true">新增投标保证金</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list">
            <el-table key="bidMoneyDataTable" :data="bidMoneyData" stripe style="width: 100%">
              <el-table-column label="缴纳凭证附件" width="180">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="opinion" label="审批意见"></el-table-column>
              <el-table-column prop="time" label="时间" width="180"></el-table-column>
              <el-table-column prop="state" label="状态" width="120">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.state == '已通过'">{{scope.row.state}}</el-tag>
                  <el-tag type="info" v-if="scope.row.state == '已放弃'">{{scope.row.state}}</el-tag>
                  <el-tag type="primary" v-if="scope.row.state == '审核中'">{{scope.row.state}}</el-tag>
                </template>
              </el-table-column>
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
            title="新增保证金缴纳凭证"
            :visible.sync="faqDialogFormVisible"
            :append-to-body="true"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
          >
            <form-fields
              form-ref="form"
              ref="bidMoneyForm"
              :controls="bidMoneyFormControls"
              :form-model="bidMoneyFormModel"
            ></form-fields>
            <div slot="footer" class="dialog-footer">
              <el-button @click="faqDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="faqDialogFormVisible = false">提 交</el-button>
            </div>
          </el-dialog>
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
              <el-table-column label="技术附件" width="180">
                <template slot-scope="scope">
                  <a
                    style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                    :href="scope.row.url"
                    target="_blank"
                  >技术附件</a>
                </template>
              </el-table-column>
              <el-table-column prop="memo" label="投标说明"></el-table-column>
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
            <el-table
              key="bidPriceTableParent"
              :data="bidPriceParentData"
              stripe
              style="width: 100%"
            >
              <el-table-column type="expand">
                <el-table key="bidPriceTable" :data="bidPriceData" stripe style="width: 100%">
                  <el-table-column label="回标报价总金额（含税总价，单位元）" prop="money" width="280">
                    <template slot-scope="scope">
                      <span
                        @click="showMoney(scope.row);"
                      >{{scope.row.showmoney ? scope.row.money : "********"}}</span>
                    </template>
                  </el-table-column>
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
                  <el-table-column label="其它标书附件">
                    <template slot-scope="scope">
                      <a
                        style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                        :href="scope.row.url"
                        target="_blank"
                      >附件</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="time" label="投标时间" width="180"></el-table-column>
                </el-table>
              </el-table-column>
              <el-table-column label="事项名称" prop="title"></el-table-column>
              <el-table-column label="项目" prop="project" width="120"></el-table-column>
              <el-table-column label="楼栋/标段" prop="room" width="120"></el-table-column>
              <el-table-column label="投标截止时间" prop="time" width="120"></el-table-column>
            </el-table>
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
            <el-table
              key="bidPriceTableParent2"
              :data="bidPriceParentData"
              stripe
              style="width: 100%"
            >
              <el-table-column type="expand">
                <el-table key="bidPriceTable2" :data="bidPriceData" stripe style="width: 100%">
                  <el-table-column label="议标报价总金额（含税总价，单位元）" prop="money" width="280">
                    <template slot-scope="scope">
                      <span
                        @click="showMoney(scope.row);"
                      >{{scope.row.showmoney ? scope.row.money : "********"}}</span>
                    </template>
                  </el-table-column>
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
                  <el-table-column prop="time" label="投标时间" width="180"></el-table-column>
                </el-table>
              </el-table-column>
              <el-table-column label="事项名称" prop="title"></el-table-column>
              <el-table-column label="项目" prop="project" width="120"></el-table-column>
              <el-table-column label="楼栋/标段" prop="room" width="120"></el-table-column>
              <el-table-column label="投标截止时间" prop="time" width="120"></el-table-column>
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
        <div v-if="step === 7" class="bid-result" style="padding: 30px;">
          <el-table key="bidResultTable" :data="bidResultData" stripe style="width: 100%">
            <el-table-column label="投标事项名称" prop="title"></el-table-column>
            <el-table-column label="通知书附件" width="160">
              <template slot-scope="scope">
                <a
                  style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                  :href="scope.row.url"
                  target="_blank"
                >附件</a>
              </template>
            </el-table-column>
            <el-table-column label="是否中标" width="120">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="!scope.row.status">未中标</el-tag>
                <el-tag type="success" v-if="scope.row.status">已中标</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
          desc: "04-05截止",
          step: 1
        },
        {
          title: "答疑",
          desc: "05-05截止",
          step: 2
        },
        {
          title: "投标保证金缴纳",
          desc: "06-05截止",
          step: 3
        },
        {
          title: "技术标",
          desc: "08-05截止",
          step: 4
        },
        {
          title: "商务标",
          desc: "12-05截止",
          step: 5
        },
        {
          title: "议标",
          desc: "12-15截止",
          step: 6
        },
        {
          title: "定标",
          desc: "12-25截止",
          step: 7
        }
      ],
      bidResultData: [
        {
          title: "《合能.深圳中央花园商业及住宅维修整改工程招标",
          status: true
        },
        {
          title: "《合能.深圳中央花园商业及住宅维修整改工程招标",
          status: false
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
      attachmentData: [
        {
          title: "第一次上传",
          time: "2019-02-03 13:30:12"
        },
        {
          title: "第二次上传",
          time: "2019-03-03 13:30:12"
        },
        {
          title: "第三次上传",
          time: "2019-04-03 13:30:12"
        }
      ],
      faqData2: [
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
      downloadFiles2: [
        {
          label: "补充材料一",
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
          label: "补充材料二",
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
        },
        {
          id: "is-reconnaissance",
          type: 5,
          label: "是否踏勘",
          field: "isreconnaissance"
        }
      ],
      faqFormModel: {},
      bidMoneyData: [
        {
          time: "2019-02-03 12:30:30",
          opinion: "无",
          state: "审核中"
        },
        {
          time: "2019-02-03 12:30:30",
          opinion: "无",
          state: "已通过"
        },
        {
          time: "2019-02-03 12:30:30",
          opinion: "这是审核意见，这是审核意见",
          state: "已放弃"
        }
      ],
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
          time: "2019-01-01 12:30:03",
          memo:
            "这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，"
        },
        {
          time: "2019-01-01 12:30:03",
          memo:
            "这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，"
        },
        {
          time: "2019-01-01 12:30:03",
          memo:
            "这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，"
        },
        {
          time: "2019-01-01 12:30:03",
          memo:
            "这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，"
        },
        {
          time: "2019-01-01 12:30:03",
          memo:
            "这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，这是投标说明，"
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
        }
        // {
        //   money: "2394483",
        //   rate: "0.03",
        //   time: "2019-01-01 12:30:03"
        // },
        // {
        //   money: "2394483",
        //   rate: "0.03",
        //   time: "2019-01-01 12:30:03"
        // },
        // {
        //   money: "2394483",
        //   rate: "0.03",
        //   time: "2019-01-01 12:30:03"
        // },
        // {
        //   money: "2394483",
        //   rate: "0.03",
        //   time: "2019-01-01 12:30:03"
        // },
        // {
        //   money: "2394483",
        //   rate: "0.03",
        //   time: "2019-01-01 12:30:03"
        // }
      ],
      bidPriceParentData: [
        {
          title: "子事项一",
          project: "项目一",
          room: "5栋#3标段",
          time: "2019-03-06"
        },
        {
          title: "子事项一",
          project: "项目一",
          room: "5栋#3标段",
          time: "2019-03-06"
        },
        {
          title: "子事项一",
          project: "项目一",
          room: "5栋#3标段",
          time: "2019-03-06"
        },
        {
          title: "子事项一",
          project: "项目一",
          room: "5栋#3标段",
          time: "2019-03-06"
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
        },
        {
          id: "other-file",
          type: 8,
          //   subtype: "file",
          label: "其它标书附件",
          field: "faqannex1",
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
    },
    showMoney(item) {
      this.$set(item, "showmoney", true);
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
    // margin-bottom: 30px;
    // .el-step {
    //   &.selected {
    //     position: relative;
    //     &::after {
    //       content: " ";
    //       width: 30px;
    //       height: 2px;
    //       background: rgb(231, 90, 22);
    //       position: absolute;
    //       bottom: -10px;
    //       left: 48px;
    //     }
    //   }
    // }
  }

  .bid-info {
    margin-top: 20px;
    padding: 30px 15px 10px;
    background: #fff;
    // min-height: 660px;
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
  // padding: 30px 0;
  padding-right: 60px;
}

.faq-list {
  padding: 0 30px 30px;
}
</style>
<style lang="scss">
.el-step__head.is-process {
  color: rgb(231, 90, 22);
  border-color: rgb(231, 90, 22);
}

.el-step__title.is-process,
.el-step__description.is-process {
  color: rgb(231, 90, 22);
}

.el-step {
  &:hover {
    // color: rgb(231, 90, 22);
    cursor: pointer;

    // .el-step__head,
    // .el-step__title,
    // .el-step__description {
    //   color: rgb(231, 90, 22);
    //   border-color: rgb(231, 90, 22);
    // }
    .el-step__main {
      background: #f2f2f2;
      padding-bottom: 5px;
    }
  }
  &.selected {
    // color: rgb(231, 90, 22);
    // cursor: pointer;

    // .el-step__head,
    // .el-step__title,
    // .el-step__description {
    //   color: rgb(231, 90, 22);
    //   border-color: rgb(231, 90, 22);
    // }
    .el-step__main {
      background: #f2f2f2;
      padding-bottom: 5px;
      position: relative;
      &::after {
        content: " ";
        // color: #f2f2f2;
        display: block;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAHZ0lEQVR4Xu3dv44jRRSF8ekEIaG1eBRiMgJIIOFJSSCBgIyYR0EeISGSRiPNomHZmWpfV/W/89uEoHx7fb5TH9ezK8z04BcCCLxKYMIGAQReJ0AQtwOBNwgQxPVAgCDuAAI1AjZIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBqBLoLM8/z59Xr9dZqmL2pvwxQC/QjM8/z75XL5apqmP+59ahdBnt4ESe6twnwPAj3leHo/3QQhSY96PeMeAr3l6C4ISe6p1+w9BEbIMUQQktxTs9kKgVFyDBOEJJWazVQIjJRjqCAkqdRt5hYCo+UYLghJbqnba28hsIYcqwhCkltq99olBNaSYzVBSLKkdq9ZQmBNOVYVhCRL6veatwisLcfqgpCEAFUCW8ixiSAkqV6R3Lmt5NhMEJLkXvZbk28px6aCkOTWq5L3+q3l2FwQkuRd+qWJ9yDHLgQhydIrk/O6vcixG0FIknP5W0n3JMeuBCFJ6+qc/3xvcuxOEJKcX4LXEu5Rjl0KQpI8SfYqx24FIUmOJHuWY9eCkOT8kuxdjt0LQpLzSnIEOQ4hCEnOJ8lR5DiMICQ5jyRHkuNQgpDkFJL89u7du297fOPhWjS6fnHcGm/aNziuQXnI7/EkxzfTNP055OmDHno4QWySQTdh7GMPKcfhPmK97NAmGXujOz79sHIcWhCbpOMVHveoQ8txeEHeS/L4+PjTw8PDl+N69uQCgcPLcQpBniX57PHx8WeSFK7xmJFTyHEaQUgy5pYXn3oaOU4lCEmK17nv2KnkOJ0gJOl722982unkOKUgJLnxWvd5+SnlOK0gJOlz6xc+5bRynFoQkiy83ve97NRynF4Qktx3+xvTp5cjQhCSDJEkQo4YQUjSVZIYOaIEIUkXSaLkiBOEJHdJEidHpCAkKUkSKUesICS5SZJYOaIFIckiSaLliBeEJG9KEi8HQZ7vxzzP/nuS/7pCjmceh/zShkUfDm58EUn+BUaOF3eHIC9gkOSBHB/8i5UgHwAJloQcH/nUQZCPQAmUhByvfCQnyCtggiQhxxs/rxLkDTgBkpCj8Yc5BGkAOrEk5FjwJ50EWQDphJKQY0Hv/qJwIaST/Y07OW7o3Qa5AdYJNgk5bujbBrkR1pE3yTzPv1wul++P9v/nKFTUdcQGKeA82iZ5luO7aZr+LsSNHiFIsf6jSEKOYsHPYwS5g9/eJSHHHeUS5H54e/6ZhBx9+rVBOnDc2yYhR4dSbZB+EPe0ScjRt1cbpCPPrTcJOTqWaYP0h7nlJiHHmD5tkAFcnzbJ9Xr9YZqmrwc8/n+PJMc4ygQZxHae50+u1+uPoyUhx6ACfcQaC/b549ZQScgxvkMbZDDjUZuEHIOLs0HWATxik5Bjve5skJVY99ok5FipMBtkXdA9Ngk51u/MBlmZeXWTkGPlomyQbYBXNgk5tuvKBtmI/dJNQo6NCrJBtgW/ZJOQY/uObJCNO3htk5Bj42JskH0U8LFNQo79dGOD7KSL95vk6e1cLhdfsLCTXgiykyKeN8mnT/+cpumvHb2t6LdCkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAv8AFnp19vd60RMAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: left top;
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: -13px;
        left: 50%;
        margin-left: -10px;
        // left: 0;
      }
    }
  }
}
</style>



