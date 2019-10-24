<template>
  <div class="account-list box">
    <h2 class="title">合同列表</h2>
    <div class="list">
      <div style="padding: 10px 15px;">
        <el-alert title="点击箭头可查看关联的账号" type="warning"></el-alert>
      </div>
      <el-table
        :data="tableData"
        @expand-change="expandTable"
        stripe
        fit
        style="width: 100%"
        :key="$route.name"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table key="account-table" :data="subTableData" stripe fit style="width: 100%">
              <el-table-column label="账号登录名" prop="loginname"></el-table-column>
              <el-table-column label="账号名字" prop="supname"></el-table-column>
              <el-table-column label="账号手机号" prop="telephone"></el-table-column>
              <el-table-column label="岗位" prop="station_name"></el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="contractname" label="合同名称"></el-table-column>
        <el-table-column prop="project_name" label="项目名字" width="180"></el-table-column>
        <el-table-column label="关联账号" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="bindAccounts(scope.row)">关联账号</el-button>
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
      :title="'关联账号'"
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
export default {
  name: "account-contract",
  components: {
    formFields: resolve => {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      error: null,
      tableData: [],
      subTableData: [],
      expandKeys: [],
      totalSize: 0,
      isAdd: false,
      commiting: false,
      mode: "1",
      loading: false,
      currItem: null,
      page: 1,
      pageSize: 20,
      dialogFormVisible: false,
      controls: [
        {
          id: "account",
          type: 2,
          // subtype: "text",
          // required: true,
          field: "account",
          label: "选择账号",
          options: [],
          rules: [
            { required: true, message: "账号不能为空", trigger: "change" }
          ]
        },
        {
          id: "station",
          type: 2,
          // subtype: "text",
          // required: true,
          field: "station",
          options: [],
          label: "选择岗位",
          rules: [
            { required: true, message: "岗位不能为空", trigger: "change" }
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
    expandTable(row, val) {
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          const obj = val[i];
          if (obj.contractid == row.contractid) {
            this.loadAccounts2(obj);
            break;
          }
        }
      }

      if (val.length > 1) {
        //只展开当前选项
        val.shift();
      }
    },
    loadAccounts2(item) {
      this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_ContractDetail",
            p1: this.$store.state.supinfo.accountid || "",
            p2: item.contractid
          }
        },
        res => {
          console.log(res);
          if (res.code == 0 && res.data) {
            // item.accounts = res.data;
            this.subTableData = res.data;
          }
        }
      );
    },
    bindAccounts(contract) {
      this.currItem = contract;
      this.mode = "1";
      this.formModel = {};
      this.dialogFormVisible = true;
      this.loadStations();
      this.loadAccounts();
    },
    loadStations() {
      this.$post(
        {
          action: "P_MD_Account_Station"
        },
        res => {
          console.log(res);
          if (res.code == 0 && res.data) {
            const temp = [];
            res.data.forEach(ele => {
              temp.push({ label: ele.station_name, value: ele.station_id });
            });
            this.controls[1].options = temp;
          }
        }
      );
    },
    loadAccounts() {
      this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_SelectCon",
            p1: this.$store.state.supinfo.supid || "",
            p2: this.currItem.contractid,
            p3: this.$store.state.supinfo.accountid || ""
          }
        },
        res => {
          // this.loading = false;
          console.log(res);
          if (res.code == 0 && res.data) {
            // this.tableData = res.data;
            const temp = [];
            res.data.forEach(ele => {
              temp.push({ label: ele.supname, value: ele.accountid });
            });
            this.controls[0].options = temp;
          }
        }
      );
    },
    openModel() {
      // this.$refs.commForm.clearValidates();
      this.$refs.dialogForm && this.$refs.dialogForm.clearValidates();
    },
    deleteItem(account) {
      this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_ContractSet",
            p1: account.accountid,
            p2: account.contractid,
            p3: "0",
            p4: account.station_id,
            p5: this.$store.state.supinfo.accountid || ""
          }
        },
        res => {
          console.log(res);
          // this.commiting = false;
          if (res.code == 0) {
            if (res.data && res.data.length > 0) {
              if (res.data[0].ihint_type == "1") {
                this.dialogFormVisible = false;
                this.loadData();
                this.$message({
                  type: "success",
                  message: res.data[0].ihint_message
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data[0].ihint_message
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
    },
    loadData() {
      this.loading = true;
      this.$post(
        {
          action: "commapi",
          aid: this.$store.state.supinfo.accountid || "",
          token: this.$store.state.token,
          payload: {
            method: "P_MD_Account_Contract",
            p1: this.$store.state.supinfo.accountid || ""
          }
        },
        res => {
          this.loading = false;
          console.log(res);
          if (res.code == 0) {
            this.tableData = res.data;
            // this.totalSize = parseInt(res.count);
          }
        }
      );
    },
    commit() {
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
                method: "P_MD_Account_ContractSet",
                p1: this.formModel["account"],
                p2: this.currItem.contractid,
                p3: this.mode,
                p4: this.formModel["station"],
                p5: this.$store.state.supinfo.accountid || ""
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
                      message: res.data[0].ihint_message
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.data[0].ihint_message
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
</style>

