<template>
  <div class="files-download">
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
</template>
<script>
export default {
  name: "files-download",
  data() {
    return {
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
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.files-download {
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
</style>


