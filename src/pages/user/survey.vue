<template>
  <div class="survey-list box" v-loading="loading">
    <!-- 即将上线... -->
    <h2 class="title">
      问卷列表
      <!-- <el-button @click="newFeedback()" class="right-btn" type="primary" size="small">投诉建议</el-button> -->
    </h2>
    <!-- <div class="search-toolbar">
      <el-row>
        <el-col :span="10">
          <span class="label">提交时间:</span>
          <el-date-picker
            v-model="end_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">
          <span class="label">状态:</span>
          <el-select v-model="state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="输入搜索内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>-->
    <div class="list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="researchtitle" label="标题">
          <template slot-scope="scope">
            <span class="name-link" @click="viewSurvey(scope.row)">{{scope.row.researchtitle}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_date" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="state_desc" label="状态" width="120"></el-table-column>
      </el-table>
      <div class="page-container" v-if="totalSize >= pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :page-size="pageSize"
          :current-page="page"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="问卷调查"
      :visible.sync="newFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      v-loading="loading"
      @close="$refs.surveyForm && $refs.surveyForm.resetFields()"
    >
      <!-- <form-fields
        form-ref="form"
        ref="surveyForm"
        :controls="surveyControls"
        :form-model="surveyFormModel"
      ></form-fields>-->

      <el-form
        ref="surveyForm"
        :rules="rules"
        :label-position="'top'"
        label-width="100%"
        :model="surveyFormModel"
      >
        <el-form-item
          :label="getLabel(que,index)"
          v-for="(que,index) in questions"
          :key="que.itemplanparid"
        >
          <el-input
            type="textarea"
            :rows="6"
            v-model="surveyFormModel[que.itemplanparid]"
            v-if="que.checktype === '文本'"
          ></el-input>
          <!-- 单选 -->
          <!-- <p>{{questionOptions['q' + que.itemplanparid]}}</p> -->
          <el-radio-group
            v-if="que.checktype === '单选'"
            v-model="surveyFormModel[que.itemplanparid]"
          >
            <div
              class="option-box"
              v-for="item in questionOptions['q' + que.itemplanparid]"
              :key="item.itemplanid"
            >
              <el-radio :label="item.itemplanid">
                {{item.itemname}}
                <el-input
                  size="small"
                  v-model="surveyFormModel[item.itemplanid + '_other']"
                  style="margin-left: 10px;"
                  v-if="item.need_edit === '是'"
                ></el-input>
              </el-radio>
              <preview-image :annexids="item.annexid" v-if="item.annexid"></preview-image>
            </div>
          </el-radio-group>

          <!-- 多选 -->
          <el-checkbox-group
            v-if="que.checktype === '多选'"
            v-model="surveyFormModel[que.itemplanparid]"
          >
            <div
              class="option-box"
              v-for="item in questionOptions['q' + que.itemplanparid]"
              :key="item.itemplanid"
            >
              <el-checkbox :label="item.itemplanid">
                {{item.itemname}}
                <el-input
                  v-model="surveyFormModel[item.itemplanid + '_other']"
                  size="small"
                  style="margin-left: 10px;"
                  v-if="item.need_edit === '是'"
                ></el-input>
              </el-checkbox>
              <preview-image :annexids="item.annexid" v-if="item.annexid"></preview-image>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="newFormVisible = false">关 闭</el-button>
        <el-button
          v-if="currItem && currItem.state_num !== '40'"
          v-loading="saving"
          type="primary"
          plain
          @click="save"
        >保存草稿</el-button>
        <el-button
          v-if="currItem && currItem.state_num !== '40'"
          v-loading="commiting"
          type="primary"
          @click="commit"
        >提 交</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="图片预览" :visible.sync="dialogPreviewVisible" append-to-body>
      <img :src="previewImage" style="max-width: 100%" />
    </el-dialog>-->
  </div>
</template>
<script>
export default {
  name: "survey",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    },
    previewImage: function(resolve) {
      require(["@/components/preview-image"], resolve);
    }
  },
  data() {
    return {
      tableData: [],
      currItem: null,
      loading: false,
      commiting: false,
      saving: false,
      rules: {},
      surveyControls: [],
      surveyFormModel: {},
      newFormVisible: false,
      page: 1,
      // currentApply: {},
      totalSize: 0,
      pageSize: 20,
      questions: [],
      questionOptions: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getLabel(que, index) {
      let suffix = "";
      if (que.ismust === "1") {
        if (que.checktype === "文本") {
          suffix = " (*必填)";
        } else {
          suffix = " (*必选)";
        }
      }

      return `${index + 1}、` + que.itemname + suffix;
    },
    loadData() {
      // console.log(this.$store.state.supinfo);
      this.loading = true;
      this.$post(
        {
          action: "P_WS_SE_ResearchList",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.supinfo.supid || "",
          p3: this.$store.state.token,
          p4: "0"
        },
        res => {
          this.loading = false;
          console.log(res);
          if (res.code == 0) {
            this.tableData = res.data;
          }
        }
      );
    },
    commit() {
      this.save("1");
    },
    save(isSubmit = "0") {
      // const answers = [];
      // console.log(this.surveyFormModel);
      const temp = [];
      this.questions.forEach(que => {
        if (que.checktype === "文本") {
          temp.push({
            itemplanid: que.itemplanid,
            editmemo: this.surveyFormModel[que.itemplanparid]
          });
        } else if (que.checktype === "单选") {
          const val = this.surveyFormModel[que.itemplanparid];
          temp.push({
            itemplanid: val,
            editmemo: this.surveyFormModel[val + "_other"] || ""
          });
        } else if (que.checktype === "多选") {
          const arr = this.surveyFormModel[que.itemplanparid];
          arr.forEach(ele => {
            temp.push({
              itemplanid: ele,
              editmemo: this.surveyFormModel[ele + "_other"] || ""
            });
          });
        }
      });

      // console.log(temp);

      this.$refs.surveyForm.validate(flag => {
        if (flag) {
          if (isSubmit === "0") {
            this.saving = true;
          } else if (isSubmit === "1") {
            this.commiting = true;
          }

          this.$post(
            {
              action: "save_survey",
              uid: this.$store.state.supinfo.accountid || "",
              token: this.$store.state.token || "",
              rid: this.currItem.researchid || "0",
              is_submit: isSubmit || "0",
              answers: temp
            },
            res => {
              this.commiting = false;
              this.saving = false;
              // console.log(this.$refs);

              // this.$refs["dialogForm2"].$refs["form"] &&
              //   this.$refs["dialogForm2"].$refs["form"].resetFields();

              if (res.code == "0") {
                // this.dialogFormVisible = false;
                if (isSubmit === "1") {
                  this.newFormVisible = false;
                }
                this.$message({
                  type: "success",
                  message: isSubmit === "1" ? "提交成功" : "保存成功"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "error",
                  message: res.codemsg
                });
              }
            }
          );
        }
      });
    },
    readSurvey(item) {
      this.$post(
        {
          action: "P_WS_EX_Research_Look",
          p1: this.$store.state.supinfo.accountid || "",
          // p2: this.$store.state.supinfo.supid || "",
          p2: this.$store.state.token,
          p3: item.researchid
        },
        res => {}
      );
    },
    getAnswers(item, cb) {
      this.$post(
        {
          action: "P_WS_SE_Research_Item_Answer",
          p1: this.$store.state.supinfo.accountid || "",
          // p2: this.$store.state.supinfo.supid || "",
          p2: this.$store.state.token,
          p3: item.researchid
        },
        res => {
          if (cb) {
            cb(res);
          }
          // console.log(res);
        }
      );
    },
    viewSurvey(item) {
      // this.newFormVisible = true;
      this.currItem = item;
      console.log(this.currItem);
      this.surveyFormModel = {};
      this.rules = {};
      this.loading = true;
      this.getAnswers(item, res_arr => {
        console.log(res_arr);
        this.$post(
          {
            action: "P_WS_SE_Research_Item",
            p1: this.$store.state.supinfo.accountid || "",
            p2: this.$store.state.token,
            p3: item.researchid
          },
          res => {
            this.loading = false;
            if (res.code == 0) {
              const questions = [];
              const questionAnswers = {};
              (res.data || []).forEach(ele => {
                if (ele.itemtype === "问题") {
                  questions.push(ele);

                  const arr_answers = res_arr.data || [];

                  const temp2 = [];
                  arr_answers.forEach(obj => {
                    // if (obj.itemplanparid === ele.itemplanparid) {

                    // }
                    if (ele.checktype === "文本") {
                      if (obj.itemplanparid === ele.itemplanparid) {
                        this.$set(
                          this.surveyFormModel,
                          ele.itemplanparid,
                          obj.editmemo
                        );
                      }
                    } else if (ele.checktype === "单选") {
                      if (obj.itemplanparid === ele.itemplanparid) {
                        this.$set(
                          this.surveyFormModel,
                          ele.itemplanparid,
                          obj.itemplanid
                        );
                        this.$set(
                          this.surveyFormModel,
                          obj.itemplanid + "_other",
                          obj.editmemo
                        );
                      }
                    } else if (ele.checktype === "多选") {
                      if (obj.itemplanparid === ele.itemplanparid) {
                        temp2.push(obj);
                      }
                    }
                  });

                  if (ele.checktype === "多选") {
                    const temp3 = [];
                    temp2.forEach(a => {
                      temp3.push(a.itemplanid);
                      this.$set(
                        this.surveyFormModel,
                        a.itemplanid + "_other",
                        a.editmemo
                      );
                    });
                    this.$set(this.surveyFormModel, ele.itemplanparid, temp3);
                  }

                  if (ele.checktype === "文本") {
                    if (ele.ismust === "1") {
                      this.rules[ele.itemplanparid] = [
                        {
                          required: true,
                          message: "此题答案不能为空",
                          trigger: "blur"
                        }
                      ];
                    }
                  } else if (ele.checktype === "单选") {
                    if (ele.ismust === "1") {
                      this.rules[ele.itemplanparid] = [
                        {
                          required: true,
                          message: "此题答案不能为空",
                          trigger: "change"
                        }
                      ];
                    }
                  } else if (ele.checktype === "多选") {
                    if (ele.ismust === "1") {
                      this.rules[ele.itemplanparid] = [
                        {
                          required: true,
                          message: "此题答案不能为空",
                          trigger: "change"
                        }
                      ];
                    }
                  }
                } else {
                  const key = "q" + ele.itemplanparid;
                  const arr = questionAnswers[key] || [];
                  arr.push(ele);
                  questionAnswers[key] = arr;
                }
              });
              this.questions = questions;
              this.questionOptions = questionAnswers;

              console.log(questions);
              console.log(questionAnswers);
            }

            this.newFormVisible = true;

            this.readSurvey(item);
          }
        );
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.name-link {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  user-select: none;
}
.el-radio,
.el-checkbox {
  display: block;
}

.option-box {
  .preview-image {
    margin-left: 25px;
  }
}
</style>