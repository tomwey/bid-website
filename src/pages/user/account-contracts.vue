<template>
  <div class="account-list box">
    <h2 class="title">合同列表</h2>
    <div class="list">
      <div style="padding: 10px 15px;">
        <el-alert title="点击箭头可查看关联的账号" type="warning"></el-alert>
      </div>
      <el-table :data="tableData" stripe fit style="width: 100%" :key="$route.name">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              key="account-table"
              :data="props.row.accounts || []"
              stripe
              fit
              style="width: 100%"
            >
              <el-table-column label="账号登录名" prop="loginname"></el-table-column>
              <el-table-column label="账号手机号" prop="telephone"></el-table-column>
              <el-table-column label="岗位" prop="stationname"></el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="contractname" label="合同名称"></el-table-column>
        <el-table-column prop="projectname" label="项目名字" width="180"></el-table-column>
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
        <el-button type="primary" @click="commit">提 交</el-button>
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
      tableData: [
        {
          projectname: "枫丹西悦一期",
          contractname: "这是合同名字",
          accounts: [
            {
              loginname: "张三",
              telephone: "13012312312",
              stationname: "项目经理"
            }
          ]
        },
        {
          projectname: "枫丹西悦一期",
          contractname: "这是合同名字",
          accounts: [
            {
              loginname: "张三",
              telephone: "13012312312",
              stationname: "项目经理"
            }
          ]
        }
      ],
      totalSize: 0,
      isAdd: false,
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
    bindAccounts(contract) {
      this.dialogFormVisible = true;
    },
    openModel() {
      // this.$refs.commForm.clearValidates();
      this.$refs.dialogForm && this.$refs.dialogForm.clearValidates();
    },
    deleteItem(account) {},
    loadData() {},
    commit() {}
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #e46623;
</style>

