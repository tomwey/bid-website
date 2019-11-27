<template>
  <div class="account-list box" v-loading="loading">
    <h2 class="title">
      账号列表
      <span class="add-account">
        <el-button type="primary" size="small" @click="openForm()">添加账号</el-button>
      </span>
    </h2>
    <div class="list">
      <el-table :data="tableData" stripe fit style="width: 100%" :key="$route.name">
        <el-table-column prop="loginname" label="登录名"></el-table-column>
        <el-table-column prop="supname" label="账号名字"></el-table-column>
        <el-table-column prop="telephone" width="120" label="手机号"></el-table-column>
        <el-table-column prop="accountname" label="账号类型"></el-table-column>
        <!-- <el-table-column prop="roles" label="功能权限"></el-table-column>
        <el-table-column prop="roles" label="资源权限"></el-table-column>-->
        <el-table-column prop="state" label="账号状态" width="120">
          <template slot-scope="scope">{{scope.row.isvalid === 'true' ? '启用' : '禁用'}}</template>
        </el-table-column>
        <el-table-column prop="create_date" label="注册时间" width="180"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" style="margin-bottom: 10px;" @click="openForm(scope.row);">编辑</el-button> -->
            <!-- <el-button
              size="mini"
              type="danger"
              style="margin-bottom: 10px;"
              @click="deleteItem(scope.row);"
            >删除</el-button>-->
            <el-button
              size="mini"
              v-if="scope.row.isvalid === 'true'"
              type="warning"
              @click="openItem(scope.row, false);"
            >禁用</el-button>
            <el-button
              size="mini"
              v-if="scope.row.isvalid !== 'true'"
              type="success"
              @click="openItem(scope.row, true);"
            >启用</el-button>
          </template>
        </el-table-column>
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
      :title="isAdd ? '添加账号' : '修改账号'"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @open="openModel"
      center
    >
      <form-fields form-ref="form" ref="dialogForm" :controls="controls" :form-model="formModel"></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-loading="commiting" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MobileCheck,
  PasswordLengthCheck
} from "@/components/profile/validators";

export default {
  name: "account",
  components: {
    formFields: resolve => {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    var validatePassword2 = (rule, value, callback) => {
      if (value !== this.formModel.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };

    return {
      error: null,
      tableData: [],
      totalSize: 0,
      isAdd: false,
      page: 1,
      loading: false,
      commiting: false,
      pageSize: 20,
      dialogFormVisible: false,
      controls: [
        {
          id: "loginname",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "loginname",
          label: "登录名",
          rules: [
            { required: true, message: "登录名不能为空", trigger: "blur" }
          ]
        },
        {
          id: "manname",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "manname",
          label: "账号名字",
          rules: [
            { required: true, message: "账号名字不能为空", trigger: "blur" }
          ]
        },
        {
          id: "telephone",
          type: 1,
          // subtype: "text",
          // required: true,
          field: "telephone",
          label: "手机号",
          rules: [
            { required: true, message: "手机号不能为空", trigger: "blur" },
            { validator: MobileCheck, trigger: "change" }
          ]
        },
        {
          id: "account_type",
          type: 3,
          // subtype: "text",
          // required: true,
          field: "account_type",
          label: "账号类型",
          options: [
          ],
          rules: [
            { required: true, message: "账号类型不能为空", trigger: "change" }
          ]
        },
        {
          id: "password",
          type: 1,
          subtype: "password",
          field: "password",
          label: "密码",
          rules: [
            { required: true, message: "密码不能为空", trigger: "blur" },
            { validator: PasswordLengthCheck, trigger: "change" }
          ]
        },
        {
          id: "password2",
          type: 1,
          subtype: "password",
          field: "password2",
          label: "确认密码",
          rules: [
            { required: true, message: "确认密码不能为空", trigger: "blur" },
            { validator: validatePassword2, trigger: "change" }
          ]
        }
      ],
      formModel: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    bindMobile() {
      this.$router.push({ name: "bind_mobile" });
    },
    reset() {
      // console.log(123);
      // this.loginname = null;
      // this.mobile = null;
      // this.code = null;
    },
    openModel() {
      // this.$refs.commForm.clearValidates();
      this.$refs.dialogForm && this.$refs.dialogForm.clearValidates();
    },
    openForm(item = null) {
      this.isAdd = !item;
      this.formModel = {};
      this.loadAccountTypes();
      this.dialogFormVisible = true;
    },
    loadAccountTypes() {
       this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_Type",
            p1: this.$store.state.supinfo.accountid || ""
          }
        },
        res => {
          //this.loading = false;
          console.log(res);
          if (res.code == 0) {
            //this.tableData = res.data;
            if (res.data) {
              const temp = [];
              res.data.forEach(ele => {
                temp.push({label: ele.accountname, value: ele.accounttype});
              });
              this.controls[3].options = temp;
            }
          }
        }
      );
    },
    cancel() {
      this.$refs.loginModal.hide();
    },
    loadData() {
      this.loading = true;
      this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_Select",
            p1: this.$store.state.supinfo.supid || ""
          }
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
    openItem(item, flag) {
      this.loading = true;
      this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_Valid",
            p1: item.accountid || "",
            p2: flag ? "1" : "0",
            p3: this.$store.state.supinfo.accountid || ""
          }
        },
        res => {
          this.loading = false;
          console.log(res);
          if (res.code == 0) {
            if (res.data && res.data.length > 0) {
              this.$message({
                type: "success",
                message: res.data[0].hint_message
              });
            } else {
              this.$message({
                type: "error",
                message: "未知结果"
              });
            }
          } else {
            this.$message({
              type: "error",
              message: res.codemsg
            });
          }
          this.loadData();
          // if (res.code == 0) {
          //   this.tableData = res.data;
          // }
        }
      );
    },
    commit(ev) {
      // console.log(ev);
      // this.error = null;
      // ev.preventDefault();
      this.$refs.dialogForm.validateFields(valid => {
        if (valid) {
          console.log(this.formModel);
          this.commiting = true;
          this.$post(
            {
              action: "commapi",
              aid: this.$store.state.supinfo.accountid || "",
              token: this.$store.state.token,
              payload: {
                method: "P_MD_Account_Create",
                p1: this.$store.state.supinfo.supid || "",
                p2: this.formModel["account_type"],
                p3: this.formModel["loginname"],
                p4: this.GetPassword(this.formModel["password"]),
                p5: this.formModel["manname"],
                p6: this.formModel["telephone"],
                p7: this.$store.state.supinfo.accountid || "",
                p8: this.$store.state.token
              }
            },
            res => {
              console.log(res);
              this.commiting = false;
              if (res.code == 0) {
                if (res.data && res.data.length > 0) {
                  if (res.data[0].ihint_type == "1") {
                    this.dialogFormVisible = false;
                    this.loadData();
                    this.$message({
                      type: "success",
                      message: res.data[0].hint_message
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.data[0].hint_message
                    });
                  }
                } else {
                  this.$message({
                    type: "error",
                    message: "不正确结果"
                  });
                }
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
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
.title {
  position: relative;
  .add-account {
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 15px;
  }
}
</style>

